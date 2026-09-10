const SVG_NS = "http://www.w3.org/2000/svg";
const CLOCKS_KEY = "equation-clocks-v2";
const LEGACY_SETTINGS_KEY = "equation-clock-settings-v1";
const THEME_KEY = "equation-clock-theme";
const APP_SETTINGS_KEY = "math-clock-app-settings-v1";
const CUSTOM_EQUATIONS_KEY = "math-clock-custom-equations-v1";
const ALARMS_KEY = "math-clock-alarms-v1";
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
  numeralStyle: "equations",
  difficulty: "mixed",
  photoPositionX: 0,
  photoPositionY: 0,
  photoZoom: 100,
  photoOpacity: 100,
  photoOverlay: 35,
  showDate: false,
  showUtcOffset: false,
  showDst: false,
  soundEnabled: true,
  hourlyChime: false,
  chimeSound: "chime"
};

const appDefaults = {
  learningMode: false,
  keepAwake: false,
  highContrast: false,
  reduceMotion: false,
  largeControls: false,
  includeCustomEquations: false
};

const presets = {
  modern: {
    bodyStyle: "wall",
    faceShape: "round",
    faceColor: "#ffffff",
    rimColor: "#242424",
    equationColor: "#242424",
    hourColor: "#242424",
    minuteColor: "#242424",
    secondColor: "#4f46e5",
    handStyle: "round",
    chimeSound: "digital"
  },
  classroom: {
    bodyStyle: "wall",
    faceShape: "square",
    faceColor: "#ffffff",
    rimColor: "#4338ca",
    equationColor: "#242424",
    hourColor: "#242424",
    minuteColor: "#242424",
    secondColor: "#4f46e5",
    difficulty: "simple",
    chimeSound: "bell"
  },
  antique: {
    bodyStyle: "grandfather",
    faceShape: "round",
    faceColor: "#f7f4ef",
    rimColor: "#5c5c5c",
    equationColor: "#242424",
    hourColor: "#242424",
    minuteColor: "#242424",
    secondColor: "#b45309",
    pendulumColor: "#f59e0b",
    chimeSound: "chime"
  },
  night: {
    bodyStyle: "wall",
    faceShape: "round",
    faceColor: "#292929",
    rimColor: "#474747",
    equationColor: "#dedede",
    hourColor: "#dedede",
    minuteColor: "#dedede",
    secondColor: "#a5b4fc",
    chimeSound: "chime"
  },
  playful: {
    bodyStyle: "cuckoo",
    faceShape: "octagon",
    faceColor: "#ffffff",
    rimColor: "#4f46e5",
    equationColor: "#242424",
    hourColor: "#242424",
    minuteColor: "#4f46e5",
    secondColor: "#f59e0b",
    pendulumColor: "#f59e0b",
    chimeSound: "cuckoo"
  }
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
  toolsButton: document.querySelector("#tools-button"),
  presentationButton: document.querySelector("#presentation-button"),
  mobileHeaderMenu: document.querySelector("#mobile-header-menu"),
  mobileActionSheet: document.querySelector("#mobile-action-sheet"),
  mobileSheetBackdrop: document.querySelector("#mobile-sheet-backdrop"),
  closeMobileActionSheet: document.querySelector("#close-mobile-action-sheet"),
  mobileToolsButton: document.querySelector("#mobile-tools-button"),
  mobilePresentationButton: document.querySelector("#mobile-presentation-button"),
  mobileAddClockButton: document.querySelector("#mobile-add-clock-button"),
  mobileInstallButton: document.querySelector("#mobile-install-button"),
  presentationExit: document.querySelector("#presentation-exit"),
  settingsPanel: document.querySelector("#settings-panel"),
  closeSettings: document.querySelector("#close-settings"),
  settingsForm: document.querySelector("#settings-form"),
  timeZone: document.querySelector("#time-zone"),
  equationDifficultySettings: document.querySelector("#equation-difficulty-settings"),
  equationDifficulty: document.querySelector("#difficulty"),
  equationDifficultyNote: document.querySelector("#equation-difficulty-note"),
  themePreference: document.querySelector("#theme-preference"),
  facePicture: document.querySelector("#face-picture"),
  removePictureButton: document.querySelector("#remove-picture-button"),
  pendulumSettings: document.querySelector("#pendulum-settings"),
  applyPresetButton: document.querySelector("#apply-preset-button"),
  resetButton: document.querySelector("#reset-button"),
  previewChimeSound: document.querySelector("#preview-chime-sound"),
  installButton: document.querySelector("#install-button"),
  installNotification: document.querySelector("#install-notification"),
  installInstructions: document.querySelector("#install-instructions"),
  installSteps: document.querySelector("#install-steps"),
  closeInstallNotification: document.querySelector("#close-install-notification"),
  installInstructionsDone: document.querySelector("#install-instructions-done"),
  updateNotification: document.querySelector("#update-notification"),
  updateNowButton: document.querySelector("#update-now-button"),
  updateLaterButton: document.querySelector("#update-later-button"),
  toolsPanel: document.querySelector("#tools-panel"),
  closeTools: document.querySelector("#close-tools"),
  learningMode: document.querySelector("#learning-mode"),
  keepAwake: document.querySelector("#keep-awake"),
  highContrast: document.querySelector("#high-contrast"),
  reduceMotion: document.querySelector("#reduce-motion"),
  largeControls: document.querySelector("#large-controls"),
  exportBackupButton: document.querySelector("#export-backup-button"),
  restoreMode: document.querySelector("#restore-mode"),
  restoreFile: document.querySelector("#restore-file"),
  restoreBackupButton: document.querySelector("#restore-backup-button"),
  backupStatus: document.querySelector("#backup-status"),
  includeCustomEquations: document.querySelector("#include-custom-equations"),
  customEquationHour: document.querySelector("#custom-equation-hour"),
  customEquationText: document.querySelector("#custom-equation-text"),
  customEquationExplanation: document.querySelector("#custom-equation-explanation"),
  addCustomEquation: document.querySelector("#add-custom-equation"),
  customEquationList: document.querySelector("#custom-equation-list"),
  notificationPermission: document.querySelector("#notification-permission"),
  alarmTime: document.querySelector("#alarm-time"),
  alarmLabel: document.querySelector("#alarm-label"),
  alarmSound: document.querySelector("#alarm-sound"),
  addAlarm: document.querySelector("#add-alarm"),
  alarmList: document.querySelector("#alarm-list"),
  alarmNotification: document.querySelector("#alarm-notification"),
  activeAlarmLabel: document.querySelector("#active-alarm-label"),
  activeAlarmTime: document.querySelector("#active-alarm-time"),
  snoozeAlarm: document.querySelector("#snooze-alarm"),
  dismissAlarm: document.querySelector("#dismiss-alarm"),
  learningNotification: document.querySelector("#learning-notification"),
  learningExpression: document.querySelector("#learning-expression"),
  learningExplanation: document.querySelector("#learning-explanation"),
  closeLearning: document.querySelector("#close-learning")
};

