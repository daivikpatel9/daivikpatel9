// Boat motor controller (Arduino Uno + L293D motor shield)
// Transcribed from the project notebook PDF, Assembly Day 1 (13 Feb 2026).
// TODO: replace with the original .ino file if it still exists.
#include "AFMotor_R4.h"

AF_DCMotor motorLeft(1);
AF_DCMotor motorRight(2);

// Set speed (0 to 255)
uint8_t motorSpeed = 200;

void setup() {
  Serial.begin(9600);
  Serial.println("Boat Ready! Send 'f', 'l', 'r', or 's' to stop."); // Send serial command when ready

  // Initialize speed
  motorLeft.setSpeed(motorSpeed);
  motorRight.setSpeed(motorSpeed);

  // Keep motors off at start
  motorLeft.run(RELEASE);
  motorRight.run(RELEASE);
}

void loop() {
  if (Serial.available() > 0) {
    char command = Serial.read();

    switch (command) {
      case 'f': // Forward
        Serial.println("Moving Forward");
        motorLeft.run(FORWARD);
        motorRight.run(FORWARD);
        break;

      case 'l': // Left Turn
        Serial.println("Turning Left");
        motorLeft.run(RELEASE);  // Stop left
        motorRight.run(FORWARD); // Drive right
        break;

      case 'r': // Right Turn
        Serial.println("Turning Right");
        motorLeft.run(FORWARD);  // Drive left
        motorRight.run(RELEASE); // Stop right
        break;

      case 's': // Stop
        Serial.println("Stopping");
        motorLeft.run(RELEASE);
        motorRight.run(RELEASE);
        break;
    }
  }
}
