export default function isEqual(first: unknown, second: unknown): boolean {
  if (Object.is(first, second)) {
    return true;
  }

  if (typeof first !== typeof second) {
    return false;
  }

  if (typeof first !== "object" || first === null || second === null) {
    return false;
  }

  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  for (const key of firstKeys) {
    if (!isEqual(first[key], second[key])) {
      return false;
    }
  }

  return true;
}
