# Portfolio soundtrack

The existing `space-theme.mp3` in this directory is the production background track. Its bytes are kept unchanged. It loads at `/audio/space-theme.mp3`; retain this exact spelling and case when deploying.

Music is enabled by default at 24% for new visitors and unlocks on the first gesture when required by the browser. The HUD slider controls music only; its mute toggle silences music and all effects. Preferences reuse `portfolioVolume` and `portfolioSoundEnabled`.

The player measures the recording's level and reserves headroom for interaction sounds without rewriting the audio file. Proximity, UI and warp effects briefly duck the music, then restore it smoothly. Music continues across SPA routes, including Classic Site.

Track configuration remains in `src/content/audioSettings.js`. Future track keys can use the existing crossfade engine. Missing or undecodable tracks retain the quiet synthesized fallback.
