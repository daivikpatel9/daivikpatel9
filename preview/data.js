/* Shared project data for the three front-page concepts.
   Every concept reads this one list, so projects and their connections are fed in dynamically. */
window.SITE = "../";
window.ME = {
  name: "Daivik Patel",
  role: "Computer Science · UMass Lowell",
  line: "I build working systems out of hardware, code and whatever is on hand, and I care most about how the pieces connect.",
  now: "Instructor at Kids in Tech",
  /* The 20-second version for someone skimming: [value, label, project id it comes from]. */
  glance: [
    ["20+", "containers on a home server I built and run", "homelab"],
    ["33", "automations joining devices from different brands", "automations"],
    ["0", "ports open at home, with remote access from anywhere", "remote"],
    ["~$250", "robot boat that advanced to the state science fair", "robot"],
    ["2", "festival awards for a short film I edited", "film"]
  ],
  links: [["LinkedIn", "https://www.linkedin.com/in/daivik-patel-30583844b/"], ["GitHub", "https://github.com/daivikpatel9"]]
};
window.PROJECTS = [
  { id: "homelab", no: "01", title: "Homelab", kicker: "Systems · the hub", status: "Running",
    line: "One home server where about twenty systems act as one.",
    body: "I run a home server with 20+ containers and use Home Assistant to join about twenty smart home systems through 33 automations. No single app is the project. The project is how the pieces connect.",
    img: "assets/img/art/homelab.svg", fit: "contain", href: "homelab/index.html",
    alt: "Diagram: one home server running Unraid and Docker hosts Home Assistant, Frigate, Immich, Nextcloud, Jellyfin, Scrypted, remote access tools and databases. Devices around the house feed it, and it reaches the tablet, TV, phones, lights and fans, and me when I am away",
    facts: [["Containers", "20+"], ["Automations", "33"], ["Systems joined", "~20"]],
    tags: ["Unraid", "Docker", "Home Assistant"],
    links: [["automations", "Automations are how it reacts to the house."], ["services", "Everything runs on this one server."], ["remote", "Remote access is how it is reached from outside."]] },
  { id: "automations", no: "02", title: "Automations", kicker: "Homelab · Home Assistant", status: "Running",
    line: "Home Assistant as the hub for devices that were never meant to work together.",
    body: "33 active automations join devices from different brands. The garage closes itself if it is left open, a remote from one brand dims lights from another, and a heater with no network runs on a schedule.",
    img: "assets/img/art/automation-hub.jpg", fit: "cover", href: "homelab/automations.html",
    alt: "Home Assistant in the center, connected to six of my own photos: the garage door opener, a wireless remote, a thermostat, the wall tablet, the vent fan and a dashboard. Caption: 33 automations, about 20 systems joined into one",
    facts: [["Active", "33"], ["Garage loop", "4 rules, 1 timer"], ["Brands on one remote", "3"]],
    tags: ["Home Assistant", "Zigbee", "YAML"],
    links: [["displays", "Automations switch the screens between photos and cameras."], ["cameras", "Camera alerts are one of their inputs."], ["services", "Home Assistant itself runs on the server."]] },
  { id: "cameras", no: "03", title: "Cameras and AI", kicker: "Homelab · Frigate", status: "Running",
    line: "A camera recorder that does its AI at home.",
    body: "Frigate records my cameras and runs object detection, face recognition and semantic search on my own hardware. I compared three ways of feeding the doorbell in and chose stability over low delay.",
    img: "assets/img/art/cameras.svg", fit: "contain", href: "homelab/cameras.html",
    alt: "Diagram: a camera feeds a bridge, then a recorder that detects people, cars and packages on local hardware and alerts phones, the TV and the dashboard",
    /* A "show, don't tell" sequence. Each step: scene key, plain caption for anyone,
       the project that handles it, and the specifics for a technical reader (shown on click).
       Every statement here is taken from the published case-study pages. */
    storyTitle: "What happens when someone walks up",
    story: [
      { key: "walk", by: "cameras", caption: "Someone walks up to the front door.",
        detail: "The doorbell camera streams to the home server through a Scrypted bridge. I compared three ways of feeding it in and kept the bridge: it adds delay, but it was the only one that stopped the stream dropping." },
      { key: "detect", by: "cameras", caption: "The recorder spots a person, without the cloud.",
        detail: "Frigate runs object detection on the server, using a Google Coral accelerator and the integrated graphics of the i7-12700K. It picks out people, packages, animals and cars. It can also match faces against its own library and search past detections from a plain description." },
      { key: "phone", by: "automations", caption: "Phones get an alert with a picture.",
        detail: "Frigate's alert event goes into Home Assistant, which decides who hears about it. One rule sends people, packages and animals to iPhones with a thumbnail, a clip and a live view. A separate rule alerts for cars only when one crosses the driveway entrance and then the driveway, in that order." },
      { key: "tv", by: "automations", caption: "The TV shows the alert on screen.",
        detail: "A third rule on the same camera turns a Frigate alert event into an on-screen overlay on the TV through the NVIDIA Shield." },
      { key: "light", by: "automations", caption: "The outside light comes on.",
        detail: "Three small automations form a chain across two brands: the doorbell sees a person, the light turns on, and the light turning on switches the doorbell to colour night mode. When the person leaves, the light goes off and the camera returns to auto." },
      { key: "screens", by: "displays", caption: "The wall tablet and TV switch from photos to live cameras.",
        detail: "The doorbell's own person and visitor sensors start a display session in Home Assistant. A latch is set first so more motion cannot restart it, a 90 second timer starts, a chime plays, and both screens load their four-camera grid. Frigate supplies the front door tile." },
      { key: "back", by: "displays", caption: "The screens go back to photos on their own.",
        detail: "They return once the timer ends, the garage is closed and the doorway is clear. A second automation clears the latch, and it also runs when Home Assistant starts, so a restart sends both screens back to photos." }
    ],
    facts: [["Alert rules", "3"], ["Stream paths tested", "3"], ["Cloud needed", "None"]],
    tags: ["Frigate", "Google Coral", "Object detection"],
    links: [["automations", "Its alerts feed automations, which send them to phones and the TV."], ["displays", "The camera grid on the tablet and TV comes from here."], ["robot", "Both run object detection on local hardware."]] },
  { id: "displays", no: "04", title: "Displays", kicker: "Homelab · Dashboards", status: "Running",
    line: "Screens that switch from photos to cameras when someone arrives.",
    body: "A wall tablet and the TV show family photos, then switch to live cameras when someone arrives or the garage opens, and switch back on their own.",
    img: "assets/img/photos/tablet-camera-mode.jpg", fit: "cover", href: "homelab/displays.html",
    alt: "A wall-mounted tablet with its screen replaced by an illustration of a four-camera grid",
    facts: [["Screens", "2"], ["Camera hold", "90 s"], ["Cameras per grid", "4"]],
    tags: ["Home Assistant", "Kiosk dashboard", "Immich"],
    links: [["automations", "Automations decide when the screens switch."], ["cameras", "The live grid is fed by the camera system."], ["services", "The photo slideshow is served from the server."]] },
  { id: "services", no: "05", title: "Server and services", kicker: "Homelab · Infrastructure", status: "Running",
    line: "One server that hosts everything else.",
    body: "An Unraid server I built hosts my photo library, file sync, media playback and every service the rest of the homelab depends on. I added an AI accelerator later and replaced a failed boot drive.",
    img: "assets/img/photos/server-motherboard.jpg", fit: "cover", href: "homelab/services.html",
    alt: "Close-up inside the server: the motherboard with its expansion slots and heatsink, cabling running across it",
    facts: [["Processor", "i7-12700K"], ["Storage", "8 TB with parity"], ["Memory", "32 GB"]],
    tags: ["Unraid", "Docker", "Linux"],
    links: [["remote", "The relay and Tailscale reach services running here."], ["cameras", "The camera recorder runs here and uses its graphics chip."], ["film", "I edited a festival-winning film on this server."]] },
  { id: "remote", no: "06", title: "Remote access", kicker: "Homelab · Networking", status: "Running",
    line: "Reaching home with no open ports.",
    body: "A cloud relay with a tunnel, plus Tailscale, reach my services from anywhere without opening a single port on the home network. The home server opens the tunnel outbound, so the only open ports are on the cloud server.",
    img: "assets/img/art/remote-access.svg", fit: "contain", href: "homelab/remote-access.html",
    alt: "Diagram: a visitor reaches a reverse proxy on a cloud server, which passes traffic to a tunnel server. The home server opens the tunnel outbound, so no ports are open at home",
    facts: [["Ports open at home", "0"], ["Paths in", "2"]],
    tags: ["Reverse proxy", "Tunnel", "Tailscale"],
    links: [["services", "Everything it reaches lives on the server."], ["cameras", "The camera recorder has its own private Tailscale identity."]] },
  { id: "robot", no: "07", title: "Robot boat", kicker: "Robotics · Science fair", status: "Shipped",
    line: "A boat that finds floating trash and steers to it.",
    body: "A $250 boat that spots bottles and cups with object detection running on its camera. It reached every upright object in testing and advanced to the state science fair.",
    /* The owner asked for the cut-out (background removed) photo. It is a transparent image:
       show it whole, never cropped, floating on the surface with no plate or frame behind it. */
    img: "assets/img/robot/boat-cutout.webp", fit: "cutout", href: "projects/trash-cleaning-robot.html",
    alt: "The robot boat: a red plastic deck with a Raspberry Pi and camera at the front, a battery pack and motor board behind, and paddle wheels made of popsicle sticks on each side",
    facts: [["Cost", "~$250"], ["Upright objects", "100%"], ["Trials", "~60"]],
    tags: ["Raspberry Pi 5", "Arduino", "Edge AI"],
    links: [["cameras", "Both run object detection on local hardware instead of the cloud."]] },
  { id: "film", no: "08", title: "Forever in the Walls", kicker: "Film · Festival winner", status: "Shipped",
    line: "A short film I edited and did the sound design for.",
    body: "It won Best Overall and Best Production Values at the A-Town Teen Film Festival in May 2026. I had a major part in post-production: cutting the film together and building its sound.",
    img: "assets/img/film/still-hallway.jpg", fit: "cover", href: "projects/forever-in-the-walls.html",
    alt: "A still from the film: a figure in silhouette in a dark room, looking down a hallway toward a brightly lit doorway where a blurred figure stands",
    facts: [["Awards", "2"], ["Role", "Editor and sound designer"], ["Screened", "May 2026"]],
    tags: ["Editing", "Sound design", "Best Overall", "Best Production Values"],
    links: [["services", "I edited it on my server, and its file cloud was the sharing hub for clips."]] }
];
/* Everything else the original home page says. Wording is copied from the live site and must be shown in full. */
window.ME.intro = "I am a first-year Computer Science student at UMass Lowell.";
window.ME.experience = [
  { title: "Instructor", where: "Kids in Tech", when: "Current",
    body: "I work as an instructor at Kids in Tech." },
  { title: "IT Systems and Hardware Intern", where: "Lowell High School", when: "Summer 2025",
    body: "Did component-level repairs and motherboard diagnostics with iFixit precision tools. Kept written logs of recurring bugs and hardware failures, and worked through technical problems with teammates." },
  { title: "Equipment Manager, TV Production Club / Raider Media", where: "Lowell High School", when: "Aug 2024 to June 2026",
    body: "Director and Technical Director on live sports and concert broadcasts of 3 to 8 hours. Head Video Editor in Final Cut Pro (Apple's video editing software) on film projects with multiple competition wins." }
];
window.ME.skills = [
  ["Programming", "Java (core, object-oriented programming, data structures, algorithm design)"],
  ["Systems", "Windows, macOS, Linux (Ubuntu, Debian, Unraid)"],
  ["Tools", "Docker, UniFi networking, Home Assistant"],
  ["Spoken", "English, Gujarati (first language), Hindi (conversational)"]
];
window.ME.education = [
  { title: "University of Massachusetts Lowell",
    body: "Bachelor of Science in Computer Science, expected 2030. Dean's Scholarship recipient." },
  { title: "Lowell High School",
    body: "Graduated June 2026. GPA 4.14 weighted. Lowell Latin Lyceum, Early College and AP courses. State science fair finalist for the robot boat." }
];
window.ME.inProgress = { title: "More in progress", body: "Game development in Roblox Studio will be added here later." };
/* Disclaimers. Show every paragraph, unshortened. */
window.ME.aboutAI = {
  title: "About this site, and how I use AI",
  paragraphs: [
    "Every project on this site is my own work. I planned them, built the hardware, wrote and configured the software, and did the troubleshooting.",
    "I do use AI tools and large language models when they are the right tool. Sometimes that means using one as a troubleshooting step, the same way I would use documentation or a forum. Sometimes AI is part of the project itself, such as the object detection on the robot boat and in my camera system.",
    "This website was written and laid out with help from Claude, an AI assistant made by Anthropic, working from my own notes, files and configurations. I reviewed what it says, and the projects it describes are mine."
  ]
};
/* Shown on every homelab stop (ids below) and beside the map. */
window.ME.securityNote = {
  label: "Security note.",
  text: "These pages describe projects I have worked on. They are not a complete or current picture of what runs in my home, and I have left out details on purpose for security reasons.",
  appliesTo: ["homelab", "automations", "cameras", "displays", "services", "remote"]
};
window.ME.footer = {
  line: "Daivik Patel · Computer Science, UMass Lowell",
  note: "Projects built by me. This site was written with help from Claude.",
  credits: ["Open source credits", "credits.html"]
};
window.byId =function (id) { return window.PROJECTS.find(function (p) { return p.id === id; }); };
