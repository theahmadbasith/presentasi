import { createContext, useContext } from "react";

/** True only in fullscreen present mode — live iframes stay off in deck review. */
export const PresentModeContext = createContext(false);

export function usePresentMode() {
  return useContext(PresentModeContext);
}
