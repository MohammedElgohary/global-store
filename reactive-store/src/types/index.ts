/**
 * Type definitions for the reactive store system
 */

export interface Reactive<T> {
  readonly value: T;
  subscribe(callback: () => void): () => void;
}

export interface Computed<T> {
  readonly value: T;
  subscribe(callback: () => void): () => void;
}

export type EffectCleanup = () => void;
export type EffectFn = () => void | EffectCleanup;

export type Unsubscribe = () => void;

// Watch types
export type WatchSource<T> = Reactive<T> | Computed<T> | (() => T);
export type WatchCallback<T> = (newValue: T, oldValue: T) => void | (() => void);
