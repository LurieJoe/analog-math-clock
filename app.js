const SVG_NS = "http://www.w3.org/2000/svg";
const CLOCKS_KEY = "equation-clocks-v2";
const LEGACY_SETTINGS_KEY = "equation-clock-settings-v1";
const THEME_KEY = "equation-clock-theme";
const PHOTO_DB_NAME = "equation-clock-photos";
const PHOTO_STORE_NAME = "clock-photos";
const LOCAL_TIME_ZONE = "local";
const CENTER = 320;
const EQUATION_RADIUS = 210;

const defaults = {
  bodyStyle: "wall",
  faceShape: "round",
  faceColor: "#ffffff",
  rimColor: "#242424",
  equationColor: "#242424",
  equationSize: 30,
  showTicks: true,
  handStyle: "round",
  hourColor: "#242424",
  minuteColor: "#242424",
  secondColor: "#4f46e5",
  handWidth: 14,
  smoothSeconds: true,
  pendulumColor: "#4f46e5",
  pendulumLength: 110,
  pendulumBob: "oval",
  difficulty: "mixed",
  photoPositionX: 0,
  photoPositionY: 0,
  photoZoom: 100,
  photoOpacity: 100,
  photoOverlay: 35
};

const equationPools = {
  simple: {
    1: ["2 − 1", "3 ÷ 3", "0 + 1", "4 − 3"],
    2: ["1 + 1", "6 ÷ 3", "4 − 2", "2 × 1"],
    3: ["1 + 2", "9 ÷ 3", "6 − 3", "3 × 1"],
    4: ["2 + 2", "8 ÷ 2", "6 − 2", "2 × 2"],
    5: ["2 + 3", "10 ÷ 2", "6 − 1", "5 × 1"],
    6: ["3 + 3", "12 ÷ 2", "8 − 2", "2 × 3"],
    7: ["3 + 4", "14 ÷ 2", "8 − 1", "7 × 1"],
    8: ["4 + 4", "16 ÷ 2", "10 − 2", "2 × 4"],
    9: ["4 + 5", "18 ÷ 2", "12 − 3", "3 × 3"],
    10: ["5 + 5", "20 ÷ 2", "12 − 2", "2 × 5"],
    11: ["6 + 5", "22 ÷ 2", "12 − 1", "11 × 1"],
    12: ["10 + 2", "24 ÷ 2", "15 − 3", "3 × 4"]
  },
  mixed: {
    1: ["7⁰", "√1", "5 ÷ 5", "3 − 2", "2⁴ ÷ 16"],
    2: ["√4", "2¹", "8 ÷ 4", "5 − 3", "1 + 1"],
    3: ["√9", "12 ÷ 4", "2² − 1", "6 − 3", "1 + 2"],
    4: ["2²", "√16", "12 ÷ 3", "2 + 2", "8 − 4"],
    5: ["√25", "15 ÷ 3", "2² + 1", "8 − 3", "2 + 3"],
    6: ["√36", "3!", "18 ÷ 3", "2 × 3", "8 − 2"],
    7: ["√49", "2³ − 1", "21 ÷ 3", "3 + 4", "10 − 3"],
    8: ["2³", "√64", "24 ÷ 3", "4 + 4", "10 − 2"],
    9: ["3²", "√81", "27 ÷ 3", "4 + 5", "12 − 3"],
    10: ["√100", "2 × 5", "30 ÷ 3", "5 + 5", "12 − 2"],
    11: ["√121", "33 ÷ 3", "2³ + 3", "6 + 5", "12 − 1"],
    12: ["√144", "3 × 4", "2² × 3", "10 + 2", "24 ÷ 2"]
  },
  advanced: {
    1: ["sin(π⁄2)", "ln(e)", "5⁰", "√(9 − 8)", "2³ − 7"],
    2: ["log₂4", "√(2²)", "4! ÷ 12", "∛8", "2⁵ ÷ 16"],
    3: ["log₃27", "√(3²)", "(2³ + 1) ÷ 3", "3! ÷ 2", "∛27"],
    4: ["log₂16", "√(2⁴)", "2! + 2", "2³ ÷ 2", "∛64"],
    5: ["log₅3125", "√(3² + 16)", "3! − 1", "2³ − 3", "∛125"],
    6: ["3!", "log₂64", "√(2² + 32)", "2³ − 2", "∛216"],
    7: ["log₂128", "3! + 1", "√49", "2³ − 1", "∛343"],
    8: ["2³", "log₂256", "3! + 2", "√64", "∛512"],
    9: ["3²", "log₃19683", "3! + 3", "√81", "∛729"],
    10: ["log₂1024", "3! + 4", "√100", "2³ + 2", "∛1000"],
    11: ["log₂2048", "3! + 5", "√121", "2³ + 3", "∛1331"],
    12: ["log₂4096", "4! ÷ 2", "√144", "3! × 2", "∛1728"]
  }
};