let clocks = loadClocks();
let activeClockId = null;
let themePreference = localStorage.getItem(THEME_KEY) || "system";
let appSettings = loadJson(APP_SETTINGS_KEY, appDefaults);
let customEquations = loadJson(CUSTOM_EQUATIONS_KEY, {});
let alarms = loadJson(ALARMS_KEY, []);
let deferredInstallPrompt = null;
let waitingServiceWorker = null;
let serviceWorkerRegistration = null;
let reloadingForUpdate = false;
let installPreviousFocus = null;
let toolsPreviousFocus = null;
let wakeLockSentinel = null;
let wakeLockRequest = null;
let audioContext = null;
let activeAlarm = null;
let snoozedAlarm = null;
let alarmPreviousFocus = null;
let lastScheduleCheckAt = Date.now();
const lastChimeKeys = new Map();
const clockViews = new Map();

function loadJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
    return value && typeof value === "object" ? { ...fallback, ...value } : fallback;
  } catch {
    return fallback;
  }
}

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

function clearClockPhotos() {
  return usePhotoStore("readwrite", (store) => store.clear());
}

async function replaceClockPhotos(entries) {
  const database = await openPhotoDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(PHOTO_STORE_NAME, "readwrite");
    const store = transaction.objectStore(PHOTO_STORE_NAME);
    store.clear();
    entries.forEach(({ clockId, blob }) => store.put(blob, clockId));
    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => {
      database.close();
      reject(transaction.error);
    };
    transaction.onabort = () => {
      database.close();
      reject(transaction.error || new Error("Photo replacement was aborted"));
    };
  });
}

function readBlobAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
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
  if (!["equations", "binary", "maya"].includes(normalized.numeralStyle)) {
    normalized.numeralStyle = defaults.numeralStyle;
  }
  if (!equationPools[normalized.difficulty]) {
    normalized.difficulty = defaults.difficulty;
  }
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
  if (clock.settings.numeralStyle !== "equations") return;
  clock.equations = Array.from({ length: 12 }, (_, index) => {
    const hour = index + 1;
    const builtIn = equationPools[clock.settings.difficulty][hour];
    const custom = appSettings.includeCustomEquations
      ? (customEquations[hour] || []).map((item) => item.expression)
      : [];
    const pool = [...builtIn, ...custom];
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
  view.equations.setAttribute("aria-hidden", String(!appSettings.learningMode));
  const numeralStyle = clock.settings.numeralStyle;
  if (numeralStyle === "equations" && !clock.equations.length) randomizeEquations(clock);

  for (let index = 0; index < 12; index += 1) {
    const hour = index + 1;
    let radius = EQUATION_RADIUS;
    let point = pointOnClock(hour, radius);
    const label = createSvgElement("g", { class: "face-number-label" });
    let positionLabel;

    if (numeralStyle === "maya") {
      const numeral = createMayaNumeral(hour);
      const scale = clock.settings.equationSize / 30;
      positionLabel = (nextPoint) => {
        numeral.setAttribute(
          "transform",
          `translate(${nextPoint.x.toFixed(2)} ${nextPoint.y.toFixed(2)}) scale(${scale.toFixed(3)})`
        );
      };
      positionLabel(point);
      label.append(numeral);
      if (appSettings.learningMode) {
        enableLearningLabel(
          label,
          `Explain the Maya numeral for ${hour}`,
          () =>
            showNumeralExplanation(
              `Maya numeral = ${hour}`,
              `Each dot represents one and each horizontal bar represents five. Together, the symbols total ${hour}.`
            )
        );
      }
    } else {
      const equation = numeralStyle === "binary" ? hour.toString(2) : clock.equations[index];
      const text = createSvgElement("text", {
        class: numeralStyle === "binary" ? "equation binary-number" : "equation"
      });
      positionLabel = (nextPoint) => {
        text.setAttribute("x", nextPoint.x.toFixed(2));
        text.setAttribute("y", nextPoint.y.toFixed(2));
      };
      positionLabel(point);
      text.style.fontSize = `${
        numeralStyle === "binary" ? clock.settings.equationSize * 0.88 : clock.settings.equationSize
      }px`;
      text.textContent = equation;
      if (appSettings.learningMode) {
        const explain =
          numeralStyle === "binary"
            ? () =>
                showNumeralExplanation(
                  `${equation}₂ = ${hour}`,
                  `Read the binary digits as powers of two. This binary number equals ${hour} in decimal.`
                )
            : () => showEquationExplanation(equation, hour);
        enableLearningLabel(
          text,
          numeralStyle === "binary"
            ? `Explain binary ${equation}, which equals ${hour}`
            : `Explain ${equation}, which equals ${hour}`,
          explain
        );
      }
      label.append(text);
    }
    view.equations.append(label);

    const text = label.querySelector("text");
    if (text) {
      const maxWidth = 88;
      const measuredWidth = text.getComputedTextLength();
      if (measuredWidth > maxWidth) {
        const fittedSize = Math.max(
          17,
          Number.parseFloat(text.style.fontSize) * (maxWidth / measuredWidth)
        );
        text.style.fontSize = `${fittedSize}px`;
      }
      if (text.getComputedTextLength() > maxWidth) {
        text.setAttribute("textLength", maxWidth);
        text.setAttribute("lengthAdjust", "spacingAndGlyphs");
      }
    }

    let box = label.getBBox();
    const safeRadius = getEquationSafeRadius(clock.settings.faceShape);
    while (!boxFitsSafeCircle(box, safeRadius) && radius > 170) {
      radius -= 2;
      point = pointOnClock(hour, radius);
      positionLabel(point);
      box = label.getBBox();
    }
  }
}

function createMayaNumeral(value) {
  const numeral = createSvgElement("g", {
    class: "maya-numeral",
    "aria-hidden": "true"
  });
  const dots = value % 5;
  const bars = Math.floor(value / 5);
  const dotHeight = dots ? 7 : 0;
  const barHeight = bars ? bars * 6 + (bars - 1) * 4 : 0;
  const gap = dots && bars ? 5 : 0;
  const totalHeight = dotHeight + gap + barHeight;
  let y = -totalHeight / 2;

  if (dots) {
    const startX = -((dots - 1) * 10) / 2;
    for (let index = 0; index < dots; index += 1) {
      numeral.append(
        createSvgElement("circle", {
          class: "maya-dot",
          cx: startX + index * 10,
          cy: y + 3.5,
          r: 3.5
        })
      );
    }
    y += dotHeight + gap;
  }

  for (let index = 0; index < bars; index += 1) {
    numeral.append(
      createSvgElement("line", {
        class: "maya-bar",
        x1: -18,
        y1: y + 3,
        x2: 18,
        y2: y + 3
      })
    );
    y += 10;
  }
  return numeral;
}

function enableLearningLabel(element, ariaLabel, explain) {
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-label", ariaLabel);
  element.classList.add("learning-enabled");
  element.addEventListener("click", explain);
  element.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    explain();
  });
}

const superscriptValues = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9"
};

