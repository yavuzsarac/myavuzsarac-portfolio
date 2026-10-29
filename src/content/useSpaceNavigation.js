import { createContext, useContext } from 'react';
export const SpaceNavigationContext = createContext(null);
export function useSpaceNavigation() { return useContext(SpaceNavigationContext); }