const elements = {
  grid: document.querySelector("#clocks-grid"),
  addClockButton: document.querySelector("#add-clock-button"),
  settingsPanel: document.querySelector("#settings-panel"),
  closeSettings: document.querySelector("#close-settings"),
  settingsForm: document.querySelector("#settings-form"),
  timeZone: document.querySelector("#time-zone"),
  themePreference: document.querySelector("#theme-preference"),
  facePicture: document.querySelector("#face-picture"),
  removePictureButton: document.querySelector("#remove-picture-button"),
  pendulumSettings: document.querySelector("#pendulum-settings"),
  resetButton: document.querySelector("#reset-button"),
  installButton: document.querySelector("#install-button"),
  iosInstallHelp: document.querySelector("#ios-install-help"),
  updateNotification: document.querySelector("#update-notification"),
  updateNowButton: document.querySelector("#update-now-button"),
  updateLaterButton: document.querySelector("#update-later-button")
};

let clocks = loadClocks();
let activeClockId = null;
let themePreference = localStorage.getItem(THEME_KEY) || "system";
let deferredInstallPrompt = null;
let waitingServiceWorker = null;
let serviceWorkerRegistration = null;
let reloadingForUpdate = false;
const clockViews = new Map();

function openPhotoDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PHOTO_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        request.result.createObjectStore(PHOTO_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function usePhotoStore(mode, operation) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, mode);
    const request = operation(transaction.objectStore(PHOTO_STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => database.close();
  });
}

function saveClockPhoto(clockId, blob) {
  return usePhotoStore("readwrite", (store) => store.put(blob, clockId));
}

function getClockPhoto(clockId) {
  return usePhotoStore("readonly", (store) => store.get(clockId));
}

function deleteClockPhoto(clockId) {
  return usePhotoStore("readwrite", (store) => store.delete(clockId));
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `clock-${Date.now()}-${Math.random()}`;
}

function createClock(name, timeZone = LOCAL_TIME_ZONE, settings = {}) {
  return {
    id: createId(),
    name,
    timeZone,
    settings: normalizeSettings(settings),
    equations: []
  };
}

function normalizeSettings(settings = {}) {
  const normalized = { ...defaults, ...settings };
  if (
    typeof normalized.secondColor === "string" &&
    normalized.secondColor.toLowerCase() === "#b11f4b"
  ) {
    normalized.secondColor = defaults.secondColor;
  }
  if (
    typeof normalized.pendulumColor === "string" &&
    normalized.pendulumColor.toLowerCase() === "#b11f4b"
  ) {
    normalized.pendulumColor = defaults.pendulumColor;
  }
  return normalized;
}

function loadClocks() {
  try {
    const saved = JSON.parse(localStorage.getItem(CLOCKS_KEY));
    if (Array.isArray(saved) && saved.length) {
      return saved.map((clock, index) => ({
        id: clock.id || createId(),
        name: clock.name || `Clock ${index + 1}`,
        timeZone: clock.timeZone || LOCAL_TIME_ZONE,
        settings: normalizeSettings(clock.settings),
        equations: []
      }));
    }
  } catch {
    // Fall through to legacy migration.
  }

  try {
    const legacy = JSON.parse(localStorage.getItem(LEGACY_SETTINGS_KEY));
    return [createClock("Local time", LOCAL_TIME_ZONE, legacy || {})];
  } catch {
    return [createClock("Local time")];
  }
}