const logarithmBases = {
  "₂": 2,
  "₃": 3,
  "₅": 5
};

function parseSuperscript(value) {
  return Number([...value].map((digit) => superscriptValues[digit]).join(""));
}

function calculateOperation(left, operator, right) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  if (operator === "÷") return left / right;
  return Number.NaN;
}

function describeOperation(left, operator, right, value) {
  if (operator === "+") return `add ${left} and ${right}: ${left} + ${right} = ${value}.`;
  if (operator === "−") return `subtract ${right} from ${left}: ${left} − ${right} = ${value}.`;
  if (operator === "×") return `multiply ${left} by ${right}: ${left} × ${right} = ${value}.`;
  return `divide ${left} by ${right}: ${left} ÷ ${right} = ${value}.`;
}

function capitalizeSentence(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function describePower(base, exponent, value) {
  if (exponent === 0) {
    return `${base}⁰ = 1 because every nonzero number raised to the zero power equals 1.`;
  }
  if (exponent === 1) {
    return `${base}¹ = ${base} because raising a number to the first power leaves it unchanged.`;
  }
  const factors = Array.from({ length: exponent }, () => base).join(" × ");
  return `${base} raised to the ${exponent} power means ${factors}, which equals ${value}.`;
}

function evaluateLearningStep(expression) {
  if (/^\d+$/.test(expression)) {
    return { value: Number(expression), explanation: "" };
  }

  const powerMatch = expression.match(
    /^(\d+)([⁰¹²³⁴⁵⁶⁷⁸⁹]+)(?: ([+−×÷]) (\d+))?$/
  );
  if (powerMatch) {
    const base = Number(powerMatch[1]);
    const exponent = parseSuperscript(powerMatch[2]);
    const powerValue = base ** exponent;
    const powerExplanation = describePower(base, exponent, powerValue);
    if (!powerMatch[3]) {
      return { value: powerValue, explanation: powerExplanation };
    }
    const right = Number(powerMatch[4]);
    const value = calculateOperation(powerValue, powerMatch[3], right);
    return {
      value,
      explanation: `${powerExplanation}\nThen ${describeOperation(
        powerValue,
        powerMatch[3],
        right,
        value
      )}`
    };
  }

  const operationMatch = expression.match(/^(\d+) ([+−×÷]) (\d+)$/);
  if (operationMatch) {
    const left = Number(operationMatch[1]);
    const right = Number(operationMatch[3]);
    const value = calculateOperation(left, operationMatch[2], right);
    return {
      value,
      explanation: capitalizeSentence(describeOperation(left, operationMatch[2], right, value))
    };
  }

  return null;
}

function explainExpression(expression, result) {
  const custom = (customEquations[result] || []).find((item) => item.expression === expression);
  if (custom?.explanation) return custom.explanation;

  if (expression === "sin(π⁄2)") {
    return "sin means sine, a way to describe an angle using a right triangle or circle. π⁄2 radians is 90°, and the sine of 90° is 1.";
  }

  if (expression === "ln(e)") {
    return "ln means natural logarithm. It uses e—a special number approximately equal to 2.718—as its base and asks what power of e produces the number in parentheses. Since e¹ = e, ln(e) = 1.";
  }

  const logarithmMatch = expression.match(/^log([₂₃₅])(\d+)$/);
  if (logarithmMatch) {
    const base = logarithmBases[logarithmMatch[1]];
    const value = Number(logarithmMatch[2]);
    return `log means logarithm, and the small ${base} identifies its base. It asks what power of ${base} equals ${value}. Since ${base} raised to the ${result} power equals ${value}, the answer is ${result}.`;
  }

  const cubeRootMatch = expression.match(/^∛(\d+)$/);
  if (cubeRootMatch) {
    const value = Number(cubeRootMatch[1]);
    return `The ∛ symbol means cube root: the number that can be multiplied by itself three times to make ${value}. Since ${result} × ${result} × ${result} = ${value}, the answer is ${result}.`;
  }

  const squareRootMatch = expression.match(/^√(?:\((.+)\)|(\d+))$/);
  if (squareRootMatch) {
    const radicandExpression = squareRootMatch[1] || squareRootMatch[2];
    const radicand = evaluateLearningStep(radicandExpression);
    if (radicand) {
      const rootStep = `The √ symbol means square root: the positive number that multiplies by itself to make ${radicand.value}. Since ${result} × ${result} = ${radicand.value}, the answer is ${result}.`;
      return radicand.explanation
        ? `First evaluate what is under the √ symbol: ${radicand.explanation}\n${rootStep}`
        : rootStep;
    }
  }

  const factorialMatch = expression.match(/^(\d)!?(?: ([+−×÷]) (\d+))?$/);
  if (expression.includes("!") && factorialMatch) {
    const number = Number(factorialMatch[1]);
    const factors = Array.from({ length: number }, (_, index) => number - index);
    const factorialValue = factors.reduce((product, factor) => product * factor, 1);
    const factorialStep = `${number}! means ${factors.join(" × ")}, which equals ${factorialValue}.`;
    if (!factorialMatch[2]) return factorialStep;
    const right = Number(factorialMatch[3]);
    const value = calculateOperation(factorialValue, factorialMatch[2], right);
    return `${factorialStep}\nThen ${describeOperation(
      factorialValue,
      factorialMatch[2],
      right,
      value
    )}`;
  }

  const groupedMatch = expression.match(/^\((.+)\) ([+−×÷]) (\d+)$/);
  if (groupedMatch) {
    const inside = evaluateLearningStep(groupedMatch[1]);
    if (inside) {
      const right = Number(groupedMatch[3]);
      const value = calculateOperation(inside.value, groupedMatch[2], right);
      return `First evaluate inside the parentheses:\n${inside.explanation}\nThen ${describeOperation(
        inside.value,
        groupedMatch[2],
        right,
        value
      )}`;
    }
  }

  return (
    evaluateLearningStep(expression)?.explanation ||
    `Work through the operations in ${expression} using the usual order of operations. The result is ${result}.`
  );
}

function showEquationExplanation(expression, result) {
  elements.learningExpression.textContent = `${expression} = ${result}`;
  elements.learningExplanation.textContent = explainExpression(expression, result);
  elements.learningNotification.hidden = false;
  elements.closeLearning.focus();
}

function showNumeralExplanation(heading, explanation) {
  elements.learningExpression.textContent = heading;
  elements.learningExplanation.textContent = explanation;
  elements.learningNotification.hidden = false;
  elements.closeLearning.focus();
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
  const numeralBadge = {
    binary: "Binary",
    maya: "Maya"
  }[clock.settings.numeralStyle];
  view.numeralBadge.textContent = numeralBadge || "";
  view.numeralBadge.hidden = !numeralBadge;
  view.newEquations.hidden = clock.settings.numeralStyle !== "equations";
  view.mobileNewEquations.hidden = clock.settings.numeralStyle !== "equations";
  const faceDescription = {
    equations: "mathematical equation labels",
    binary: "binary number labels",
    maya: "Maya numeral labels"
  }[clock.settings.numeralStyle];
  view.svg.setAttribute("aria-label", `${clock.name} analog clock with ${faceDescription}`);
  applyPhotoSettings(view, clock);
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
  elements.themePreference.value = preference;
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
  heading.className = "clock-heading";
  const title = document.createElement("h2");
  title.className = "clock-name";
  const numeralBadge = document.createElement("span");
  numeralBadge.className = "numeral-style-badge";
  heading.append(title, numeralBadge);

  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";
  const randomizeClock = () => {
    randomizeEquations(clock);
    renderEquations(clockViews.get(clock.id), clock);
  };
  const newEquations = createActionButton("New equations", "small-button", randomizeClock);
  const exportPng = createActionButton("Export PNG", "small-button", () =>
    exportClock(clock, "png")
  );
  const exportSvg = createActionButton("Export SVG", "small-button", () =>
    exportClock(clock, "svg")
  );
  const customize = createActionButton("Customize", "small-button", () => openSettings(clock.id));
  const remove = createActionButton("Remove", "small-button danger-button", () =>
    removeClock(clock.id)
  );
  remove.hidden = clocks.length === 1;
  cardActions.append(newEquations, exportPng, exportSvg, customize, remove);

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
  const mobileExportPng = createActionButton("Export PNG", "mobile-action-button", () =>
    exportClock(clock, "png")
  );
  const mobileExportSvg = createActionButton("Export SVG", "mobile-action-button", () =>
    exportClock(clock, "svg")
  );
  mobileRemove.hidden = clocks.length === 1;
  mobileMenu.append(
    mobileNewEquations,
    mobileExportPng,
    mobileExportSvg,
    mobileCustomize,
    mobileRemove
  );

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
  const clockDetails = document.createElement("p");
  clockDetails.className = "clock-details";
  footer.append(digitalTime, clockDetails);

  card.append(header, wrap, footer);
  elements.grid.append(card);

  const view = {
    card,
    display,
    title,
    numeralBadge,
    newEquations,
    mobileNewEquations,
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
    clockDetails,
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

function openMobileActionSheet() {
  closeMobileMenus();
  elements.mobileActionSheet.hidden = false;
  elements.mobileSheetBackdrop.hidden = false;
  elements.mobileHeaderMenu.setAttribute("aria-expanded", "true");
  document.body.classList.add("mobile-sheet-open");
  elements.mobileToolsButton.focus();
}

function closeMobileActionSheet(restoreFocus = true) {
  if (elements.mobileActionSheet.hidden) return;
  elements.mobileActionSheet.hidden = true;
  elements.mobileSheetBackdrop.hidden = true;
  elements.mobileHeaderMenu.setAttribute("aria-expanded", "false");
  document.body.classList.remove("mobile-sheet-open");
  if (restoreFocus) elements.mobileHeaderMenu.focus();
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

function getUtcOffsetMinutes(date, timeZone) {
  if (timeZone === LOCAL_TIME_ZONE) return -date.getTimezoneOffset();
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset"
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;
  if (!name || name === "GMT") return 0;
  const match = name.match(/GMT([+-])(\d{2}):?(\d{2})?/);
  if (!match) return 0;
  const minutes = Number(match[2]) * 60 + Number(match[3] || 0);
  return match[1] === "-" ? -minutes : minutes;
}

function formatUtcOffset(minutes) {
  const sign = minutes >= 0 ? "+" : "−";
  const absolute = Math.abs(minutes);
  const hours = String(Math.floor(absolute / 60)).padStart(2, "0");
  const remainder = String(absolute % 60).padStart(2, "0");
  return `UTC${sign}${hours}:${remainder}`;
}

function getClockDetails(date, clock) {
  const details = [];
  const options = { weekday: "long", month: "short", day: "numeric" };
  if (clock.timeZone !== LOCAL_TIME_ZONE) options.timeZone = clock.timeZone;
  if (clock.settings.showDate) {
    details.push(new Intl.DateTimeFormat(undefined, options).format(date));
  }
  const currentOffset = getUtcOffsetMinutes(date, clock.timeZone);
  if (clock.settings.showUtcOffset) details.push(formatUtcOffset(currentOffset));
  if (clock.settings.showDst) {
    const zoneOptions = { timeZoneName: "long" };
    if (clock.timeZone !== LOCAL_TIME_ZONE) zoneOptions.timeZone = clock.timeZone;
    const zoneName = new Intl.DateTimeFormat(undefined, zoneOptions)
      .formatToParts(date)
      .find((part) => part.type === "timeZoneName")?.value;
    if (zoneName) details.push(zoneName);
  }
  return details.join(" · ");
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
      view.clockDetails.textContent = getClockDetails(now, clock);
      view.clockDetails.hidden = !view.clockDetails.textContent;
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
  elements.pendulumSettings.hidden = !["grandfather", "cuckoo"].includes(
    clock.settings.bodyStyle
  );
  Object.entries(clock.settings).forEach(([name, value]) => {
    const field = elements.settingsForm.elements.namedItem(name);
    if (!field) return;
    if (field.type === "checkbox") field.checked = value;
    else field.value = value;
  });
  updateNumeralControls(clock.settings.numeralStyle);
}

function updateNumeralControls(numeralStyle) {
  const equationsOnly = numeralStyle !== "equations";
  elements.equationDifficulty.disabled = equationsOnly;
  elements.equationDifficultySettings.classList.toggle("disabled-setting", equationsOnly);
  elements.equationDifficultyNote.hidden = !equationsOnly;
}

function readForm() {
  const formData = new FormData(elements.settingsForm);
  return {
    name: String(formData.get("name")).trim() || "Clock",
    timeZone: formData.get("timeZone"),
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
      numeralStyle: formData.get("numeralStyle"),
      difficulty: elements.equationDifficulty.value,
      photoPositionX: Number(formData.get("photoPositionX")),
      photoPositionY: Number(formData.get("photoPositionY")),
      photoZoom: Number(formData.get("photoZoom")),
      photoOpacity: Number(formData.get("photoOpacity")),
      photoOverlay: Number(formData.get("photoOverlay")),
      showDate: elements.settingsForm.elements.showDate.checked,
      showUtcOffset: elements.settingsForm.elements.showUtcOffset.checked,
      showDst: elements.settingsForm.elements.showDst.checked,
      soundEnabled: elements.settingsForm.elements.soundEnabled.checked,
      hourlyChime: elements.settingsForm.elements.hourlyChime.checked,
      chimeSound: formData.get("chimeSound")
    }
  };
}

function previewForm() {
  const clock = clocks.find((item) => item.id === activeClockId);
  if (!clock) return;
  const next = readForm();
  const difficultyChanged = next.settings.difficulty !== clock.settings.difficulty;
  const numeralStyleChanged = next.settings.numeralStyle !== clock.settings.numeralStyle;
  const faceShapeChanged = next.settings.faceShape !== clock.settings.faceShape;
  clock.name = next.name;
  clock.timeZone = next.timeZone;
  clock.settings = next.settings;
  elements.pendulumSettings.hidden = !["grandfather", "cuckoo"].includes(
    clock.settings.bodyStyle
  );
  updateNumeralControls(clock.settings.numeralStyle);
  if (faceShapeChanged) {
    renderAllClocks();
    return;
  }
  const view = clockViews.get(clock.id);
  applyClockSettings(view, clock);
  renderTicks(view, clock);
  if (
    clock.settings.numeralStyle === "equations" &&
    (difficultyChanged || numeralStyleChanged)
  ) {
    randomizeEquations(clock);
  }
  renderEquations(view, clock);
}

function openSettings(clockId) {
  const clock = clocks.find((item) => item.id === clockId);
  if (!clock) return;
  activeClockId = clockId;
  populateForm(clock);
  renderAlarmList();
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
  alarms = alarms.filter((alarm) => alarm.clockId !== clockId);
  saveClocks();
  saveFeatureData();
  renderAllClocks();
}

function safeFileName(value) {
  return value.trim().replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "math-clock";
}

function downloadFile(file) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function shareOrDownloadFile(file) {
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: file.name });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }
  downloadFile(file);
}

