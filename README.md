# Analog Math Clock PWA

Analog Math Clock provides customizable analog clocks that use randomized mathematical equations instead of hour numbers.
Add multiple clocks, assign each one an IANA time zone, and give every clock its own appearance.

Customization includes:

- Standard wall, grandfather, cuckoo, and old-fashioned bell alarm clock bodies
- Round, rounded-square, octagonal, and arched frames
- A cuckoo bird plus configurable pendulum color, length, and bob shape
- Per-clock sound control for hourly chimes and alarms
- Device pictures stored locally as clock-face backgrounds
- Picture position, zoom, opacity, and readability-overlay controls
- Desktop hover actions and a touch-friendly three-dot menu for new equations, customization, and removal
- Compact mobile header with a bottom-sheet menu for app-wide actions
- App-wide Light, Dark, and System appearance modes in Tools
- Indigo interface accents and matching default second-hand and pendulum colors
- Native installation prompts where supported, with platform-specific manual instructions otherwise
- Versioned backup and merge/replace restore, including uploaded pictures
- Modern, classroom, antique, night, and playful presets with matching sound choices
- Swipeable one-clock mobile carousel and clock-only presentation mode
- Screen wake lock for always-on clock displays
- PNG and SVG clock-face export
- Custom equation editing and optional inclusion during randomization
- Tap-to-learn equation explanations
- Optional date, weekday, UTC offset, and daylight-saving details
- High contrast, reduced motion, and larger-control accessibility settings
- Per-clock named alarms with built-in sounds, visual alerts, notifications, and five-minute snooze
- Optional per-clock hourly chimes with a sound preview
- In-app Help Center, feedback reporting, and a privacy policy

## Run locally

The service worker and install behavior require the app to be served over HTTP rather than opened
directly as a file.

```powershell
cd C:\Users\jolurie\Desktop\Analog-math-clock
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Install

- On Chromium browsers, use the Install button when it appears.
- On iPhone or iPad, open the site in Safari, tap Share, and select **Add to Home Screen**.

The first clock uses the device's local system time. Additional clocks can use any time zone
offered by the browser. The app works offline after its first successful load and stores clocks
and appearance preferences locally on the device.

When an updated service worker is available, the running app displays **Update and Restart** and
**Later** choices. Updating activates the downloaded version and reloads the PWA. Update
installation bypasses HTTP caches, and normal online use refreshes cached resources while
retaining offline fallbacks.

## GitHub Pages

The repository can be published directly from the `main` branch and repository root. Its public
GitHub Pages address is:

`https://luriejoe.github.io/analog-math-clock/`

Help and policy pages:

- `https://luriejoe.github.io/analog-math-clock/faq/`
- `https://luriejoe.github.io/analog-math-clock/privacy/`