function saveClocks() {
  const serializable = clocks.map(({ equations, ...clock }) => clock);
  localStorage.setItem(CLOCKS_KEY, JSON.stringify(serializable));
}

function randomIndex(length) {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] % length;
  }
  return Math.floor(Math.random() * length);
}

function randomizeEquations(clock) {
  clock.equations = Array.from({ length: 12 }, (_, index) => {
    const pool = equationPools[clock.settings.difficulty][index + 1];
    const previous = clock.equations[index];
    const candidates = pool.filter((equation) => equation !== previous);
    return candidates[randomIndex(candidates.length)];
  });
}

function pointOnClock(hour, radius) {
  const angle = ((hour * 30 - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle)
  };
}

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
  return element;
}

function getFaceShapeMarkup(shape, clipId) {
  const shapes = {
    round: {
      rim: '<circle class="clock-rim" cx="320" cy="320" r="294"></circle>',
      face: '<circle class="clock-face" cx="320" cy="320" r="279"></circle>',
      clip: '<circle cx="320" cy="320" r="278"></circle>',
      overlay: '<circle class="photo-overlay" cx="320" cy="320" r="278"></circle>'
    },
    square: {
      rim: '<rect class="clock-rim" x="26" y="26" width="588" height="588" rx="76"></rect>',
      face: '<rect class="clock-face" x="44" y="44" width="552" height="552" rx="60"></rect>',
      clip: '<rect x="45" y="45" width="550" height="550" rx="59"></rect>',
      overlay: '<rect class="photo-overlay" x="45" y="45" width="550" height="550" rx="59"></rect>'
    },
    octagon: {
      rim: '<polygon class="clock-rim" points="142,26 498,26 614,142 614,498 498,614 142,614 26,498 26,142"></polygon>',
      face: '<polygon class="clock-face" points="154,45 486,45 595,154 595,486 486,595 154,595 45,486 45,154"></polygon>',
      clip: '<polygon points="155,46 485,46 594,155 594,485 485,594 155,594 46,485 46,155"></polygon>',
      overlay: '<polygon class="photo-overlay" points="155,46 485,46 594,155 594,485 485,594 155,594 46,485 46,155"></polygon>'
    },
    arch: {
      rim: '<path class="clock-rim" d="M38 614V260C38 104 164 26 320 26S602 104 602 260V614Z"></path>',
      face: '<path class="clock-face" d="M57 595V261C57 119 173 45 320 45S583 119 583 261V595Z"></path>',
      clip: '<path d="M58 594V261C58 120 174 46 320 46S582 120 582 261V594Z"></path>',
      overlay: '<path class="photo-overlay" d="M58 594V261C58 120 174 46 320 46S582 120 582 261V594Z"></path>'
    }
  };
  const selected = shapes[shape] || shapes.round;
  return `
    <defs><clipPath id="${clipId}">${selected.clip}</clipPath></defs>
    ${selected.rim}
    ${selected.face}
    <image class="face-photo" x="41" y="41" width="558" height="558"
      preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" hidden></image>
    ${selected.overlay}
  `;
}

function createClockSvg(clock) {
  const clipId = `face-clip-${clock.id}`;
  const svg = createSvgElement("svg", {
    class: "clock",
    viewBox: "0 0 640 640",
    role: "img",
    "aria-label": `${clock.name} equation clock`
  });

  svg.innerHTML = `
    ${getFaceShapeMarkup(clock.settings.faceShape, clipId)}
    <g class="tick-marks" aria-hidden="true"></g>
    <g class="equations" aria-hidden="true"></g>
    <g class="hands ${clock.settings.handStyle}" aria-hidden="true">
      <line class="hand hour-hand" x1="320" y1="337" x2="320" y2="192"></line>
      <line class="hand minute-hand" x1="320" y1="342" x2="320" y2="132"></line>
      <line class="hand second-hand" x1="320" y1="358" x2="320" y2="105"></line>
      <circle class="center-pin-outer" cx="320" cy="320" r="15"></circle>
      <circle class="center-pin" cx="320" cy="320" r="7"></circle>
    </g>
  `;

  return svg;
}