async function exportBackup() {
  elements.backupStatus.textContent = "Preparing backup…";
  try {
    const photos = {};
    for (const clock of clocks) {
      const photo = await getClockPhoto(clock.id);
      if (photo) photos[clock.id] = await readBlobAsDataUrl(photo);
    }
    const backup = {
      format: "math-clock-backup",
      schemaVersion: 1,
      createdAt: new Date().toISOString(),
      themePreference,
      appSettings,
      clocks: clocks.map(({ equations, ...clock }) => clock),
      customEquations,
      alarms,
      photos
    };
    const file = new File(
      [JSON.stringify(backup)],
      `math-clock-backup-${new Date().toISOString().slice(0, 10)}.mathclock`,
      { type: "application/json" }
    );
    await shareOrDownloadFile(file);
    elements.backupStatus.textContent = `Backup created with ${clocks.length} clock${
      clocks.length === 1 ? "" : "s"
    }.`;
  } catch (error) {
    console.error("Backup failed:", error);
    elements.backupStatus.textContent = "The backup could not be created.";
  }
}

function uniqueClockName(name, existingNames) {
  if (!existingNames.has(name)) return name;
  let number = 2;
  while (existingNames.has(`${name} (${number})`)) number += 1;
  return `${name} (${number})`;
}

async function restoreBackup() {
  const file = elements.restoreFile.files?.[0];
  if (!file) {
    elements.backupStatus.textContent = "Choose a .mathclock backup file first.";
    return;
  }
  elements.backupStatus.textContent = "Reading backup…";
  try {
    const backup = JSON.parse(await file.text());
    if (
      backup?.format !== "math-clock-backup" ||
      backup.schemaVersion !== 1 ||
      !Array.isArray(backup.clocks) ||
      backup.clocks.length === 0
    ) {
      throw new Error("Unsupported backup format");
    }

    const replace = elements.restoreMode.value === "replace";
    const existingNames = new Set(replace ? [] : clocks.map((clock) => clock.name));
    const idMap = new Map();
    const restoredClocks = [];
    const photoEntries = [];
    for (const savedClock of backup.clocks) {
      const id = createId();
      idMap.set(savedClock.id, id);
      const name = uniqueClockName(savedClock.name || "Clock", existingNames);
      existingNames.add(name);
      restoredClocks.push({
        id,
        name,
        timeZone: savedClock.timeZone || LOCAL_TIME_ZONE,
        settings: normalizeSettings(savedClock.settings),
        equations: []
      });
      const dataUrl = backup.photos?.[savedClock.id];
      if (typeof dataUrl === "string" && dataUrl.startsWith("data:image/")) {
        photoEntries.push({ clockId: id, blob: await (await fetch(dataUrl)).blob() });
      }
    }

    const restoredCustomEquations = replace ? {} : { ...customEquations };
    if (backup.customEquations && typeof backup.customEquations === "object") {
      for (const [hour, items] of Object.entries(backup.customEquations)) {
        if (!Array.isArray(items)) continue;
        restoredCustomEquations[hour] = [
          ...(restoredCustomEquations[hour] || []),
          ...items
        ].slice(0, 100);
      }
    }
    const restoredAlarms = Array.isArray(backup.alarms)
      ? backup.alarms
          .filter((alarm) => idMap.has(alarm.clockId))
          .map((alarm) => ({ ...alarm, id: createId(), clockId: idMap.get(alarm.clockId) }))
      : [];

    if (replace) {
      await replaceClockPhotos(photoEntries);
      clocks = restoredClocks;
      alarms = restoredAlarms;
    } else {
      for (const entry of photoEntries) await saveClockPhoto(entry.clockId, entry.blob);
      clocks.push(...restoredClocks);
      alarms.push(...restoredAlarms);
    }
    customEquations = restoredCustomEquations;
    if (backup.appSettings && typeof backup.appSettings === "object") {
      appSettings = { ...appDefaults, ...appSettings, ...backup.appSettings };
    }
    if (["system", "light", "dark"].includes(backup.themePreference)) {
      applyThemePreference(backup.themePreference, true);
    }
    saveClocks();
    saveFeatureData();
    applyAppSettings();
    renderAllClocks();
    renderToolLists();
    elements.restoreFile.value = "";
    elements.backupStatus.textContent = `${backup.clocks.length} clock${
      backup.clocks.length === 1 ? "" : "s"
    } restored using ${replace ? "replace" : "merge"} mode.`;
  } catch (error) {
    console.error("Restore failed:", error);
    elements.backupStatus.textContent = "This backup is invalid or could not be restored.";
  }
}

