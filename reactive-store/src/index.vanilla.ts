/**
 * Reactive Store Framework - Vanilla JS Only
 * 
 * This version excludes React hooks for use in vanilla JavaScript/browser environments
 */

// Core reactive primitives
export {
  reactive,
  computed,
  effect,
  batch,
  isBatchingUpdates,
  scheduleNotification,
  readonly,
  readonlyObject,
  watch,
  watchMultiple,
  watchProperty,
  setDebug,
  isDebugEnabled,
  trackReactive,
  getDebugInfo,
  logTrackedReactive,
  clearDebugTracking,
  ref,
  toRaw,
  markRaw,
  isRaw,
  shallowReactive,
  bindText,
  bindHTML,
  bindAttr,
  bindProp,
  bindClass,
  bindStyle,
  render,
  bindMultiple,
} from "./core";

// Types
export type {
  Reactive,
  Computed,
  EffectFn,
  EffectCleanup,
  Unsubscribe,
  WatchSource,
  WatchCallback,
} from "./types";

// Note: React hooks are excluded from this build
// Use index.ts if you need React integration