function renderTicks(view, clock) {
  view.ticks.replaceChildren();
  for (let index = 0; index < 60; index += 1) {
    const angle = (index * 6 * Math.PI) / 180;
    const major = index % 5 === 0;
    const outer = 270;
    const inner = major ? 258 : 264;
    view.ticks.append(
      createSvgElement("line", {
        class: major ? "tick major" : "tick",
        x1: (CENTER + inner * Math.sin(angle)).toFixed(2),
        y1: (CENTER - inner * Math.cos(angle)).toFixed(2),
        x2: (CENTER + outer * Math.sin(angle)).toFixed(2),
        y2: (CENTER - outer * Math.cos(angle)).toFixed(2)
      })
    );
  }
  view.ticks.hidden = !clock.settings.showTicks;
}

function getEquationSafeRadius(faceShape) {
  return {
    round: 244,
    square: 248,
    octagon: 232,
    arch: 230
  }[faceShape] || 230;
}

function boxFitsSafeCircle(box, safeRadius) {
  const corners = [
    [box.x, box.y],
    [box.x + box.width, box.y],
    [box.x, box.y + box.height],
    [box.x + box.width, box.y + box.height]
  ];
  return corners.every(([x, y]) => Math.hypot(x - CENTER, y - CENTER) <= safeRadius);
}

function renderEquations(view, clock) {
  view.equations.replaceChildren();
  if (!clock.equations.length) randomizeEquations(clock);

  clock.equations.forEach((equation, index) => {
    const hour = index + 1;
    let radius = EQUATION_RADIUS;
    let point = pointOnClock(hour, radius);
    const label = createSvgElement("g", { class: "equation-label" });
    const text = createSvgElement("text", {
      class: "equation",
      x: point.x.toFixed(2),
      y: point.y.toFixed(2)
    });
    text.style.fontSize = `${clock.settings.equationSize}px`;
    text.textContent = equation;
    label.append(text);
    view.equations.append(label);

    const maxWidth = 88;
    const measuredWidth = text.getComputedTextLength();
    if (measuredWidth > maxWidth) {
      const fittedSize = Math.max(17, clock.settings.equationSize * (maxWidth / measuredWidth));
      text.style.fontSize = `${fittedSize}px`;
    }
    if (text.getComputedTextLength() > maxWidth) {
      text.setAttribute("textLength", maxWidth);
      text.setAttribute("lengthAdjust", "spacingAndGlyphs");
    }

    let box = text.getBBox();
    const safeRadius = getEquationSafeRadius(clock.settings.faceShape);
    while (!boxFitsSafeCircle(box, safeRadius) && radius > 170) {
      radius -= 2;
      point = pointOnClock(hour, radius);
      text.setAttribute("x", point.x.toFixed(2));
      text.setAttribute("y", point.y.toFixed(2));
      box = text.getBBox();
    }
  });
}

function applyPhotoSettings(view, clock) {
  const zoom = clock.settings.photoZoom / 100;
  const size = 558 * zoom;
  const availablePan = Math.max(0, (size - 558) / 2);
  const x = CENTER - size / 2 + (clock.settings.photoPositionX / 50) * availablePan;
  const y = CENTER - size / 2 + (clock.settings.photoPositionY / 50) * availablePan;
  view.photo.setAttribute("x", x.toFixed(2));
  view.photo.setAttribute("y", y.toFixed(2));
  view.photo.setAttribute("width", size.toFixed(2));
  view.photo.setAttribute("height", size.toFixed(2));
  view.photo.setAttribute("opacity", clock.settings.photoOpacity / 100);
  view.photoOverlay.setAttribute(
    "opacity",
    view.photo.hidden ? "0" : String(clock.settings.photoOverlay / 100)
  );
}