function applySelectedPreset() {
  const clock = clocks.find((item) => item.id === activeClockId);
  const preset = presets[elements.settingsForm.elements.clockPreset.value];
  if (!clock || !preset) return;
  clock.settings = normalizeSettings({ ...clock.settings, ...preset });
  populateForm(clock);
  renderAllClocks();
}

function renderCustomEquationList() {
  const items = Object.entries(customEquations)
    .flatMap(([hour, equations]) => equations.map((item, index) => ({ ...item, hour, index })))
    .sort((a, b) => Number(a.hour) - Number(b.hour));
  elements.customEquationList.replaceChildren(
    ...items.map((item) => {
      const row = document.createElement("div");
      row.className = "compact-list-row";
      const text = document.createElement("span");
      text.textContent = `${item.hour}: ${item.expression}`;
      const remove = createActionButton("Remove", "text-button", () => {
        customEquations[item.hour].splice(item.index, 1);
        if (!customEquations[item.hour].length) delete customEquations[item.hour];
        saveFeatureData();
        renderCustomEquationList();
      });
      row.append(text, remove);
      return row;
    })
  );
  if (!items.length) elements.customEquationList.textContent = "No custom equations yet.";
}

async function createExportSvg(clock, view) {
  const clone = view.svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", "1024");
  clone.setAttribute("height", "1024");
  const style = createSvgElement("style");
  style.textContent = `
    .hand { transform-origin: 320px 320px; transform-box: view-box; }
    .equation { text-anchor: middle; dominant-baseline: middle; }
  `;
  clone.prepend(style);
  clone.querySelectorAll(".clock-rim").forEach((element) => {
    element.setAttribute("fill", clock.settings.rimColor);
    element.setAttribute("stroke", clock.settings.equationColor);
    element.setAttribute("stroke-width", "2");
  });
  clone.querySelectorAll(".clock-face").forEach((element) => {
    element.setAttribute("fill", clock.settings.faceColor);
  });
  clone.querySelectorAll(".tick").forEach((element) => {
    element.setAttribute("stroke", clock.settings.equationColor);
    element.setAttribute("stroke-width", element.classList.contains("major") ? "4" : "2");
    element.setAttribute("opacity", element.classList.contains("major") ? "0.65" : "0.42");
  });
  if (!clock.settings.showTicks) clone.querySelector(".tick-marks")?.remove();
  clone.querySelectorAll(".equation").forEach((element) => {
    element.setAttribute("fill", clock.settings.equationColor);
    element.setAttribute("font-family", "Georgia, Times New Roman, serif");
    element.setAttribute("font-weight", "700");
    element.setAttribute("text-anchor", "middle");
    element.setAttribute("dominant-baseline", "middle");
  });
  clone.querySelectorAll(".binary-number").forEach((element) => {
    element.setAttribute("font-family", "Consolas, Courier New, Courier, monospace");
    element.setAttribute("letter-spacing", "0.08em");
  });
  clone.querySelectorAll(".maya-dot").forEach((element) => {
    element.setAttribute("fill", clock.settings.equationColor);
  });
  clone.querySelectorAll(".maya-bar").forEach((element) => {
    element.setAttribute("stroke", clock.settings.equationColor);
    element.setAttribute("stroke-width", "6");
    element.setAttribute("stroke-linecap", "round");
  });
  const hourHand = clone.querySelector(".hour-hand");
  hourHand.setAttribute("stroke", clock.settings.hourColor);
  hourHand.setAttribute(
    "stroke-width",
    String(clock.settings.handStyle === "tapered" ? clock.settings.handWidth * 0.72 : clock.settings.handWidth)
  );
  const minuteHand = clone.querySelector(".minute-hand");
  minuteHand.setAttribute("stroke", clock.settings.minuteColor);
  const minuteWidth = Math.max(5, clock.settings.handWidth - 4);
  minuteHand.setAttribute(
    "stroke-width",
    String(clock.settings.handStyle === "tapered" ? minuteWidth * 0.72 : minuteWidth)
  );
  const secondHand = clone.querySelector(".second-hand");
  secondHand.setAttribute("stroke", clock.settings.secondColor);
  secondHand.setAttribute("stroke-width", "3");
  if (clock.settings.handStyle !== "square") {
    [hourHand, minuteHand, secondHand].forEach((hand) =>
      hand.setAttribute("stroke-linecap", "round")
    );
  }
  clone.querySelector(".center-pin-outer").setAttribute("fill", clock.settings.secondColor);
  clone.querySelector(".center-pin").setAttribute("fill", clock.settings.faceColor);
  const photo = await getClockPhoto(clock.id);
  const photoElement = clone.querySelector(".face-photo");
  if (photo) {
    photoElement.removeAttribute("hidden");
    photoElement.setAttribute("href", await readBlobAsDataUrl(photo));
  } else {
    photoElement.remove();
  }
  const overlay = clone.querySelector(".photo-overlay");
  if (overlay) overlay.setAttribute("fill", getComputedStyle(view.photoOverlay).fill);
  return new XMLSerializer().serializeToString(clone);
}

