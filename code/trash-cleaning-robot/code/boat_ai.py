# Boat AI navigation (Raspberry Pi 5 + IMX500 AI camera)
# Transcribed from the project notebook PDF, Assembly Day 6 (20 Feb 2026).
# The PDF lost the original indentation, so the block structure below was
# rebuilt from the logic. One space was restored in the detection pattern
# (") @ ") to match the camera tool's log format. TODO: replace with the original file from the Pi.
import subprocess
import re
import time
import serial
import fcntl
import os

# ARDUINO SETUP
try:
    ser = serial.Serial('/dev/ttyACM0', 9600, timeout=0.1)
    time.sleep(2)
    ser.write(b's')  # Ensure we start stopped
    print(" Connected to Arduino!")
except:
    print(" Arduino not found.")
    exit()

# config, change values if needed
LEFT_LIMIT = 400
RIGHT_LIMIT = 812
MAX_WIDTH = 850   # note- decrease to around 700 if motors stop too late
STOP_DELAY = 0.8

cmd = [
    "rpicam-hello", "-t", "0",
    "--post-process-file", "/usr/share/rpi-camera-assets/imx500_mobilenet_ssd.json",
    "-v", "2"
]

process = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)

fd = process.stderr.fileno()
fl = fcntl.fcntl(fd, fcntl.F_GETFL)
fcntl.fcntl(fd, fcntl.F_SETFL, fl | os.O_NONBLOCK)

last_seen_time = time.time()
boat_state = "s"

print("Boat Ai: Active.")

try:
    while True:
        line = ""
        try:
            line = process.stderr.readline()
        except:
            pass

        if line and " @ " in line:
            if "person" in line.lower():
                continue

            match = re.search(r": (\w+).*?\((.*?)\) @ (\d+),(\d+)\s+(\d+)x", line)

            if match:
                label = match.group(1)
                conf = float(match.group(2))
                x_pos = int(match.group(3))
                width = int(match.group(5))

                if conf > 0.5:
                    last_seen_time = time.time()

                    # brake when too close, highest priority
                    if width > MAX_WIDTH:
                        if boat_state != "s":
                            ser.write(b's')
                            boat_state = "s"
                            print(f" STOP: {label} TOO CLOSE ({width}px)")
                        continue  # Skip steering entirely!

                    # steer left or right if object is not too close
                    if x_pos < LEFT_LIMIT:
                        new_state = "l"
                    elif x_pos > RIGHT_LIMIT:
                        new_state = "r"
                    else:
                        new_state = "f"

                    # only send command if state changed
                    if new_state != boat_state:
                        ser.write(new_state.encode())
                        boat_state = new_state
                        print(f"Moving: {new_state.upper()} | Target: {label} (x: {x_pos})")

        # stop when target is lost
        if boat_state != "s" and (time.time() - last_seen_time > STOP_DELAY):
            print(" TARGET LOST: Stopping.")
            ser.write(b's')
            boat_state = "s"

        time.sleep(0.01)

except KeyboardInterrupt:
    ser.write(b's')
    process.terminate()