async function loadClockPhoto(view, clock) {
  try {
    const blob = await getClockPhoto(clock.id);
    if (clockViews.get(clock.id) !== view) return;
    if (view.photoUrl) URL.revokeObjectURL(view.photoUrl);
    view.photoUrl = blob ? URL.createObjectURL(blob) : null;
    view.photo.hidden = !view.photoUrl;
    if (view.photoUrl) view.photo.setAttribute("href", view.photoUrl);
    else view.photo.removeAttribute("href");
    applyPhotoSettings(view, clock);
  } catch (error) {
    console.error("Unable to load the clock face picture:", error);
  }
}

function applyClockSettings(view, clock) {
  const style = view.card.style;
  style.setProperty("--clock-face", clock.settings.faceColor);
  style.setProperty("--clock-rim", clock.settings.rimColor);
  style.setProperty("--equation-color", clock.settings.equationColor);
  style.setProperty("--equation-size", `${clock.settings.equationSize}px`);
  style.setProperty("--hour-color", clock.settings.hourColor);
  style.setProperty("--minute-color", clock.settings.minuteColor);
  style.setProperty("--second-color", clock.settings.secondColor);
  style.setProperty("--hour-width", clock.settings.handWidth);
  style.setProperty("--minute-width", Math.max(5, clock.settings.handWidth - 4));
  style.setProperty("--pendulum-color", clock.settings.pendulumColor);
  style.setProperty("--pendulum-length", `${clock.settings.pendulumLength}px`);
  view.display.setAttribute(
    "class",
    `clock-display ${clock.settings.bodyStyle} pendulum-${clock.settings.pendulumBob}`
  );
  view.hands.setAttribute("class", `hands ${clock.settings.handStyle}`);
  view.ticks.hidden = !clock.settings.showTicks;
  view.title.textContent = clock.name;
  view.zone.textContent = displayTimeZone(clock.timeZone);
  view.svg.setAttribute("aria-label", `${clock.name} equation clock`);
  applyPhotoSettings(view, clock);
}

function displayTimeZone(timeZone) {
  if (timeZone === LOCAL_TIME_ZONE) {
    return `System · ${Intl.DateTimeFormat().resolvedOptions().timeZone.replaceAll("_", " ")}`;
  }
  return timeZone.replaceAll("_", " ");
}

function applyThemePreference(preference, persist = false) {
  themePreference = preference;
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;
  document.documentElement.setAttribute("data-theme", resolved);
  if (persist) localStorage.setItem(THEME_KEY, preference);
}

function createActionButton(label, className, action) {
  const button = document.createElement("button");
  button.className = className;
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", action);
  return button;
}

