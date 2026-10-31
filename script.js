// ---------- site config ----------
// Paste a Formspree (https://formspree.io) form URL here to receive submissions + resume uploads.
// Until it's set, the contact form opens the visitor's email app and the join form asks them to email their resume.
const FORM_ENDPOINT = "";
const CONTACT_EMAIL = "hello@daisydigital.com"; // TODO: replace with the real inbox

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const root = document.documentElement;

// ---------- motion toggle (defaults to the OS setting, remembered per visitor) ----------
function savedMotion() {
  try { return localStorage.getItem("dd-motion"); } catch { return null; }
}
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
root.dataset.motion = savedMotion() || (prefersReduced ? "off" : "on");
const motionOn = () => root.dataset.motion !== "off";

const motionBtn = $(".motion-toggle");
function syncMotionBtn() {
  if (!motionBtn) return;
  motionBtn.setAttribute("aria-pressed", motionOn());
  $(".state", motionBtn).textContent = motionOn() ? "on" : "off";
}
syncMotionBtn();
motionBtn?.addEventListener("click", () => {
  root.dataset.motion = motionOn() ? "off" : "on";
  try { localStorage.setItem("dd-motion", root.dataset.motion); } catch {}
  syncMotionBtn();
  if (!motionOn()) landBee();
  toast(motionOn() ? "✦ motion on" : "motion off · still cute");
});

