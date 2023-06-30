import { useEffect } from "react";

export function useInitEffect(effect: () => (() => void) | void): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useEffect(effect, []);
}