function createClockCard(clock) {
  const card = document.createElement("article");
  card.className = "clock-card";
  card.dataset.clockId = clock.id;

  const header = document.createElement("header");
  header.className = "clock-card-header";
  const heading = document.createElement("div");
  const title = document.createElement("h2");
  title.className = "clock-name";
  const zone = document.createElement("p");
  zone.className = "clock-zone";
  heading.append(title, zone);

  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";
  const randomizeClock = () => {
    randomizeEquations(clock);
    renderEquations(clockViews.get(clock.id), clock);
  };
  const newEquations = createActionButton("New equations", "small-button", randomizeClock);
  const customize = createActionButton("Customize", "small-button", () => openSettings(clock.id));
  const remove = createActionButton("Remove", "small-button danger-button", () =>
    removeClock(clock.id)
  );
  remove.hidden = clocks.length === 1;
  cardActions.append(newEquations, customize, remove);

  const menuButton = createActionButton("⋯", "mobile-menu-button", (event) => {
    event.stopPropagation();
    const opening = mobileMenu.hidden;
    closeMobileMenus();
    mobileMenu.hidden = !opening;
    menuButton.setAttribute("aria-expanded", String(opening));
  });
  menuButton.setAttribute("aria-label", `Actions for ${clock.name}`);
  menuButton.setAttribute("aria-expanded", "false");

  const mobileMenu = document.createElement("div");
  mobileMenu.className = "mobile-action-menu";
  mobileMenu.hidden = true;
  const mobileNewEquations = createActionButton(
    "New equations",
    "mobile-action-button",
    randomizeClock
  );
  const mobileCustomize = createActionButton("Customize", "mobile-action-button", () => {
    mobileMenu.hidden = true;
    openSettings(clock.id);
  });
  const mobileRemove = createActionButton(
    "Remove",
    "mobile-action-button mobile-danger-button",
    () => removeClock(clock.id)
  );
  mobileRemove.hidden = clocks.length === 1;
  mobileMenu.append(mobileNewEquations, mobileCustomize, mobileRemove);

  const mobileActions = document.createElement("div");
  mobileActions.className = "mobile-actions";
  mobileActions.append(menuButton, mobileMenu);
  header.append(heading, cardActions, mobileActions);

  const wrap = document.createElement("div");
  wrap.className = "clock-wrap";
  const display = document.createElement("div");
  display.className = `clock-display ${clock.settings.bodyStyle}`;
  const decoration = document.createElement("div");
  decoration.className = "clock-body-decoration";
  decoration.innerHTML = `
    <span class="alarm-handle"></span>
    <span class="alarm-clapper alarm-clapper-left"></span>
    <span class="alarm-clapper alarm-clapper-right"></span>
    <span class="alarm-foot alarm-foot-left"></span>
    <span class="alarm-foot alarm-foot-right"></span>
  `;
  const bird = document.createElement("div");
  bird.className = "cuckoo-bird";
  bird.setAttribute("aria-hidden", "true");
  const svg = createClockSvg(clock);
  display.append(bird, decoration, svg);
  wrap.append(display);

  const footer = document.createElement("footer");
  footer.className = "clock-footer";
  const digitalTime = document.createElement("p");
  digitalTime.className = "digital-time";
  footer.append(digitalTime);

  card.append(header, wrap, footer);
  elements.grid.append(card);

  const view = {
    card,
    display,
    title,
    zone,
    svg,
    photo: svg.querySelector(".face-photo"),
    photoOverlay: svg.querySelector(".photo-overlay"),
    ticks: svg.querySelector(".tick-marks"),
    equations: svg.querySelector(".equations"),
    hands: svg.querySelector(".hands"),
    hourHand: svg.querySelector(".hour-hand"),
    minuteHand: svg.querySelector(".minute-hand"),
    secondHand: svg.querySelector(".second-hand"),
    digitalTime,
    photoUrl: null,
    lastDisplayedSecond: -1
  };
  clockViews.set(clock.id, view);
  renderTicks(view, clock);
  applyClockSettings(view, clock);
  renderEquations(view, clock);
  loadClockPhoto(view, clock);
}

function renderAllClocks() {
  clockViews.forEach((view) => {
    if (view.photoUrl) URL.revokeObjectURL(view.photoUrl);
  });
  elements.grid.replaceChildren();
  clockViews.clear();
  clocks.forEach(createClockCard);
}

function closeMobileMenus() {
  document.querySelectorAll(".mobile-action-menu").forEach((menu) => {
    menu.hidden = true;
    menu.previousElementSibling?.setAttribute("aria-expanded", "false");
  });
}

function getClockTimeParts(date, timeZone) {
  if (timeZone === LOCAL_TIME_ZONE) {
    return {
      hour: date.getHours(),
      minute: date.getMinutes(),
      second: date.getSeconds()
    };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second)
  };
}

function formatDigitalTime(date, timeZone) {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  };
  if (timeZone !== LOCAL_TIME_ZONE) options.timeZone = timeZone;
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function updateClocks() {
  const now = new Date();
  const milliseconds = now.getMilliseconds();

  clocks.forEach((clock) => {
    const view = clockViews.get(clock.id);
    if (!view) return;
    const parts = getClockTimeParts(now, clock.timeZone);
    const seconds = clock.settings.smoothSeconds
      ? parts.second + milliseconds / 1000
      : parts.second;
    const minutes = parts.minute + seconds / 60;
    const hours = (parts.hour % 12) + minutes / 60;
    view.secondHand.style.transform = `rotate(${seconds * 6}deg)`;
    view.minuteHand.style.transform = `rotate(${minutes * 6}deg)`;
    view.hourHand.style.transform = `rotate(${hours * 30}deg)`;

    if (parts.second !== view.lastDisplayedSecond) {
      view.digitalTime.textContent = formatDigitalTime(now, clock.timeZone);
      view.lastDisplayedSecond = parts.second;
    }
  });

  requestAnimationFrame(updateClocks);
}