async function exportClock(clock, format) {
  try {
    const view = clockViews.get(clock.id);
    const source = await createExportSvg(clock, view);
    if (format === "svg") {
      await shareOrDownloadFile(
        new File([source], `${safeFileName(clock.name)}.svg`, { type: "image/svg+xml" })
      );
      return;
    }
    const svgBlob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    canvas.getContext("2d").drawImage(image, 0, 0, 1024, 1024);
    URL.revokeObjectURL(url);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    await shareOrDownloadFile(
      new File([blob], `${safeFileName(clock.name)}.png`, { type: "image/png" })
    );
  } catch (error) {
    console.error("Clock export failed:", error);
    window.alert("The clock image could not be exported.");
  }
}

function saveFeatureData() {
  localStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(appSettings));
  localStorage.setItem(CUSTOM_EQUATIONS_KEY, JSON.stringify(customEquations));
  localStorage.setItem(ALARMS_KEY, JSON.stringify(alarms));
}

function applyAppSettings() {
  document.documentElement.toggleAttribute("data-high-contrast", appSettings.highContrast);
  document.documentElement.toggleAttribute("data-reduce-motion", appSettings.reduceMotion);
  document.documentElement.toggleAttribute("data-large-controls", appSettings.largeControls);
  elements.learningMode.checked = appSettings.learningMode;
  elements.keepAwake.checked = appSettings.keepAwake;
  elements.highContrast.checked = appSettings.highContrast;
  elements.reduceMotion.checked = appSettings.reduceMotion;
  elements.largeControls.checked = appSettings.largeControls;
  elements.includeCustomEquations.checked = appSettings.includeCustomEquations;
  if (!("wakeLock" in navigator)) {
    elements.keepAwake.disabled = true;
    elements.keepAwake.parentElement.title = "Screen wake lock is not supported by this browser.";
  }
}

async function requestWakeLock() {
  if (
    !appSettings.keepAwake ||
    !("wakeLock" in navigator) ||
    document.hidden ||
    wakeLockSentinel ||
    wakeLockRequest
  ) {
    return;
  }
  try {
    wakeLockRequest = navigator.wakeLock.request("screen");
    const sentinel = await wakeLockRequest;
    wakeLockRequest = null;
    if (!appSettings.keepAwake || document.hidden) {
      await sentinel.release();
      return;
    }
    wakeLockSentinel = sentinel;
    wakeLockSentinel.addEventListener("release", () => {
      wakeLockSentinel = null;
    });
  } catch (error) {
    wakeLockRequest = null;
    console.error("Wake lock request failed:", error);
    elements.keepAwake.checked = false;
    appSettings.keepAwake = false;
    saveFeatureData();
  }
}

async function releaseWakeLock() {
  if (!wakeLockSentinel) return;
  await wakeLockSentinel.release();
  wakeLockSentinel = null;
}

function openTools(invoker = elements.toolsButton) {
  toolsPreviousFocus = invoker;
  renderToolLists();
  elements.toolsPanel.hidden = false;
  elements.closeTools.focus();
}

function closeTools() {
  elements.toolsPanel.hidden = true;
  toolsPreviousFocus?.focus?.();
  toolsPreviousFocus = null;
}

