# PUMOPOKUS

A Pomodoro timer for students, built with Filipino students in mind. PUMOPOKUS keeps the
simple, colorful, mode-based feel of a classic Pomodoro app while adding a warm local identity,
bilingual UI, and a foundation for study rooms, notifications, and leaderboards.

Phases 1–6 are complete: core timer, tasks with subject tags, session logging, reward quotes,
settings, themes, i18n, local focus stats (daily streak, today’s minutes, and a 26-week heatmap),
a reports panel with a session history, weekly and per-subject charts, an exam countdown, a
study-sounds mixer with a light data mode, round-end notifications, and an installable PWA that
works offline after the first visit. The app works fully without an account; accounts arrive in
Phase 7.

## Stack

- React 19 + Vite 8 (JavaScript)
- Tailwind CSS 4 via `@tailwindcss/vite` (theme tokens live in `src/styles/index.css`)
- React Router, Zustand, i18next / react-i18next
- Vitest, ESLint (flat config), Prettier
- Deploy target: Vercel (`vercel.json` adds the SPA rewrite)

Supabase is not connected yet. `src/services/storage.js` is the only persistence layer, so a
Supabase-backed implementation can be added later without touching components.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (Vite defaults to http://localhost:5173).

Optional: copy `.env.example` to `.env` and fill in Supabase keys. They are unused until Phase 7.

### Scripts

| Script                 | Purpose                      |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start the Vite dev server    |
| `npm run build`        | Production build             |
| `npm run preview`      | Preview the production build |
| `npm test`             | Run unit tests once          |
| `npm run test:watch`   | Run unit tests in watch mode |
| `npm run lint`         | ESLint                       |
| `npm run format`       | Format with Prettier         |
| `npm run format:check` | Check formatting             |

## Phase 1 features

- Pomodoro 25 / Short break 5 / Long break 15, each with its own color identity
- Start, pause, resume, reset, skip, auto-switch, optional auto-start
- Automatic long break after a configurable number of focus rounds (1–12, default 4)
- Timestamp-based timer (`endAt`), so it stays accurate in background tabs
- Remaining time in the browser tab title and a soft synthesized chime at round end
- Custom durations (1–90 min), long-break interval, and auto-start toggles, persisted to localStorage
- Light / dark / system themes; English / Filipino UI with all strings in i18n
- Tomato (kamatis) identity with a calyx-topped timer card; compact first viewport that
  fits the header, tabs, timer, and controls without scrolling
- Below-the-fold study guide (about, technique, how it works, features, roadmap) and footer
- Keyboard: `Space` starts or pauses (ignored while typing or focused on a control)
- Mobile-first layout checked down to 320 px, reduced-motion support, visible focus states
- Scrollable floating Settings dialog with instant-save and restore defaults

No visible “Round 1 of 4” counter is shown, so a session never feels mandatory.

## Phase 2 features

- Task list: add, edit, delete, complete, and pick one active task to focus on
- Estimated vs. completed pomodoros per task, with a live task summary above the list
- Subject tag on every task: built-in Math, Science, English, and Filipino, plus custom subjects
  with a chosen color
- Each completed focus session is logged with its start/end timestamps, minutes, subject, and
  task; skipped or abandoned sessions are never logged
- The active task’s completed count increases only when a focus session finishes
- Reward modal after every focus session with a random bilingual quote (33 entries in
  `src/data/quotes.js`): Filipino proverbs and original lines, each with an English translation;
  no unverified attributions
- Tasks, subjects, active task, and sessions persist locally; invalid stored data is normalized

## Phase 3 features

- Streak badge above the timer: the current daily streak, or an invitation to start one
- “Your focus” panel with today’s minutes, current streak, and longest streak
- 26-week activity heatmap (Monday-to-Sunday columns, local calendar days) with month and
  weekday labels, an intensity legend, and per-day tooltips
- Totals and active-day counts for the visible range, plus a screen-reader text summary
- Streaks count consecutive local days; yesterday’s streak stays alive until today ends
- Stats derive entirely from stored sessions, so nothing extra is persisted

## Phase 4 features

- “Reports” panel below “Your focus”, built entirely from stored sessions
- Exam countdown: pick a date and see the days remaining (or “Exam day is today”); the date is
  saved separately under `pumopokus.exam` and can be cleared
- Last-7-days bar chart of focus minutes with weekday labels and a session/minute total
- 30-day subject breakdown with colored bars, ranked by minutes, including “No subject”
- Session history: the latest 20 focus sessions grouped by local day (Today / Yesterday / date),
  each with its time, task or subject, subject dot, and minutes
- Empty states for each report when there is no data yet; all copy is bilingual

## Phase 5 features

- “Study sounds” panel below Tasks with rain, ocean waves, and brown noise, each with its own
  volume slider and a shared play/pause control
- Sounds are synthesized in the browser with the Web Audio API, so no audio files are downloaded,
  no samples need licensing, and the feature works offline
- The mix (per-sound volumes) is saved locally; playback always starts paused, and the browser
  unlocks audio on the first press
- Light data mode in Settings turns study sounds off and reduces decorative motion to save data
  and battery on low-end devices
- All study-sounds and light-data copy is bilingual

## Phase 6 features

- Opt-in round-end notifications: enabling the toggle asks for permission (never on page load),
  and a localized system notification appears when a round ends while the tab is in the
  background
- Notifications prefer the service worker when available, with a page-level fallback; the
  permission and blocked states are explained in Settings
- Installable PWA with a web app manifest, generated 192/512 and maskable icons, standalone
  display, and an Apple touch icon
- The service worker caches the app shell and hashed assets on the first visit, so the timer,
  tasks, stats, reports, and synthesized study sounds work offline
- A new service-worker release takes control on the next load; bump `CACHE_NAME` in
  `public/sw.js` when shipping shell changes
- Notifications only fire while the app is open in a tab (the timer is client-side). iOS web
  notifications require an installed PWA on 16.4+, and closed-tab notifications would need a
  push server, which is out of scope

## Project structure

```
src/
  components/        AppShell, Header, Timer, ModeTabs, TimerControls, RewardModal,
                     AmbientMixer, StatsPanel, ReportsPanel, Heatmap, StreakBadge,
                     ThemeToggle, LanguageToggle, ui/, settings/ (floating dialog), icons/
  components/reports/ ExamCountdown, WeeklyChart, SubjectBreakdown, SessionHistory
  components/tasks/  TaskList, TaskForm, TaskItem, SubjectSelect
  components/landing/ StudyGuide and SiteFooter (below-the-fold content)
  pages/             Home
  store/             timerStore, taskStore, sessionStore, rewardStore, settingsStore,
                     examStore
  services/          storage (versioned localStorage), audioContext (shared WebAudio),
                     chime, ambience (synthesized study sounds), notifications
                     (permission + round-end system notifications)
  hooks/             useTimer, useTheme, useDocumentTitle, useLanguage, useSpacebar,
                     useFocusStats, useReports
  utils/             timer math, settings, task/session normalization, quotes, stats
                     (day keys, daily aggregates, streaks, heatmap), reports (weekly,
                     subject, exam, session history)
  data/              quotes.js (bilingual reward quotes)
  constants/         modes, subjects, ambience, app config
  i18n/              i18n setup, en.json, fil.json
  styles/            Tailwind entry + all theme tokens
  assets/fonts/      self-hosted Bricolage Grotesque (latin subset)
public/
  manifest.webmanifest  PWA metadata and icon entries
  sw.js                 offline app-shell cache + notification click handler
  pwa-*.png, maskable-icon-*.png, apple-touch-icon-*.png, favicon.ico
```

### Design tokens

All colors, fonts, radii, shadows, and easing live in `src/styles/index.css` under `@theme`.
Mode and theme values are exposed as CSS variables (`--page`, `--surface`, `--control`,
`--accent`-style roles) selected by `[data-mode]` and `[data-theme]` on `<html>`. Pro themes
can later override the same variables without touching components.

Typography uses a latin subset of Bricolage Grotesque, self-hosted in `src/assets/fonts` under
the SIL Open Font License (license text included there). System fonts are the fallback, so no
request to a font CDN is made.

## Manual test checklist (Phases 1–6)

1. Set the Pomodoro length to 1 minute, start it, and switch tabs for more than a minute. When
   you return, the timer must be at the correct time and the break must already be selected.
   Repeat with a 5-minute round in a hidden tab for the full acceptance check.
2. Enable both auto-start toggles: focus → short break → focus chains without pressing start.
3. Complete four focus rounds (use 1-minute durations) and confirm the fourth goes to a long
   break, then the cycle restarts. Change “Long break after” to 2 and confirm a long break
   arrives every second focus round.
4. Skip during focus: the next break appears but the completed-round count does not increase.
5. Check the tab title updates every second while running and pauses correctly.
6. A single soft chime plays when a round ends; volume 0 silences it.
7. Press `Space` on the home screen to toggle the timer. It must not fire while a setting input
   or a button is focused.
8. Change durations while idle (timer updates immediately) and while running (current round is
   unaffected, next round uses the new length).
9. Reload the page: theme, language, durations, long-break interval, auto-start, chime volume,
   tasks, active task, session history, and exam date persist. The timer itself resets.
10. Switch theme (light/dark/system) and language in both the header and the Settings dialog;
    layout at 320 px wide must not overflow. Enable reduced motion in the OS and confirm
    transitions stop.
11. Open Settings: the dialog floats centered, scrolls internally, locks page scroll, and closes
    with Escape, the X button, or a backdrop click.
12. Confirm the timer card, mode tabs, controls, and guide link fit in one viewport with no page
    scroll at 1366×768, 1280×720, 1024×768, 375×667, 375×812, and 320×568.
13. Corrupt or delete localStorage values and reload: the app falls back to defaults.
14. Add a task with a subject and estimate. It becomes the active task, shows “Focusing: …”, and
    survives a reload.
15. With an active task selected, complete a 1-minute focus session. The reward modal appears
    with a Filipino quote, its English translation, and the language label; the task’s
    completed count increases by one.
16. Inspect `pumopokus.sessions`: one session is stored with ISO start/end timestamps, the
    session minutes, subject id, task id, and mode `pomodoro`.
17. Skip a focus session: no session is logged, no reward modal appears, and the completed count
    does not change.
18. Add a custom subject with a chosen color, assign it to a task, and confirm its dot and name
    render after a reload.
19. Edit a task’s name, subject, and estimate; complete, un-complete, and delete tasks. Deleting
    the active task clears the active slot.
20. Switch to Filipino: the task panel and reward modal are translated; stored task/session data
    is unchanged.
21. Complete a focus session: the streak badge switches from “Start a streak today” to
    “1-day streak”, today’s minutes appear in “Your focus”, and the current day is shaded.
22. With sessions on consecutive days, the current streak counts them; a gap resets it, the
    longest streak keeps the best run, and yesterday’s streak stays alive until today ends.
23. Switch to Filipino: the streak badge, stats panel, heatmap legend, and date tooltips are
    translated; the heatmap still scrolls to the current week.
24. Set an exam date in Reports: the countdown shows the days remaining and survives a reload.
    Clearing the date returns the prompt.
25. Complete focus sessions: the last-7-days chart shows bars with minutes, the 30-day subject
    breakdown ranks subjects, and the latest sessions appear in Session history grouped by day.
26. Set an exam date in the past: the panel says the date has passed (no negative countdown).
27. Switch to Filipino: the report headings, weekday labels, dates, and countdown copy are
    translated.
28. Open the Study sounds panel and press Play: rain starts. Move the rain, ocean, and brown
    sliders and confirm the mix changes smoothly; pause stops the sound.
29. Set all three ambient sliders to 0: the Play button disables and any playing sound stops.
30. Reload after mixing: the slider levels persist, but playback starts paused.
31. Enable Light data mode in Settings: any playing sound stops, the Study sounds controls
    disable, and decorative transitions are reduced.
32. Switch to Filipino: the Study sounds panel and light data mode copy are translated.
33. Enable round-end notifications in Settings and allow the browser prompt. Start a 1-minute
    focus, switch tabs, and confirm a system notification appears when the round ends.
34. Keep the tab visible when a round ends: the chime and reward modal appear, and no system
    notification is shown.
35. Deny the permission request: the toggle stays off and Settings shows the blocked message; no
    notification appears.
36. Turn notifications off: no notification appears at round end.
37. Run `npm run build` and `npm run preview`, install the app, launch it standalone, then reload
    with the network offline. The app shell and all local features must load.
38. In DevTools → Application, confirm the manifest, the 192/512/maskable icons, and an active
    service worker; the theme color matches the page.
39. Switch to Filipino: the notifications settings copy and a round-end notification are
    translated.
40. Ship a changed shell, bump `CACHE_NAME`, reload twice, and confirm the new version takes
    control and old caches are removed.

## Fix after Phase 6

- Study-sound playback is covered only by the no-support fallback test. Verify it in a real
  browser with manual checklist items 28–32 and add mocked Web Audio tests for start/stop,
  volume changes, and the fade-out. This is a follow-up, not a Phase 6 blocker.

## Data and storage

Settings are stored under `pumopokus.settings` as:

```json
{
  "schemaVersion": 1,
  "data": {
    "durations": {},
    "longBreakInterval": 4,
    "autoStart": {},
    "language": "en",
    "theme": "system",
    "lightDataMode": false,
    "soundVolumes": { "chime": 0.6 },
    "ambientVolumes": { "rain": 0.5, "ocean": 0, "brown": 0 },
    "notificationsEnabled": false
  },
  "updatedAt": "ISO-8601"
}
```

Invalid or outdated data falls back to validated defaults via `normalizeSettings`. Migration
hooks can be added in `services/storage.js` when schema version 2 arrives. Ambient volumes are
clamped to 0–1; `lightDataMode` keeps study sounds off and reduces decorative motion.

Tasks and subjects are stored under `pumopokus.tasks`:

```json
{
  "schemaVersion": 1,
  "data": {
    "subjects": [
      { "id": "math", "nameKey": "subjects.math", "color": "#4f6df5" },
      { "id": "subj_…", "name": "Chemistry", "color": "#7a4fb3" }
    ],
    "tasks": [
      {
        "id": "task_…",
        "name": "Lab report",
        "subjectId": "science",
        "estimate": 3,
        "completedPomodoros": 1,
        "done": false,
        "createdAt": "ISO-8601"
      }
    ],
    "activeTaskId": "task_…"
  },
  "updatedAt": "ISO-8601"
}
```

Built-in subjects use an i18n `nameKey`; custom subjects use a literal `name` and a hex `color`.
`normalizeTaskState` drops invalid tasks, clamps estimates to 1–99, and clears an active task
that is done or missing.

Completed focus sessions are stored under `pumopokus.sessions`; skipped or abandoned sessions
are never written:

```json
{
  "schemaVersion": 1,
  "data": {
    "sessions": [
      {
        "id": "session_…",
        "startedAt": "ISO-8601",
        "endedAt": "ISO-8601",
        "minutes": 25,
        "subjectId": "math",
        "taskId": "task_…",
        "mode": "pomodoro"
      }
    ]
  },
  "updatedAt": "ISO-8601"
}
```

This is the session model later phases aggregate for reports, exams, and leaderboards. Phase 3
reads it for the streak badge and heatmap; Phase 4 adds the history list, weekly and subject
reports, and the exam countdown.

The exam date is stored under `pumopokus.exam` as a local calendar date (or `null`):

```json
{
  "schemaVersion": 1,
  "data": { "date": "2026-06-15" },
  "updatedAt": "ISO-8601"
}
```

Invalid dates are dropped by `normalizeExam`. The countdown compares UTC day numbers derived from
local calendar dates, so daylight-saving changes cannot shift the result.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Import the project in Vercel. Framework preset: Vite. Build command: `npm run build`. Output
   directory: `dist`.
3. HTTPS is required for notifications and the service worker; Vercel serves both. The headers in
   `vercel.json` keep `/sw.js` revalidating and set the manifest content type.
4. Add the Supabase environment variables in Phase 7.

## Stubbed or deferred

| Item                                  | Status                                                                                                                                  |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Supabase auth/data (Phase 7)          | Not connected; local storage only                                                                                                       |
| Payments (Phase 8)                    | Not started                                                                                                                             |
| Timer restore after reload            | Deferred; the running timer still resets on reload                                                                                      |
| Notifications while the app is closed | Out of scope; the timer is client-side and closed-tab notifications would need a push server                                            |
| Study-sound playback verification     | Follow-up after Phase 6; see “Fix after Phase 6”                                                                                        |
| Ambient audio samples                 | Not used. Study sounds are generated with the Web Audio API, so no audio files or licenses are needed and nothing is fetched at runtime |