// ---------- toast ----------
let toastTimer;
function toast(msg) {
  const el = $(".toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
}

// ---------- pixel daisy (loader, brand guide, 404) ----------
const PIXEL_DAISY = ["..PPP..", "P.PPP.P", "PPDDDPP", "PPDDDPP", "PPDDDPP", "P.PPP.P", "..PPP.."];
$$("[data-pixel-daisy]").forEach((el) => {
  PIXEL_DAISY.forEach((row, y) => [...row].forEach((c, x) => {
    const i = document.createElement("i");
    if (c === "P") i.className = "p";
    if (c === "D") i.className = "d";
    i.style.setProperty("--d", Math.round(Math.hypot(x - 3, y - 3)));
    el.appendChild(i);
  }));
});

// ---------- loader ----------
const loader = $(".loader");
if (loader) {
  const hide = () => loader.classList.add("done");
  if (!motionOn()) hide();
  else {
    const start = performance.now();
    addEventListener("load", () => setTimeout(hide, Math.max(0, 1100 - (performance.now() - start))));
    setTimeout(hide, 3000); // never block the page
  }
}

// ---------- pixel characters ----------
// Each sprite is a 16-wide grid; letters map to the palette. Overlays are extra frames (blink, typing).
const SPRITES = {
  erica: {
    pal: { H: "#3b2420", S: "#f6cfb0", E: "#2a1240", W: "#ffffff", B: "#ff9ccf", M: "#c2185b", C: "#a8d8ff", A: "#ff7ac8", K: "#e3e6ee", T: "#7cc4ff", L: "#9aa0b0" },
    rows: [
      ".....HHHHHH..AA.",
      "...HHHHHHHHHAAA.",
      "..HHHHHHHHHHHA..",
      "..HHSHHHHHSHHH..",
      "..HSSSSSSSSSSH..",
      ".HHSSSSSSSSSSHH.",
      ".HHSEESSSSEESHH.",
      ".HHSEWSSSSEWSHH.",
      ".HHSBSSSSSSBSHH.",
      ".HHSSSSMMSSSSHH.",
      ".HHHSSSSSSSSHHH.",
      ".HHH..SSSS..HHH.",
      ".HH..CCCCCC..HH.",
      "....CCCCCCCC....",
      "..SKKKKKKKKKKS..",
      "..SKTKTKTKTKKS..",
      "..KKKKKKKKKKKK..",
      ".LLLLLLLLLLLLLL.",
    ],
    frames: [
      { cls: "blink-frame", rows: { 6: ".HHSSSSSSSSSSHH.", 7: ".HHSEESSSSEESHH." } },
      { cls: "type-frame", rows: { 15: "..SKKTKTKTKTKS.." } },
    ],
  },
  bri: {
    pal: { H: "#f2c66d", Y: "#ffe14d", S: "#f6d2b8", E: "#2a1240", W: "#ffffff", B: "#ff9ccf", M: "#c2185b", C: "#ff7ac8", R: "#3b2a4f" },
    rows: [
      "......HHHH......",
      ".....HHHHHH.....",
      "...HHHHHHHHHH...",
      "..HHHHHHHHHHHY..",
      "..HHHHSSSSSSHYY.",
      "..HSSSSSSSSSSH..",
      "..HSEESSSSEESH..",
      "..HSEWSSSSEWSH..",
      "..HSBSSSSSSBSH..",
      "..HSSSSMMSSSSH..",
      "..HHSSSSSSSSHH..",
      "..HH..SSSS..HH..",
      "....CCCCCCCC....",
      "...CCCCCCCCCC...",
      "..CCCCCCCCCCRRR.",
      "..SCCCCCCCCSRWR.",
      "...CCCCCCCC.RRR.",
      "...CC....CC.....",
    ],
    frames: [
      { cls: "blink-frame", rows: { 6: "..HSSSSSSSSSSH..", 7: "..HSEESSSSEESH.." } },
      { cls: "type-frame", rows: { 15: "..SCCCCCCCCSRRR." } },
    ],
  },
};

function spriteSVG(name, headOnly) {
  const sp = SPRITES[name];
  const rows = headOnly ? sp.rows.slice(0, 12) : sp.rows;
  const runs = (rowStr, y) => {
    let out = "";
    for (let x = 0; x < rowStr.length;) {
      const c = rowStr[x];
      let w = 1;
      while (rowStr[x + w] === c) w++;
      if (sp.pal[c]) out += `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${sp.pal[c]}"/>`;
      x += w;
    }
    return out;
  };
  let body = rows.map(runs).join("");
  for (const f of sp.frames) {
    const fr = Object.entries(f.rows).filter(([y]) => +y < rows.length).map(([y, r]) => runs(r, +y)).join("");
    if (fr) body += `<g class="${f.cls}">${fr}</g>`;
  }
  return `<svg class="sprite" viewBox="0 0 16 ${rows.length}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}
$$("[data-sprite]").forEach((el) => {
  const [name, part] = el.dataset.sprite.split("-");
  el.innerHTML = spriteSVG(name, part === "head");
});

// ---------- bee ----------
const BEE = `<svg viewBox="0 0 60 50" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="wing" cx="24" cy="12" rx="10" ry="12" fill="#e8f5ff" stroke="#2a1450" stroke-width="2"/>
  <ellipse class="wing" cx="36" cy="12" rx="10" ry="12" fill="#e8f5ff" stroke="#2a1450" stroke-width="2"/>
  <ellipse cx="30" cy="30" rx="20" ry="14" fill="#ffd84d" stroke="#2a1450" stroke-width="2.5"/>
  <path d="M22 17 Q19 30 22 43 M32 16 Q29 30 32 44" stroke="#2a1450" stroke-width="5" fill="none"/>
  <circle cx="46" cy="28" r="9" fill="#2a1450"/><circle cx="49" cy="26" r="2" fill="#fff"/>
  <path d="M10 30 L4 30" stroke="#2a1450" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 20 Q54 10 58 12 M46 19 Q48 8 52 8" stroke="#2a1450" stroke-width="1.6" fill="none"/>
</svg>`;
$$("[data-bee]").forEach((el) => (el.innerHTML = BEE));

const beeStage = $(".bee-stage");
function landBee() { beeStage?.classList.add("landed"); }
$(".bee", beeStage || document)?.addEventListener("animationend", (e) => { if (e.animationName === "buzz-in") landBee(); });
$(".bee-btn")?.addEventListener("click", () => {
  const form = $("#contact-form");
  form.classList.remove("ping"); void form.offsetWidth; form.classList.add("ping");
  form.querySelector("input").focus({ preventScroll: true });
  form.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "center" });
  burst(innerWidth / 2, innerHeight / 2, 40);
});

// ---------- glitter trail + click sparkle ----------
const canvas = $("#glitter");
const finePointer = matchMedia("(pointer: fine)").matches;
const particles = [];
let burst = () => {};
if (canvas) {
  const ctx = canvas.getContext("2d");
  const base = ["#c9b6ff", "#ff7ac8", "#a8d8ff", "#ffd84d", "#ffffff", "#7c3aed"];
  const colors = () => root.classList.contains("sparkle-mode")
    ? [`hsl(${(performance.now() / 8) % 360} 95% 70%)`, "#ffffff", "#ffd84d"]
    : base;
  const resize = () => {
    const dpr = devicePixelRatio || 1;
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  addEventListener("resize", resize);

  const spawn = (x, y, speed) => {
    const c = colors();
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * speed, vy: (Math.random() - 0.5) * speed + (speed < 2 ? 0.8 : 0),
      size: Math.random() * 4 + 2, life: 1, spin: Math.random() * 3,
      star: Math.random() < 0.4, color: c[(Math.random() * c.length) | 0],
    });
  };
  burst = (x, y, n = 18) => { if (motionOn()) for (let i = 0; i < n; i++) spawn(x, y, 7); };

  if (finePointer) {
    addEventListener("mousemove", (e) => {
      if (!motionOn()) return;
      const n = root.classList.contains("sparkle-mode") ? 6 : 2;
      for (let i = 0; i < n; i++) spawn(e.clientX + (Math.random() - 0.5) * 8, e.clientY + (Math.random() - 0.5) * 8, 1.2);
      if (particles.length > 400) particles.splice(0, particles.length - 400);
    });
  }
  addEventListener("click", (e) => burst(e.clientX, e.clientY, 14));

  const star = (p) => {
    const s = p.size * 1.6;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.spin); ctx.beginPath();
    for (let i = 0; i < 4; i++) { ctx.lineTo(0, -s); ctx.lineTo(s * 0.25, -s * 0.25); ctx.rotate(Math.PI / 2); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  };
  (function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.05; p.spin += 0.1; p.life -= 0.02;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 8;
      if (p.star) star(p);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
    }
    requestAnimationFrame(tick);
  })();
}

// ---------- reveals + scroll-triggered bits ----------
function countUp(el) {
  const target = +el.dataset.count;
  if (!motionOn()) { el.textContent = target; return; }
  const t0 = performance.now();
  (function step(t) {
    const k = Math.min(1, (t - t0) / 1600);
    el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}
const io = new IntersectionObserver((entries) => {
  for (const { isIntersecting, target } of entries) {
    if (!isIntersecting) continue;
    if (target.matches(".reveal")) target.classList.add("in");
    if (target.matches(".bee-stage")) { target.classList.add("go"); if (!motionOn()) landBee(); }
    if (target.matches("[data-count]")) countUp(target);
    io.unobserve(target);
  }
}, { threshold: 0.2 });
$$(".reveal, .bee-stage, [data-count]").forEach((el) => io.observe(el));

// tabs + url bar follow the section you're on
const tabs = $$("[data-tab]");
const urlText = $("[data-url]");
const spy = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const id = e.target.id;
    tabs.forEach((t) => t.classList.toggle("active", t.getAttribute("href") === "#" + id));
    $(".tab.active")?.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (urlText) urlText.textContent = id === "about" ? "about" : id;
  }
}, { rootMargin: "-45% 0px -50% 0px" });
$$("[data-section]").forEach((s) => spy.observe(s));

// daisies bloom along the side as you scroll
const railDaisies = $$(".bloom-rail img");
if (railDaisies.length) {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const progress = max > 0 ? scrollY / max : 0;
    railDaisies.forEach((d, i) => d.classList.toggle("open", progress >= i / railDaisies.length));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ---------- camera-flash transitions ----------
const flash = $(".flash");
function camFlash() {
  if (!flash || !motionOn()) return;
  flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on");
}
$$("[data-tab], [data-flash]").forEach((a) => a.addEventListener("click", camFlash));
$$("[data-flash-nav]").forEach((a) => a.addEventListener("click", (e) => {
  if (!motionOn() || e.metaKey || e.ctrlKey) return;
  e.preventDefault();
  camFlash();
  setTimeout(() => (location.href = a.href), 220);
}));

// ---------- careers: water the garden, bloom the form ----------
const garden = $(".garden");
const canBtn = $(".can-btn");
const joinWin = $("#join-window");
function openJoin() {
  if (!joinWin) return;
  garden?.classList.add("bloomed");
  canBtn?.setAttribute("aria-expanded", "true");
  const wasHidden = joinWin.hidden;
  joinWin.hidden = false;
  if (wasHidden) {
    joinWin.classList.add("open");
    setTimeout(() => {
      joinWin.scrollIntoView({ behavior: motionOn() ? "smooth" : "auto", block: "nearest" });
      joinWin.querySelector("input").focus({ preventScroll: true });
    }, motionOn() ? 1600 : 0);
  }
  const r = canBtn?.getBoundingClientRect();
  if (r) burst(r.right, r.top + r.height / 2, 30);
}
canBtn?.addEventListener("click", () => {
  garden.classList.add("watering");
  setTimeout(() => garden.classList.remove("watering"), 1400);
  openJoin();
});
$("[data-open-join]")?.addEventListener("click", openJoin);

// resume picker
const fileDrop = $(".file-drop");
if (fileDrop) {
  const input = $("input", fileDrop);
  const label = $(".file-label", fileDrop);
  const emptyLabel = label.innerHTML;
  const esc = (s) => s.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]);
  input.addEventListener("change", () => {
    const f = input.files[0];
    label.innerHTML = f ? `🌸 <b>${esc(f.name)}</b> has bloomed<br><small>click to swap it</small>` : emptyLabel;
  });
  ["dragenter", "dragover"].forEach((t) => fileDrop.addEventListener(t, (e) => { e.preventDefault(); fileDrop.classList.add("drag"); }));
  ["dragleave", "drop"].forEach((t) => fileDrop.addEventListener(t, () => fileDrop.classList.remove("drag")));
  fileDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event("change")); }
  });
  fileDrop.resetLabel = () => (label.innerHTML = emptyLabel);
}

// ---------- forms ----------
function setStatus(form, msg, kind = "") {
  const el = $(".form-status", form);
  el.textContent = msg;
  el.className = "form-status " + kind;
}
async function submitTo(form, subject) {
  const data = new FormData(form);
  data.append("_subject", subject);
  const res = await fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("bad response");
}

$("#contact-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!FORM_ENDPOINT) {
    const d = Object.fromEntries(new FormData(form));
    const body = `name: ${d.name}\nemail: ${d.email}\nbrand: ${d.brand}\ninterested in: ${d.service}\n\n${d.message}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("new buzz from " + d.name)}&body=${encodeURIComponent(body)}`;
    setStatus(form, "opening your email app… 🐝", "ok");
    return;
  }
  try {
    setStatus(form, "buzzing…");
    await submitTo(form, "new buzz from the website 🐝");
    location.href = "thanks.html";
  } catch {
    setStatus(form, `lost in the scroll 😵‍💫 try again, or email ${CONTACT_EMAIL}`, "err");
  }
});

$("#join-window")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  const f = $("input[type=file]", form).files[0];
  if (f && f.size > 10 * 1024 * 1024) { setStatus(form, "that file's a little big, max 10mb please!", "err"); return; }
  if (!FORM_ENDPOINT) { setStatus(form, `almost there! email your resume to ${CONTACT_EMAIL} 🌱`, "ok"); return; }
  try {
    setStatus(form, "planting…");
    await submitTo(form, "new team application 🌱");
    location.href = "thanks.html?from=join";
  } catch {
    setStatus(form, `lost in the scroll 😵‍💫 try again, or email ${CONTACT_EMAIL}`, "err");
  }
});

// ---------- easter eggs ----------
function sparkleMode(on = !root.classList.contains("sparkle-mode")) {
  root.classList.toggle("sparkle-mode", on);
  toast(on ? "✦ sparkle mode unlocked ✦" : "sparkle mode off");
  if (on) for (let i = 0; i < 6; i++) setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * 0.8, 30), i * 120);
}
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let k = 0;
addEventListener("keydown", (e) => {
  k = e.key.toLowerCase() === KONAMI[k].toLowerCase() ? k + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (k === KONAMI.length) { k = 0; sparkleMode(); }
});

const secrets = $$(".secret-daisy");
let found = 0;
secrets.forEach((btn) => btn.addEventListener("click", (e) => {
  btn.classList.add("found");
  found++;
  burst(e.clientX, e.clientY, 30);
  if (found === secrets.length) { toast(`all ${found} hidden daisies found!`); setTimeout(() => sparkleMode(true), 900); }
  else toast(`you found a hidden daisy (${found}/${secrets.length})`);
}));

// email signature copy button (brand guide)
$("[data-copy-sig]")?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("#sig-code").textContent);
    toast("signature copied ✦");
  } catch { toast("couldn't copy, select the code below instead"); }
});

$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