function enterPresentationMode() {
  document.body.classList.add("presentation-mode");
  elements.presentationExit.hidden = false;
  if ("requestFullscreen" in document.documentElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitPresentationMode() {
  document.body.classList.remove("presentation-mode");
  elements.presentationExit.hidden = true;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

function initializeAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioContext = new AudioContextClass();
  }
  if (audioContext?.state === "suspended") audioContext.resume();
}

function playTone(frequency, start, duration, type = "sine", volume = 0.12) {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playSound(sound) {
  initializeAudio();
  if (!audioContext) return;
  const now = audioContext.currentTime;
  const patterns = {
    chime: [[523, 0, 0.45], [659, 0.25, 0.5], [784, 0.5, 0.65]],
    bell: [[880, 0, 0.8], [660, 0.12, 0.9]],
    cuckoo: [[523, 0, 0.25], [392, 0.3, 0.35], [523, 0.75, 0.25], [392, 1.05, 0.35]],
    digital: [[880, 0, 0.18], [880, 0.28, 0.18], [880, 0.56, 0.18]]
  };
  (patterns[sound] || patterns.chime).forEach(([frequency, delay, duration]) =>
    playTone(frequency, now + delay, duration, sound === "digital" ? "square" : "sine")
  );
}

function getClockDateKey(date, clock) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };
  if (clock.timeZone !== LOCAL_TIME_ZONE) options.timeZone = clock.timeZone;
  return new Intl.DateTimeFormat("en-CA", options).format(date);
}

function triggerAlarm(alarm, clock, date) {
  activeAlarm = alarm;
  if (clock.settings.soundEnabled) playSound(alarm.sound);
  elements.activeAlarmLabel.textContent = alarm.label || "Alarm";
  elements.activeAlarmTime.textContent = `${alarm.time} · ${clock.name}`;
  elements.alarmNotification.hidden = false;
  alarmPreviousFocus = document.activeElement;
  elements.snoozeAlarm.focus();
  if (
    document.hidden &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    try {
      new Notification(alarm.label || "Analog Math Clock alarm", {
        body: `${alarm.time} · ${clock.name}`,
        icon: "./icons/icon-192.png"
      });
    } catch (error) {
      console.error("Unable to show the alarm notification:", error);
    }
  }
}

function checkChimesAndAlarms(now) {
  if (snoozedAlarm && now.getTime() >= snoozedAlarm.until) {
    const alarm = alarms.find((item) => item.id === snoozedAlarm.alarmId);
    const clock = clocks.find((item) => item.id === snoozedAlarm.clockId);
    snoozedAlarm = null;
    if (alarm?.enabled && clock) triggerAlarm(alarm, clock, now);
  }

  const previousCheck = new Date(lastScheduleCheckAt);
  const catchUpEnabled = now.getTime() - lastScheduleCheckAt <= 10 * 60 * 1000;
  clocks.forEach((clock) => {
    const parts = getClockTimeParts(now, clock.timeZone);
    const previousParts = getClockTimeParts(previousCheck, clock.timeZone);
    const dateKey = getClockDateKey(now, clock);
    if (
      clock.settings.soundEnabled &&
      clock.settings.hourlyChime &&
      parts.minute === 0
    ) {
      const key = `${dateKey}-${parts.hour}`;
      if (lastChimeKeys.get(clock.id) !== key) {
        lastChimeKeys.set(clock.id, key);
        playSound(clock.settings.chimeSound);
      }
    }

    alarms
      .filter((alarm) => alarm.enabled && alarm.clockId === clock.id)
      .forEach((alarm) => {
        const time = `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(
          2,
          "0"
        )}`;
        const currentMinutes = parts.hour * 60 + parts.minute;
        const previousMinutes = previousParts.hour * 60 + previousParts.minute;
        const alarmMinutes =
          Number(alarm.time.slice(0, 2)) * 60 + Number(alarm.time.slice(3, 5));
        const dayChanged = getClockDateKey(previousCheck, clock) !== dateKey;
        const crossed =
          catchUpEnabled &&
          (dayChanged
            ? alarmMinutes > previousMinutes || alarmMinutes <= currentMinutes
            : alarmMinutes > previousMinutes && alarmMinutes <= currentMinutes);
        const triggerKey = `${dateKey}-${alarm.time}`;
        if ((alarm.time === time || crossed) && alarm.lastTriggered !== triggerKey) {
          alarm.lastTriggered = triggerKey;
          saveFeatureData();
          triggerAlarm(alarm, clock, now);
        }
      });
  });
  lastScheduleCheckAt = now.getTime();
}

function renderAlarmList() {
  const clockAlarms = alarms.filter((alarm) => alarm.clockId === activeClockId);
  elements.alarmList.replaceChildren(
    ...clockAlarms.map((alarm) => {
      const row = document.createElement("div");
      row.className = "compact-list-row";
      const text = document.createElement("span");
      text.textContent = `${alarm.time} · ${alarm.label || "Alarm"}`;
      const toggle = document.createElement("input");
      toggle.type = "checkbox";
      toggle.checked = alarm.enabled;
      toggle.setAttribute("aria-label", `Enable ${alarm.label || "alarm"}`);
      toggle.addEventListener("change", () => {
        alarm.enabled = toggle.checked;
        if (!alarm.enabled && snoozedAlarm?.alarmId === alarm.id) snoozedAlarm = null;
        saveFeatureData();
      });
      const remove = createActionButton("Remove", "text-button", () => {
        alarms = alarms.filter((item) => item.id !== alarm.id);
        saveFeatureData();
        renderAlarmList();
      });
      row.append(toggle, text, remove);
      return row;
    })
  );
  if (!clockAlarms.length) elements.alarmList.textContent = "No alarms for this clock.";
}

function renderToolLists() {
  renderCustomEquationList();
  elements.restoreMode.value = "merge";
}

function dismissActiveAlarm() {
  activeAlarm = null;
  elements.alarmNotification.hidden = true;
  alarmPreviousFocus?.focus?.();
  alarmPreviousFocus = null;
}

elements.addClockButton.addEventListener("click", addClock);
elements.toolsButton.addEventListener("click", () => openTools(elements.toolsButton));
elements.mobileHeaderMenu.addEventListener("click", openMobileActionSheet);
elements.closeMobileActionSheet.addEventListener("click", () => closeMobileActionSheet());
elements.mobileSheetBackdrop.addEventListener("click", () => closeMobileActionSheet());
elements.mobileToolsButton.addEventListener("click", () => {
  closeMobileActionSheet(false);
  openTools(elements.mobileHeaderMenu);
});
elements.mobilePresentationButton.addEventListener("click", () => {
  closeMobileActionSheet(false);
  enterPresentationMode();
});
elements.mobileAddClockButton.addEventListener("click", () => {
  closeMobileActionSheet(false);
  addClock();
});
elements.closeTools.addEventListener("click", closeTools);
elements.presentationButton.addEventListener("click", enterPresentationMode);
elements.presentationExit.addEventListener("click", exitPresentationMode);
elements.applyPresetButton.addEventListener("click", applySelectedPreset);
elements.exportBackupButton.addEventListener("click", exportBackup);
elements.restoreBackupButton.addEventListener("click", restoreBackup);
elements.closeLearning.addEventListener("click", () => {
  elements.learningNotification.hidden = true;
});

