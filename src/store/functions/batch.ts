import {
  endBatching,
  pendingKeys,
  startBatching,
  store,
} from "../storeRegistry";

export default function batch(batchFunc: () => void) {
  startBatching();
  batchFunc();
  endBatching();

  for (const key of Array.from(pendingKeys)) {
    const subscribers = store.get(key)?.subscribers;

    if (subscribers) {
      for (const subscriber of Array.from(subscribers)) {
        subscriber();
      }
    }
  }

  pendingKeys.clear();
}
