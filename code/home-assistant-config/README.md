# home-assistant-config

Selected, sanitized pieces of the Home Assistant setup that runs on my home server.
This is not a full backup of my configuration. It is a small set of files picked to show
how the system works.

Write-up with the system map and design decisions:
https://daivikpatel9.github.io/daivikpatel9/homelab/

## The idea: Home Assistant as the hub

Home Assistant is open-source home automation software. In my home it is the place where
about twenty separate systems meet: a garage door controller, a doorbell camera, Frigate
(a camera recorder with AI detection), presence sensors, Zigbee buttons, a thermostat,
lights and plugs from several brands, a wall tablet, a TV and our phones.

No single automation is the project. Most of the 33 active automations take an input
from one vendor's device and act on a device from another vendor. The files here are the
clearest examples of that.

## What each file shows

| File | What it shows |
|---|---|
| `automations/garage-auto-close.yaml` | Four automations around one timer. Opening the garage starts a 15 minute timer. Motion, occupancy or the obstruction beam restarts it with a length that depends on the time of day. When the timer ends the door closes, and closing the door by hand cancels the timer. |
| `automations/camera-photo-display.yaml` | The three automations that switch a wall tablet and a TV from a photo slideshow to live cameras when someone arrives or the garage opens. A latch stops repeated motion from restarting the session, a 90 second timer holds the camera view, and both screens return to photos only when the garage is closed and the doorway is clear. |
| `dashboards/tablet-tv-dashboard.yaml` | The dashboard those automations drive: a full-screen photo view, a four-camera grid for the tablet, and a separate camera grid sized for a 16:9 TV. A red "Garage Open!" banner is drawn with a CSS pseudo-element whenever the garage alert helper is on. |

## Placeholders

Device IDs, entity hash IDs, host addresses and browser IDs have been replaced with
readable placeholders in angle brackets, for example `<garage_door_device>` and
`<ha_host>`. Media metadata blocks are shortened to the content ID and type. One
experimental dashboard view was left out. The logic and ordering are unchanged
from the files that run at home. Clock times are replaced with placeholders.

These files will not run as-is. To reuse an idea, copy the structure and point the
placeholders at your own devices.

## More

- Portfolio page: https://daivikpatel9.github.io/daivikpatel9/homelab/
- GitHub profile: https://github.com/daivikpatel9

## Security note

These files show projects I have worked on. They are not a complete or current copy of my configuration, and details are left out on purpose for security reasons.
