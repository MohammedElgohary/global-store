/**
 * Reactive Store Framework
 *
 * A lightweight, framework-agnostic reactive state management system
 * that works in vanilla JavaScript without React or any other framework.
 *
 * @example
 * ```typescript
 * import { reactive, effect } from './reactive-store';
 *
 * const count = reactive(0);
 *
 * effect(() => {
 *   console.log('Count:', count.value);
 * });
 *
 * count.value = 5; // Logs: "Count: 5"
 * ```
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

// React integration (optional)
export { useReactive, useComputed, useReactiveObject, useWatch } from "./react";
