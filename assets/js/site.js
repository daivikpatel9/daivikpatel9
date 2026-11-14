/* Site behaviour. No dependencies.
   1. Reveal-on-scroll for elements with [data-reveal].
   2. The project web: turns the plain list in #web into a draggable,
      animated graph. Without JavaScript the list stays a normal set of links. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 0. Light and dark mode toggle ---------- */
  (function () {
    var doc = document.documentElement, nav = document.querySelector(".site-nav");
    if (!nav) return;
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    function current() { return doc.getAttribute("data-theme") === "light" ? "light" : "dark"; }   // dark unless light was chosen
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "theme-toggle";
    btn.setAttribute("role", "switch");
    btn.innerHTML = '<span class="tt-track" aria-hidden="true"><span class="tt-knob"></span></span><span class="tt-label"></span>';
    function label() {
      var mode = current();
      btn.setAttribute("data-mode", mode);
      btn.setAttribute("aria-checked", mode === "dark" ? "true" : "false");
      btn.setAttribute("aria-label", "Dark mode");
      btn.querySelector(".tt-label").textContent = mode === "dark" ? "Dark" : "Light";
    }
    function apply(next) {
      doc.classList.add("theme-fade");
      doc.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      label();
      setTimeout(function () { doc.classList.remove("theme-fade"); }, 350);
    }
    // A small joke: every attempt to leave dark mode gets talked out of it. The card offers a way through.
    function seenJoke() { try { return localStorage.getItem("lightModeJoke") === "1"; } catch (e) { return true; } }
    function protest() {
      try { localStorage.setItem("lightModeJoke", "1"); } catch (e) {}
      var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!still) {                               // the switch slides over, strains, and gets shoved back
        btn.classList.add("is-resisting");
        var peek = document.createElement("div");     // the page only lightens a touch, it never really switches
        peek.className = "theme-peek"; peek.setAttribute("aria-hidden", "true");
        document.body.appendChild(peek);
        setTimeout(function () { peek.remove(); btn.classList.remove("is-resisting"); }, 1350);
      }
      var box = document.createElement("div");
      box.className = "theme-joke"; box.setAttribute("role", "alertdialog"); box.setAttribute("aria-modal", "false");
      box.setAttribute("aria-labelledby", "theme-joke-title"); box.setAttribute("aria-describedby", "theme-joke-text");
      box.innerHTML = '<p class="theme-joke-title" id="theme-joke-title">Whoa, whoa, whoa. What are you doing?</p>' +
        '<p id="theme-joke-text">Light mode? That is practically a crime against eyeballs. I put you back in the dark for your own safety.</p>' +
        '<div class="theme-joke-actions"><button type="button" class="btn" data-stay>Stay in the dark</button>' +
        '<button type="button" class="btn ghost" data-force>I really want light mode</button></div>';
      setTimeout(function () { document.body.appendChild(box); }, still ? 0 : 900);
      function close() { document.removeEventListener("keydown", onKey); box.classList.add("is-leaving"); setTimeout(function () { box.remove(); }, 220); btn.focus(); }
      function onKey(ev) { if (ev.key === "Escape") close(); }
      document.addEventListener("keydown", onKey);
      box.querySelector("[data-stay]").addEventListener("click", close);
      box.querySelector("[data-force]").addEventListener("click", function () { close(); setTimeout(function () { apply("light"); }, still ? 0 : 150); });
      setTimeout(function () { box.querySelector("[data-stay]").focus(); }, still ? 0 : 1050);
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      if (document.querySelector(".theme-joke")) return;
      if (next === "light") { protest(); return; }      // every time, not only the first
      apply(next);
    });
    if (mq.addEventListener) mq.addEventListener("change", label);
    label();
    nav.appendChild(btn);
  })();

  /* ---------- tabs-scroll: keep the current section tab visible on narrow screens ---------- */
  (function () {
    var bar = document.querySelector(".tabs .wrap"), cur = bar && bar.querySelector('a[aria-current="page"]');
    if (cur) bar.scrollLeft = Math.max(0, cur.offsetLeft - (bar.clientWidth - cur.offsetWidth) / 2);
  })();

  /* ---------- 1. Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("reveal-on");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 2. Project web ---------- */
  var root = document.getElementById("web");
  if (!root) return;
  var stage = root.querySelector(".web-stage");
  var panel = root.querySelector(".web-panel");
  var links = Array.prototype.slice.call(stage.querySelectorAll("a[data-node]"));
  if (!links.length) return;

  // Positions as percentages of the stage: [wide layout, tall layout].
  var LAYOUT = {
    homelab:     [[47, 50], [50, 45]],
    automations: [[19, 25], [22, 27]],
    cameras:     [[50, 13], [36, 9]],
    displays:    [[16, 74], [20, 64]],
    services:    [[44, 88], [36, 87]],
    film:        [[73, 90], [82, 83]],
    remote:      [[78, 68], [80, 63]],
    robot:       [[83, 22], [78, 12]]
  };

  // Connections. "loose" edges are drawn dashed.
  var EDGES = [
    ["homelab", "automations", "Automations are how the homelab reacts to what happens in the house."],
    ["homelab", "cameras", "Cameras and their AI events are one of the homelab's main inputs."],
    ["homelab", "displays", "The displays are where the household actually sees the homelab."],
    ["homelab", "services", "Everything in the homelab runs on this one server."],
    ["homelab", "remote", "Remote access is how the homelab is reached from outside the house."],
    ["cameras", "automations", "Camera alerts feed automations, which send them to phones and the TV."],
    ["automations", "displays", "Automations switch the screens between photos and live cameras."],
    ["cameras", "displays", "The camera grid on the tablet and TV comes from the camera system."],
    ["services", "cameras", "The camera recorder runs as a container on the server and uses its graphics chip."],
    ["services", "displays", "The photo slideshow on the displays is served from the photo library on the server."],
    ["services", "automations", "Home Assistant, which runs the automations, is hosted on the server."],
    ["remote", "services", "The relay and Tailscale reach services running on the server."],
    ["remote", "cameras", "The camera recorder has its own private Tailscale identity."],
    ["film", "services", "I edited the film on my server, and its file cloud was the sharing hub for clips during production.", true],
    ["robot", "cameras", "Both run object detection on local hardware instead of in the cloud.", true]
  ];

  var nodes = {};
  links.forEach(function (a, i) {
    var id = a.getAttribute("data-node");
    nodes[id] = {
      id: id, el: a, title: a.querySelector(".web-node-title").textContent,
      summary: a.getAttribute("data-summary"), href: a.getAttribute("href"),
      cta: a.getAttribute("data-cta") || "Open the page",
      phase: i * 1.7, speed: 0.55 + (i % 3) * 0.12,
      dx: 0, dy: 0, vx: 0, vy: 0, dragging: false, x: 0, y: 0
    };
  });

  root.classList.add("is-live");
  var svgNS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "web-edges");
  svg.setAttribute("aria-hidden", "true");
  stage.insertBefore(svg, stage.firstChild);

  var edges = EDGES.filter(function (e) { return nodes[e[0]] && nodes[e[1]]; }).map(function (e) {
    var p = document.createElementNS(svgNS, "path");
    p.setAttribute("class", "web-edge" + (e[3] ? " is-loose" : ""));
    svg.appendChild(p);
    return { a: e[0], b: e[1], text: e[2], loose: !!e[3], el: p };
  });

  var W = 0, H = 0, tall = false;
  function measure() {
    var r = stage.getBoundingClientRect();
    W = r.width; H = r.height; tall = W < 640;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  }

  function neighbours(id) {
    return edges.filter(function (e) { return e.a === id || e.b === id; })
      .map(function (e) { return { id: e.a === id ? e.b : e.a, text: e.text, loose: e.loose }; });
  }

  /* ----- selection and hover ----- */
  var selected = null, hovered = null;

  function paintState() {
    var focus = hovered || selected;
    var near = {};
    if (focus) { near[focus] = true; neighbours(focus).forEach(function (n) { near[n.id] = true; }); }
    Object.keys(nodes).forEach(function (id) {
      var el = nodes[id].el;
      el.classList.toggle("is-selected", id === selected);
      el.classList.toggle("is-dim", !!focus && !near[id]);
      el.setAttribute("aria-pressed", id === selected ? "true" : "false");
    });
    edges.forEach(function (e) {
      var on = !!focus && (e.a === focus || e.b === focus);
      e.el.classList.toggle("is-on", on);
      e.el.classList.toggle("is-dim", !!focus && !on);
    });
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function renderPanel(id) {
    var n = nodes[id];
    var list = neighbours(id).map(function (x) {
      return '<li><button type="button" data-goto="' + x.id + '">' + esc(nodes[x.id].title) + "</button><span>" + esc(x.text) + "</span></li>";
    }).join("");
    panel.innerHTML =
      '<div class="web-panel-main"><p class="eyebrow">Selected</p><h3>' + esc(n.title) + "</h3><p>" + esc(n.summary) + "</p>" +
      '<a class="btn" href="' + n.href + '">' + esc(n.cta) + "</a></div>" +
      '<div class="web-panel-links"><p class="eyebrow">How it connects</p><ul>' + list + "</ul></div>";
    if (!reduce && panel.animate) {
      panel.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" });
    }
  }

  function select(id, opts) {
    if (id === selected && opts && opts.navigate) { window.location.href = nodes[id].href; return; }
    selected = id;
    renderPanel(id);
    paintState();
    var el = nodes[id].el;
    if (!reduce && el.animate) {
      el.animate([{ transform: el.style.transform + " scale(1)" }, { transform: el.style.transform + " scale(1.12)" }, { transform: el.style.transform + " scale(1)" }],
        { duration: 380, easing: "ease-out" });
    }
  }

  panel.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-goto]");
    if (b) { select(b.getAttribute("data-goto")); nodes[selected].el.focus({ preventScroll: true }); }
  });

  /* ----- pointer: hover, click, drag ----- */
  Object.keys(nodes).forEach(function (id) {
    var n = nodes[id], el = n.el, startX = 0, startY = 0, baseDx = 0, baseDy = 0, moved = false, pid = null;
    el.setAttribute("role", "button");
    el.addEventListener("pointerenter", function () { hovered = id; paintState(); });
    el.addEventListener("pointerleave", function () { if (hovered === id) { hovered = null; paintState(); } });
    el.addEventListener("focus", function () { hovered = id; paintState(); });
    el.addEventListener("blur", function () { if (hovered === id) { hovered = null; paintState(); } });
    el.addEventListener("pointerdown", function (ev) {
      if (ev.button) return;
      pid = ev.pointerId; startX = ev.clientX; startY = ev.clientY; baseDx = n.dx; baseDy = n.dy; moved = false;
      n.dragging = true; n.vx = n.vy = 0;
      try { el.setPointerCapture(pid); } catch (e) {}
    });
    el.addEventListener("pointermove", function (ev) {
      if (!n.dragging || ev.pointerId !== pid) return;
      var mx = ev.clientX - startX, my = ev.clientY - startY;
      if (Math.abs(mx) + Math.abs(my) > 6) { moved = true; el.classList.add("is-dragging"); }
      if (moved) { n.dx = baseDx + mx; n.dy = baseDy + my; }
    });
    function end(ev) {
      if (!n.dragging || (ev && ev.pointerId !== pid)) return;
      n.dragging = false; el.classList.remove("is-dragging");
      try { el.releasePointerCapture(pid); } catch (e) {}
    }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("click", function (ev) {
      ev.preventDefault();
      if (moved) { moved = false; return; }
      select(id, { navigate: true });
    });
    el.addEventListener("keydown", function (ev) {
      if (ev.key === " ") { ev.preventDefault(); select(id, { navigate: true }); }
    });
  });

  /* ----- animation loop ----- */
  function edgePath(a, b, bend) {
    var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var cx = mx - (dy / len) * bend, cy = my + (dx / len) * bend;
    return "M" + a.x.toFixed(1) + " " + a.y.toFixed(1) + " Q" + cx.toFixed(1) + " " + cy.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1);
  }

  var last = 0, running = false, visible = true;
  function frame(t) {
    if (!running) return;
    var dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t;
    var time = t / 1000;
    Object.keys(nodes).forEach(function (id) {
      var n = nodes[id], pos = LAYOUT[id] ? LAYOUT[id][tall ? 1 : 0] : [50, 50];
      if (!n.dragging) {           // spring back to rest
        var k = 38, c = 7.5;
        n.vx += (-k * n.dx - c * n.vx) * dt; n.vy += (-k * n.dy - c * n.vy) * dt;
        n.dx += n.vx * dt; n.dy += n.vy * dt;
      }
      var amp = reduce ? 0 : (tall ? 3 : 6);
      var fx = Math.sin(time * n.speed + n.phase) * amp;
      var fy = Math.cos(time * n.speed * 0.8 + n.phase * 1.3) * amp;
      n.x = (pos[0] / 100) * W + n.dx + fx;
      n.y = (pos[1] / 100) * H + n.dy + fy;
      n.el.style.transform = "translate(" + n.x.toFixed(1) + "px," + n.y.toFixed(1) + "px) translate(-50%,-50%)";
    });
    edges.forEach(function (e, i) {
      e.el.setAttribute("d", edgePath(nodes[e.a], nodes[e.b], (i % 2 ? 1 : -1) * (tall ? 10 : 22)));
    });
    if (visible) requestAnimationFrame(frame);
    else running = false;
  }
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }

  measure();
  if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); start(); }).observe(stage);
  else window.addEventListener("resize", measure);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(stage);
  }
  start();
  select("homelab");
})();
