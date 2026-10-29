import { createContext, useContext } from 'react';
export const SpaceAudioContext = createContext(null);
export function useSpaceAudio() { return useContext(SpaceAudioContext); }
