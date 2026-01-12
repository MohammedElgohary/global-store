/**
 * Batch updates - prevent intermediate notifications
 */

let isBatching = false;
const pendingNotifications = new Set<() => void>();

export function batch(fn: () => void): void {
  if (isBatching) {
    // Already batching, just execute
    fn();
    return;
  }

  isBatching = true;

  try {
    fn();
  } finally {
    isBatching = false;

    // Execute all pending notifications
    const notifications = Array.from(pendingNotifications);
    pendingNotifications.clear();

    notifications.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.error("Error in batched notification:", error);
      }
    });
  }
}

export function isBatchingUpdates(): boolean {
  return isBatching;
}

export function scheduleNotification(callback: () => void): void {
  if (isBatching) {
    pendingNotifications.add(callback);
  } else {
    callback();
  }
}
