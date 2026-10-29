# Yavuz Saraç — portfolio universe

An existing React 19 / Vite / React Router portfolio, extended with a lightweight 2D pixel-art space map. No new runtime dependencies.

## Run locally

- `npm install` (only when dependencies are missing)
- `npm run dev`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run preview`

The project uses JavaScript and JSX; it has no TypeScript configuration or separate typecheck command. ESLint, Vite compilation, and the content regression tests are the configured checks.

## Routes

| URL | Content |
| --- | --- |
| `/` | Interactive space map, six destinations |
| `/about` | Existing biography and education chapters |
| `/projects` | All eight existing projects, AI/Web filters and original links |
| `/projects/:id` | Bilingual, shareable project details |
| `/experience` | Existing three-entry career timeline |
| `/skills` | Existing technology groups |
| `/contact` | Existing email, LinkedIn and GitHub channels |
| `/classic` | Preserved current portfolio, including its filters and detail dialog |
| `/demo` | Preserved alias for the current traditional portfolio |
| `/eski` | Preserved older portfolio |
| `/proje/:id` | Preserved older project detail pages and their original descriptions |
| Other paths | Localized missing-page view |

The existing `vercel.json` SPA rewrite supports direct URL refreshes. On another static host, configure the same fallback to `index.html`.

## Content and components

- `src/content/portfolio.js`: the existing complete TR/EN content and eight projects, extracted without rewriting the copy. Shared by Classic Site and the new pages.
- `src/content/planets.js`: six route, position, color and visual configurations derived from the five existing portfolio sections plus Classic Site.
- `src/content/translations.js`: space interface copy in Turkish and English.
- `src/content/LanguageProvider.jsx`: shared persistent language preference. Storage failures fall back to in-memory navigation.
- `src/components/space/`: memoized pixel planet artwork, starfield, ship, navigation header and planet links.
- `src/pages/SpaceMap.jsx`: map composition, onboarding and proximity state.
- `src/pages/PlanetPage.jsx`: conventional scrollable portfolio destinations.
- `src/pages/Portfolio.jsx` and its existing stylesheet retain the traditional layout.
- `src/space.css`: scoped space visual system, responsive map and reduced-motion styles.

Each destination is a normal accessible link. The planet index provides an alternate route to every destination. Desktop ship position updates directly from pointer coordinates using translate3d, with movement-vector rotation and shortest-angle smoothing. The cursor is hidden only in the interactive map flight area. Proximity uses measured planet centers, hysteresis and a capped 1.5 px magnetic offset. A 64-slot canvas particle pool runs through requestAnimationFrame; it pauses on mobile/coarse pointers and in hidden tabs. Ship position survives return navigation through session storage. E enters a highlighted planet; Escape returns from the new destination pages. Classic project dialogs retain Escape-to-close with focus trapping and restoration.

Language is saved as `portfolio-language`, first-visit instructions as `tutorialSeen`, and the short boot state and ship position in session storage. A shared Web Audio engine survives route changes. The existing `public/audio/space-theme.mp3` is loaded unchanged; music is level-normalized in playback and ducked for proximity/UI/warp cues. The slider controls music independently from effects, while mute silences all channels. Sound defaults on with music at 24%, respects saved mute/volume settings, and starts when autoplay policy or the first user gesture permits it. Quiet local synth ambience remains an error fallback if a supplied track cannot be decoded. Short UI/proximity/warp effects use cooldowns and subtle ducking. The music control is available on destination pages and as an unobtrusive floating control on the traditional portfolio. Font files are self-hosted; their SIL Open Font License is in `public/fonts/`.

Original PNG images remain untouched. Smaller WebP copies are used for project cards in the shared content; projects are lazy-loaded and the old route assets remain available. No CV download existed in the inspected project, so none has been fabricated.

## Validation

Content regression tests verify all eight original project IDs, bilingual fields, image availability, HTTPS project links, matching translation structures, unique section destinations, existing experience entries and contact information.

Browser checks cover desktop map sizes 1920×1080, 1440×900, 1366×768 and 1024×768, the mobile map, project filters and detail navigation, both language directions with refresh persistence, Classic Site and its dialog focus, direct destination routes, original contact hrefs, and unknown-route handling. External destinations retain their existing URLs; their third-party availability is outside the local app's tests.

## Second-pass interaction polish

- `src/components/space/spacePhysics.js`: testable proximity hysteresis, precision-safe magnetism and normalized position decoding.
- `Spaceship.jsx`: immediate pointer-to-ship transforms, movement-vector sprite rotation, idle engine flicker and bounded canvas trail. Development-only DOM attributes expose pointer coordinates for browser precision checks; they do not render UI.
- `WarpProvider.jsx` and `src/content/useSpaceNavigation.js`: 480 ms in-site entry/return transitions. Navigation occurs at 280 ms. Direct URLs, same-page anchors, modified clicks, external links and downloads retain normal behavior. Keyboard E and Escape share this route mechanism.
- `SpaceAudioEngine.js`, `SpaceAudioProvider.jsx` and `MusicControl.jsx`: a persistent, gesture-safe audio engine with separate music volume and effect levels, global mute, per-effect cooldowns, crossfade-ready track selection and smooth music ducking. Preferences use `portfolioSoundEnabled` and `portfolioVolume`.
- `src/content/audioSettings.js`: soundtrack configuration. The supplied track is already present at `public/audio/space-theme.mp3` and is included in production builds. Vite checks file availability before including track URLs; absent placeholders are never fetched. No replacement track was downloaded. See `public/audio/README.md`.
- `PlanetSignal.jsx`: localized orbit signal and mouse/keyboard entry action. Keyboard focus can activate a destination independently of ship position.
- `PlanetLife.jsx`: purpose-specific observatory, terminal, city-window, crystal, radio and CRT animations.
- `AmbientEvents.jsx`: at most one decorative meteor, NPC ship or drifting asteroid, scheduled at random intervals. Events pause in hidden tabs and stop with reduced motion.
- `Starfield.jsx`: three lightweight parallax layers. Reduced-motion preferences disable parallax, trails, warp, drifting, pulsing and ambient events while preserving navigation.

Nine tests cover content preservation, translation keys, planet configuration, contact information, orbit-boundary stability, the 1.5 px gravity limit, corrupted session data, audio preference defaults and muted/cooldown sound behavior.

## Final release verification

The source spaceship points upward. Movement heading uses `atan2(dy, dx)` plus a 90° sprite offset, independent of pointer position. Rotation follows the shortest angle and ignores sub-pixel noise. Reduced motion updates direction directly and disables particles.

The missing-trail fault was a negative RAF delta on the first movement after idle. Timing now uses the same monotonic clock throughout, with positive deltas and regression coverage. Cyan/blue/white/purple particles spawn 22 px behind the currently rendered heading, stay in a bounded pool, fade within 360–640 ms and stop emitting when stationary.

Audio remains enabled by default and unlocks on the first gesture if the browser suspends the initial attempt. `portfolioVolume` now controls only music (24% for a new visitor); existing saved values are retained. `portfolioSoundEnabled` is the global mute. Playback measures the supplied recording to keep background RMS/peak headroom consistent. Effects use separate gains, and music ducks to 40–65% of its selected level before recovering over 350–750 ms. The track continues across routes without restarting.

Run `npm run lint`, `npm test`, and `npm run build` before release. `npm run preview` verifies the production build locally. The 18 regression tests cover all eight directions, shortest-angle boundaries, idle-frame trail emission, rotated exhaust origins, particle lifetime/pool bounds, soundtrack case/path availability, independent mixer channels and smooth overlapping duck envelopes, along with the existing content and routing configuration checks.

Only source, tests, docs and required public assets should be committed. `node_modules`, `dist`, environment files, editor caches and generated verification outputs are ignored. No push or deployment is performed by the local verification commands.