function populateTimeZones() {
  const localOption = new Option(
    `System local (${Intl.DateTimeFormat().resolvedOptions().timeZone})`,
    LOCAL_TIME_ZONE
  );
  elements.timeZone.add(localOption);

  const zones =
    typeof Intl.supportedValuesOf === "function"
      ? Intl.supportedValuesOf("timeZone")
      : [
          "UTC",
          "America/New_York",
          "America/Chicago",
          "America/Denver",
          "America/Los_Angeles",
          "Europe/London",
          "Europe/Paris",
          "Asia/Tokyo",
          "Australia/Sydney"
        ];
  if (!zones.includes("UTC")) {
    elements.timeZone.add(new Option("UTC", "UTC"));
  }
  zones.forEach((zone) => elements.timeZone.add(new Option(zone.replaceAll("_", " "), zone)));
}

function populateForm(clock) {
  elements.settingsForm.elements.name.value = clock.name;
  elements.settingsForm.elements.timeZone.value = clock.timeZone;
  elements.themePreference.value = themePreference;
  elements.pendulumSettings.hidden = !["grandfather", "cuckoo"].includes(
    clock.settings.bodyStyle
  );
  Object.entries(clock.settings).forEach(([name, value]) => {
    const field = elements.settingsForm.elements.namedItem(name);
    if (!field) return;
    if (field.type === "checkbox") field.checked = value;
    else field.value = value;
  });
}

function readForm() {
  const formData = new FormData(elements.settingsForm);
  return {
    name: String(formData.get("name")).trim() || "Clock",
    timeZone: formData.get("timeZone"),
    themePreference: formData.get("themePreference"),
    settings: {
      bodyStyle: formData.get("bodyStyle"),
      faceShape: formData.get("faceShape"),
      faceColor: formData.get("faceColor"),
      rimColor: formData.get("rimColor"),
      equationColor: formData.get("equationColor"),
      equationSize: Number(formData.get("equationSize")),
      showTicks: elements.settingsForm.elements.showTicks.checked,
      handStyle: formData.get("handStyle"),
      hourColor: formData.get("hourColor"),
      minuteColor: formData.get("minuteColor"),
      secondColor: formData.get("secondColor"),
      handWidth: Number(formData.get("handWidth")),
      smoothSeconds: elements.settingsForm.elements.smoothSeconds.checked,
      pendulumColor: formData.get("pendulumColor"),
      pendulumLength: Number(formData.get("pendulumLength")),
      pendulumBob: formData.get("pendulumBob"),
      difficulty: formData.get("difficulty"),
      photoPositionX: Number(formData.get("photoPositionX")),
      photoPositionY: Number(formData.get("photoPositionY")),
      photoZoom: Number(formData.get("photoZoom")),
      photoOpacity: Number(formData.get("photoOpacity")),
      photoOverlay: Number(formData.get("photoOverlay"))
    }
  };
}

function previewForm() {
  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  const next = readForm();
  applyThemePreference(next.themePreference, true);
  const difficultyChanged = next.settings.difficulty !== clock.settings.difficulty;
  const faceShapeChanged = next.settings.faceShape !== clock.settings.faceShape;
  clock.name = next.name;
  clock.timeZone = next.timeZone;
  clock.settings = next.settings;
  elements.pendulumSettings.hidden = !["grandfather", "cuckoo"].includes(
    clock.settings.bodyStyle
  );
  if (faceShapeChanged) {
    renderAllClocks();
    return;
  }
  const view = clockViews.get(clock.id);
  applyClockSettings(view, clock);
  renderTicks(view, clock);
  if (difficultyChanged) randomizeEquations(clock);
  renderEquations(view, clock);
}