elements.learningMode.addEventListener("change", () => {
  appSettings.learningMode = elements.learningMode.checked;
  saveFeatureData();
  clockViews.forEach((view, clockId) => {
    const clock = clocks.find((item) => item.id === clockId);
    if (clock) renderEquations(view, clock);
  });
});
elements.themePreference.addEventListener("change", () => {
  applyThemePreference(elements.themePreference.value, true);
});
elements.includeCustomEquations.addEventListener("change", () => {
  appSettings.includeCustomEquations = elements.includeCustomEquations.checked;
  saveFeatureData();
});
elements.highContrast.addEventListener("change", () => {
  appSettings.highContrast = elements.highContrast.checked;
  saveFeatureData();
  applyAppSettings();
});
elements.reduceMotion.addEventListener("change", () => {
  appSettings.reduceMotion = elements.reduceMotion.checked;
  saveFeatureData();
  applyAppSettings();
});
elements.largeControls.addEventListener("change", () => {
  appSettings.largeControls = elements.largeControls.checked;
  saveFeatureData();
  applyAppSettings();
});
elements.keepAwake.addEventListener("change", async () => {
  appSettings.keepAwake = elements.keepAwake.checked;
  saveFeatureData();
  if (appSettings.keepAwake) await requestWakeLock();
  else await releaseWakeLock();
});

elements.addCustomEquation.addEventListener("click", () => {
  const hour = elements.customEquationHour.value;
  const expression = elements.customEquationText.value.trim();
  const explanation = elements.customEquationExplanation.value.trim();
  if (!expression) return;
  customEquations[hour] = customEquations[hour] || [];
  customEquations[hour].push({ expression, explanation });
  elements.customEquationText.value = "";
  elements.customEquationExplanation.value = "";
  saveFeatureData();
  renderCustomEquationList();
});

elements.notificationPermission.addEventListener("click", async () => {
  if (!("Notification" in window)) {
    elements.notificationPermission.textContent = "Notifications unavailable";
    elements.notificationPermission.disabled = true;
    return;
  }
  const permission = await Notification.requestPermission();
  elements.notificationPermission.textContent =
    permission === "granted" ? "Notifications enabled" : "Notifications not enabled";
});

elements.addAlarm.addEventListener("click", () => {
  if (!activeClockId || !elements.alarmTime.value) return;
  alarms.push({
    id: createId(),
    clockId: activeClockId,
    time: elements.alarmTime.value,
    label: elements.alarmLabel.value.trim() || "Alarm",
    sound: elements.alarmSound.value,
    enabled: true,
    lastTriggered: null
  });
  elements.alarmLabel.value = "";
  saveFeatureData();
  renderAlarmList();
});
elements.snoozeAlarm.addEventListener("click", () => {
  if (!activeAlarm) return;
  snoozedAlarm = {
    alarmId: activeAlarm.id,
    clockId: activeAlarm.clockId,
    until: Date.now() + 5 * 60 * 1000
  };
  elements.alarmNotification.hidden = true;
  alarmPreviousFocus?.focus?.();
  alarmPreviousFocus = null;
});
elements.dismissAlarm.addEventListener("click", () => {
  dismissActiveAlarm();
});
elements.previewChimeSound.addEventListener("click", () => {
  playSound(elements.settingsForm.elements.chimeSound.value);
});

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
  if (!elements.mobileActionSheet.hidden) {
    closeMobileActionSheet();
    return;
  }
  closeMobileMenus();
  if (!elements.settingsPanel.hidden) closeSettings();
  if (!elements.toolsPanel.hidden) closeTools();
  elements.learningNotification.hidden = true;
  if (!elements.alarmNotification.hidden) dismissActiveAlarm();
});
document.addEventListener("click", closeMobileMenus);
document.addEventListener("pointerdown", initializeAudio, { once: true });

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (themePreference === "system") applyThemePreference("system");
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (appSettings.keepAwake) requestWakeLock();
  checkChimesAndAlarms(new Date());
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  setInstallButtonsHidden(false);
});

function closeInstallInstructions() {
  elements.installNotification.hidden = true;
  installPreviousFocus?.focus?.();
  installPreviousFocus = null;
}

function showInstallInstructions() {
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isAndroid = /android/i.test(navigator.userAgent);
  const isSafari = /safari/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(
    navigator.userAgent
  );
  let introduction;
  let steps;

  if (isIos && isSafari) {
    introduction = "Safari installs this web app through the Share menu.";
    steps = [
      "Tap the Share button in Safari.",
      "Scroll down and tap Add to Home Screen.",
      "Turn on Open as Web App if it is shown, then tap Add."
    ];
  } else if (isIos) {
    introduction = "iPhone and iPad installation must be completed from Safari.";
    steps = [
      "Copy or share this page address and open it in Safari.",
      "Tap Safari’s Share button.",
      "Choose Add to Home Screen, then tap Add."
    ];
  } else if (isAndroid) {
    introduction = "Your browser did not provide its automatic installation prompt.";
    steps = [
      "Open the browser’s three-dot menu.",
      "Choose Install app or Add to Home screen.",
      "Follow the confirmation shown by your device."
    ];
  } else {
    introduction = "Your browser did not provide its automatic installation prompt.";
    steps = [
      "Open the browser menu.",
      "Choose Install Analog Math Clock, Install app, or Add to Home screen.",
      "Follow the browser’s confirmation."
    ];
  }

  elements.installInstructions.textContent = introduction;
  elements.installSteps.replaceChildren(
    ...steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    })
  );
  elements.installNotification.hidden = false;
  elements.closeInstallNotification.focus();
}

async function requestInstall(invoker) {
  installPreviousFocus = invoker;
  if (!deferredInstallPrompt) {
    showInstallInstructions();
    return;
  }
  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  if (choice.outcome !== "accepted") setInstallButtonsHidden(false);
}

function setInstallButtonsHidden(hidden) {
  elements.installButton.hidden = hidden;
  elements.mobileInstallButton.hidden = hidden;
}

elements.installButton.addEventListener("click", () => requestInstall(elements.installButton));
elements.mobileInstallButton.addEventListener("click", () => {
  closeMobileActionSheet(false);
  requestInstall(elements.mobileHeaderMenu);
});
elements.closeInstallNotification.addEventListener("click", closeInstallInstructions);
elements.installInstructionsDone.addEventListener("click", closeInstallInstructions);
window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  setInstallButtonsHidden(true);
  elements.installNotification.hidden = true;
});

const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
setInstallButtonsHidden(isStandalone);

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
for (let hour = 1; hour <= 12; hour += 1) {
  elements.customEquationHour.add(new Option(String(hour), String(hour)));
}
applyThemePreference(themePreference);
saveClocks();
saveFeatureData();
applyAppSettings();
renderAllClocks();
renderToolLists();
if (appSettings.keepAwake) requestWakeLock();
requestAnimationFrame(updateClocks);
window.setInterval(() => checkChimesAndAlarms(new Date()), 1000);
