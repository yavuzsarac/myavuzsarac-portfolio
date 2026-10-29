import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { musicTracks } from './src/content/audioSettings.js';

// Include only supplied tracks so the default placeholder never produces a 404 or decode error.
const availableTracks = Object.fromEntries(Object.entries(musicTracks).filter(([, src]) => existsSync(new URL(`./public${src}`, import.meta.url))));
export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.env.SPACE_MUSIC_TRACKS': JSON.stringify(availableTracks) },
});
