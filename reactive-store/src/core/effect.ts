/**
 * Effects - run side effects when reactive values change
 */

import type { EffectFn, EffectCleanup, Unsubscribe } from "../types";
import { getActiveEffect, setActiveEffect } from "./dependency";

interface EffectState {
  fn: EffectFn;
  cleanup: EffectCleanup | undefined;
  unsubscribeFunctions: Set<Unsubscribe>;
  isRunning: boolean;
}

export function effect(fn: EffectFn): Unsubscribe {
  const state: EffectState = {
    fn,
    cleanup: undefined,
    unsubscribeFunctions: new Set(),
    isRunning: false,
  };

  const runEffect = () => {
    // Prevent infinite loops
    if (state.isRunning) {
      return;
    }

    state.isRunning = true;

    // Cleanup previous run
    if (state.cleanup) {
      try {
        state.cleanup();
      } catch (error) {
        console.error("Error in effect cleanup:", error);
      }
      state.cleanup = undefined;
    }

    // Clear old dependencies
    state.unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    state.unsubscribeFunctions.clear();

    // Set as active effect
    const previousEffect = getActiveEffect();
    setActiveEffect(runEffect);

    try {
      // Run the effect function
      const result = state.fn();
      if (typeof result === "function") {
        state.cleanup = result;
      }
    } catch (error) {
      console.error("Error in effect:", error);
    } finally {
      setActiveEffect(previousEffect);
      state.isRunning = false;
    }
  };

  // Run immediately
  runEffect();

  // Return stop function
  return () => {
    if (state.cleanup) {
      try {
        state.cleanup();
      } catch (error) {
        console.error("Error in effect cleanup on stop:", error);
      }
    }
    state.unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    state.unsubscribeFunctions.clear();
  };
}
