/**
 * Dependency tracking system
 * Tracks which effects/computed values are currently being evaluated
 */

import type { Computed } from "../types";

let activeEffect: (() => void) | null = null;
let activeComputed: Computed<any> | null = null;

export function getActiveEffect(): (() => void) | null {
  return activeEffect;
}

export function setActiveEffect(effect: (() => void) | null): void {
  activeEffect = effect;
}

export function getActiveComputed<T>(): Computed<T> | null {
  return activeComputed;
}

export function setActiveComputed<T>(computed: Computed<T> | null): void {
  activeComputed = computed;
}