function openSettings(clockId) {
  const clock = clocks.find((item) => item.id === clockId);
  if (!clock) return;
  activeClockId = clockId;
  populateForm(clock);
  elements.settingsPanel.hidden = false;
  elements.closeSettings.focus();
}

function closeSettings() {
  elements.settingsPanel.hidden = true;
  activeClockId = null;
}

function addClock() {
  const clock = createClock(`Clock ${clocks.length + 1}`);
  clocks.push(clock);
  saveClocks();
  renderAllClocks();
  openSettings(clock.id);
}

async function removeClock(clockId) {
  if (clocks.length === 1) return;
  try {
    await deleteClockPhoto(clockId);
  } catch (error) {
    console.error("Unable to remove the saved clock picture:", error);
  }
  clocks = clocks.filter((clock) => clock.id !== clockId);
  saveClocks();
  renderAllClocks();
}

elements.addClockButton.addEventListener("click", addClock);
elements.closeSettings.addEventListener("click", closeSettings);
elements.facePicture.addEventListener("change", async () => {
  const file = elements.facePicture.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    window.alert("Choose an image file for the clock face.");
    elements.facePicture.value = "";
    return;
  }

  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  try {
    await saveClockPhoto(clock.id, file);
    const view = clockViews.get(clock.id);
    if (view) await loadClockPhoto(view, clock);
  } catch (error) {
    console.error("Unable to save the clock face picture:", error);
    window.alert("The picture could not be saved on this device.");
  } finally {
    elements.facePicture.value = "";
  }
});
elements.removePictureButton.addEventListener("click", async () => {
  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  try {
    await deleteClockPhoto(clock.id);
    const view = clockViews.get(clock.id);
    if (view) await loadClockPhoto(view, clock);
  } catch (error) {
    console.error("Unable to remove the clock face picture:", error);
    window.alert("The picture could not be removed from this device.");
  }
});
elements.settingsForm.addEventListener("input", previewForm);
elements.settingsForm.addEventListener("change", previewForm);
elements.settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  const next = readForm();
  applyThemePreference(next.themePreference, true);
  clock.name = next.name;
  clock.timeZone = next.timeZone;
  clock.settings = next.settings;
  saveClocks();
  closeSettings();
});
elements.resetButton.addEventListener("click", () => {
  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  clock.settings = { ...defaults };
  randomizeEquations(clock);
  populateForm(clock);
  const view = clockViews.get(clock.id);
  applyClockSettings(view, clock);
  renderTicks(view, clock);
  renderEquations(view, clock);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeMobileMenus();
  if (!elements.settingsPanel.hidden) closeSettings();
});
document.addEventListener("click", closeMobileMenus);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (themePreference === "system") applyThemePreference("system");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  elements.installButton.hidden = false;
});
elements.installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  elements.installButton.hidden = true;
});
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  elements.installButton.hidden = true;
});

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
elements.iosInstallHelp.hidden = !(isIos && !isStandalone);

function showUpdateNotification(worker) {
  waitingServiceWorker = worker;
  elements.updateNotification.hidden = false;
}

elements.updateNowButton.addEventListener("click", () => {
  if (!waitingServiceWorker) return;
  elements.updateNowButton.disabled = true;
  waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
});

elements.updateLaterButton.addEventListener("click", () => {
  elements.updateNotification.hidden = true;
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { updateViaCache: "none" })
      .then((registration) => {
        serviceWorkerRegistration = registration;
        if (registration.waiting && navigator.serviceWorker.controller) {
          showUpdateNotification(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;
          installingWorker.addEventListener("statechange", () => {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              showUpdateNotification(installingWorker);
            }
          });
        });

        registration.update();
        window.setInterval(() => registration.update(), 30 * 60 * 1000);
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") serviceWorkerRegistration?.update();
  });
}

populateTimeZones();
applyThemePreference(themePreference);
saveClocks();
renderAllClocks();
requestAnimationFrame(updateClocks);
