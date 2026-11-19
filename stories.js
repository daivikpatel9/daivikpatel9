/* Step-by-step explainer sketches (see SKETCH-CONTRACT.md). Art lives in img/b/sketch/.
   Every caption and detail is taken from the project's own text in content.js / data.js. */
window.STORIES = {
  "robot": {
    "storyTitle": "How the boat finds trash",
    "story": [
      { "key": "look", "by": "robot",
        "caption": "A small boat floats, its camera watching the water ahead.",
        "detail": "The hull is a sheet of corrugated plastic board floating on three empty water bottles. The AI camera faces forward from the Raspberry Pi case, and two paddle wheels made from old tires and popsicle sticks drive it." },
      { "key": "detect", "by": "robot",
        "caption": "The camera itself spots a bottle, with no internet.",
        "detail": "The Raspberry Pi AI Camera's Sony IMX500 sensor runs the stock MobileNet-SSD model on the sensor chip itself and reports each object's label, confidence and box. That is edge AI: no cloud, lower power and lower cost." },
      { "key": "decide", "by": "robot",
        "caption": "A small computer picks a direction and tells the motor board.",
        "detail": "A Python script on the Raspberry Pi 5 reads the detections: an object on the left means turn left, on the right means turn right, in between means go forward, and it never steers at people. It sends one character over USB serial (f, l, r or s) to an Arduino Uno, which drives the motors through an L293D motor shield." },
      { "key": "steer", "by": "robot",
        "caption": "The paddle wheels turn and the boat steers toward it.",
        "detail": "Turning works by stopping one side: to turn left, the left motor stops and the right one keeps driving. Because the script keeps checking where the target is and correcting, the steering also made up for the drift from the USB power cable." },
      { "key": "reach", "by": "robot",
        "caption": "It reaches the bottle and stops when it is close.",
        "detail": "A box wider than 850 px means too close: stop, and this rule has the highest priority. It reached every upright object in testing and about 64% across nearly 60 trials; objects on their side were reached 33.3% of the time, because the stock model's training data is mostly upright objects." }
    ]
  },
  "remote": {
    "storyTitle": "How I reach home with no open ports",
    "story": [
      { "key": "home", "by": "remote",
        "caption": "At home, no ports are open to the outside.",
        "detail": "The home network has no open ports. The only open ports are on the Oracle cloud server, and the proxy runs there, not on the home server." },
      { "key": "tunnel", "by": "remote",
        "caption": "The home server opens a tunnel out to a cloud relay.",
        "detail": "On my Unraid server, a tunnel client (frpc) is linked to a tunnel server on a small Oracle cloud server. The home server opens the tunnel outbound." },
      { "key": "visit", "by": "remote",
        "caption": "Someone somewhere else opens a web address.",
        "detail": "A request arrives from outside the house. The small Oracle cloud server acts as the front door." },
      { "key": "pass", "by": "remote",
        "caption": "The relay passes the request down the tunnel.",
        "detail": "Nginx Proxy Manager, a reverse proxy with a web interface, receives the visitor's request on the cloud server and hands it to the tunnel server on the same machine, which passes it to the tunnel client at home." },
      { "key": "answer", "by": "services",
        "caption": "The service at home answers back the same way.",
        "detail": "The tunnel client passes the request on to the app the visitor asked for. It runs as a container on the Unraid server, and remote media playback goes through this path." },
      { "key": "tailscale", "by": "remote",
        "caption": "My own devices use a separate private path.",
        "detail": "Tailscale, a private mesh VPN, covers private access from my own devices. Frigate and Jellyfin each have their own Tailscale identity, so the camera recorder and the media server can be reached on their own." }
    ]
  },
  "displays": {
    "storyTitle": "Photos until someone arrives",
    "story": [
      { "key": "photos", "by": "displays",
        "caption": "The wall tablet and the TV show family photos.",
        "detail": "Both screens run one Home Assistant dashboard. The photos come from Immich, the photo library on the server, through Immich Kiosk, a slideshow app." },
      { "key": "arrive", "by": "automations",
        "caption": "Someone comes to the door, or the garage opens.",
        "detail": "A display session starts on the garage opening, a doorbell person or visitor event, or a presence sensor held for 2 to 3 seconds. A latch is set first so more motion cannot restart the session." },
      { "key": "switch", "by": "displays",
        "caption": "A chime plays and both screens switch to four cameras.",
        "detail": "A sound stored on the server plays on the tablet and the TV. The tablet loads its cameras view and the TV goes to its own four-camera grid. Frigate supplies the front door tile." },
      { "key": "hold", "by": "automations",
        "caption": "The cameras stay up 90 seconds and until the doorway is clear.",
        "detail": "A 90 second timer starts with the session. The screens go back once the timer ends, the garage is closed and the doorway is clear." },
      { "key": "back", "by": "displays",
        "caption": "Then both screens go back to photos on their own.",
        "detail": "A second automation sends the screens back to photos and clears the latch. It also runs when Home Assistant starts up, so a restart sends both screens back to photos." }
    ]
  },
  "automations": {
    "stories": [
      { "id": "garage", "title": "The garage that closes itself",
        "steps": [
          { "key": "open", "by": "automations",
            "caption": "The garage door gets left open.",
            "detail": "My family kept forgetting to close the garage. A ratgdo board, which puts the garage door opener on the local network, tells Home Assistant when the door opens." },
          { "key": "timer", "by": "automations",
            "caption": "That starts a 15 minute timer.",
            "detail": "The door opening starts one shared timer. I used one shared timer instead of delays inside each automation, so all four automations can start, restart or cancel the same countdown." },
          { "key": "activity", "by": "automations",
            "caption": "Any movement in the garage starts the timer over.",
            "detail": "Motion, occupancy or a broken beam restarts the timer: 3, 2 or 10 minutes by time of day. Closing the door by hand cancels it." },
          { "key": "close", "by": "automations",
            "caption": "With nobody there, the timer ends and the door closes.",
            "detail": "When the timer ends, Home Assistant closes the door. The opener's own obstruction beam still stops the door from closing on anything in its path; that stays the opener's job, and ratgdo reports a broken beam as one more sign that someone is still there." },
          { "key": "tell", "by": "displays",
            "caption": "Phones get a message and the tablet chimes.",
            "detail": "Phones get a notification and the tablet chimes. A shared helper puts a red \"Garage Open!\" banner on the wall tablet dashboard." }
        ] },
      { "id": "remote", "title": "One wall remote, other brands' lights",
        "steps": [
          { "key": "press", "by": "automations",
            "caption": "Someone presses a button on the wall remote.",
            "detail": "One Philips Hue remote controls devices from three brands: three brands share four buttons. Two more remotes do the same job in other rooms." },
          { "key": "hear", "by": "automations",
            "caption": "Home Assistant hears it, with no internet needed.",
            "detail": "Hue remotes and an Aqara button talk to Home Assistant over Zigbee, a low-power wireless network for home devices. It runs locally, so the buttons keep working without the internet." },
          { "key": "toggle", "by": "automations",
            "caption": "Its buttons switch a room light and a smart plug.",
            "detail": "The remote toggles a room light and toggles a smart plug. The top button of the downstairs remote is also linked directly to a Zigbee wall switch, device to device, so it works even if Home Assistant is down." },
          { "key": "dim", "by": "automations",
            "caption": "Another button dims a light strip from a different brand.",
            "detail": "It dims a Govee LED strip. The dimmer has a floor at 1%, so a dim press never steps the strip to off." },
          { "key": "scene", "by": "automations",
            "caption": "A long press recalls a scene.",
            "detail": "One Hue remote toggles a room light, toggles a smart plug, dims a Govee LED strip and recalls scenes on a long press." }
        ] },
      { "id": "heater", "title": "A heater with no network gets a schedule",
        "steps": [
          { "key": "remote", "by": "automations",
            "caption": "The heater has no network, just a remote that works up close.",
            "detail": "A Shark tower fan heater has no network connection at all, only a small wireless remote. That remote only works from about two feet away." },
          { "key": "learn", "by": "automations",
            "caption": "A small infrared sender learns the remote's signals.",
            "detail": "I wired an infrared emitter to an ESP board, a small microcontroller, and taught it the remote's signals." },
          { "key": "buttons", "by": "automations",
            "caption": "Every key on the remote becomes a button in Home Assistant.",
            "detail": "Power, fan up and down, heat on and off, heat up and down, auto, rotate, timer and screen brightness. It works from anywhere, and it responds faster than the original remote does." },
          { "key": "schedule", "by": "automations",
            "caption": "A schedule switches the heat at set times.",
            "detail": "An automation switches the heat at set times of day, chosen around the schedules and preferences of the people who use that room. It is a simple schedule built for people, not a data-driven one." }
        ] }
    ]
  }
};
