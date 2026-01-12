# 🚀 Advanced Features

The reactive store framework now includes advanced features for more powerful reactive programming.

## ✨ New Features

### 1. **Readonly Reactive** 🔒

Create read-only reactive values that cannot be modified.

```typescript
import { reactive, readonly } from './reactive-store/src';

const count = reactive(0);
const readonlyCount = readonly(count);

readonlyCount.value = 10; // ❌ Fails silently (or throws in strict mode)
count.value = 10; // ✅ Works - modifies the original
```

**Use Cases:**
- Expose reactive state without allowing modifications
- Create immutable views of data
- Prevent accidental mutations

### 2. **Readonly Objects** 🔒

Create read-only reactive objects.

```typescript
import { reactive, readonlyObject } from './reactive-store/src';

const user = reactive({
  name: 'John',
  age: 30
});

const readonlyUser = readonlyObject(user);

readonlyUser.name = 'Jane'; // ❌ Fails silently
user.name = 'Jane'; // ✅ Works
```

### 3. **Watch Function** 👀

Watch specific reactive values for changes with callbacks.

```typescript
import { reactive, watch } from './reactive-store/src';

const count = reactive(0);

watch(
  count,
  (newValue, oldValue) => {
    console.log(`Count changed from ${oldValue} to ${newValue}`);
  },
  { immediate: true } // Run immediately with current value
);
```

**Options:**
- `immediate`: Run callback immediately with current value
- `deep`: Watch nested properties (for objects)

### 4. **Watch Property** 👀

Watch a specific property of a reactive object.

```typescript
import { reactive, watchProperty } from './reactive-store/src';

const user = reactive({
  name: 'John',
  age: 30,
  email: 'john@example.com'
});

watchProperty(
  user,
  'name',
  (newName, oldName) => {
    console.log(`Name changed: ${oldName} → ${newName}`);
  },
  { immediate: true }
);

user.name = 'Jane'; // Triggers watch callback
user.age = 31; // Does NOT trigger (watching 'name' only)
```

### 5. **Watch Multiple** 👀

Watch multiple reactive values at once.

```typescript
import { reactive, watchMultiple } from './reactive-store/src';

const firstName = reactive('John');
const lastName = reactive('Doe');

watchMultiple(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`Name changed: ${oldFirst} ${oldLast} → ${newFirst} ${newLast}`);
  }
);
```

### 6. **Debug Tools** 🐛

Track and debug reactive values during development.

```typescript
import { reactive, setDebug, trackReactive, getDebugInfo, logTrackedReactive } from './reactive-store/src';

// Enable debug mode
setDebug(true);

const count = reactive(0);

// Track a reactive value
trackReactive(count, 'reactive');

// Modify the value
count.value = 10;
count.value = 20;

// Get debug info
const info = getDebugInfo(count);
console.log(info);
// {
//   type: 'reactive',
//   subscribers: 1,
//   value: 20,
//   history: [
//     { value: 0, timestamp: ... },
//     { value: 10, timestamp: ... },
//     { value: 20, timestamp: ... }
//   ]
// }

// Log all tracked values
logTrackedReactive();
```

**Debug Functions:**
- `setDebug(enabled)` - Enable/disable debug mode
- `isDebugEnabled()` - Check if debug is enabled
- `trackReactive(reactive, type)` - Start tracking a reactive value
- `getDebugInfo(reactive)` - Get debug info for a value
- `logTrackedReactive()` - Log all tracked values to console
- `clearDebugTracking()` - Clear all debug tracking

## 📝 Complete Example

See `examples/advanced-features.html` for a complete working example of all advanced features.

## 🎯 When to Use Each Feature

### Use `readonly()` when:
- You want to expose state without allowing modifications
- Creating immutable views
- Preventing accidental mutations

### Use `watch()` when:
- You need to react to specific value changes
- You want old/new value comparison
- You need one-time callbacks (not continuous effects)

### Use `watchProperty()` when:
- You only care about one property of an object
- You want to avoid unnecessary re-renders
- You need fine-grained control

### Use Debug Tools when:
- Developing and testing
- Debugging reactive behavior
- Understanding dependency chains
- Performance profiling

## 💡 Tips

1. **Readonly is shallow** - Nested objects can still be modified unless they're also readonly
2. **Watch vs Effect** - Use `watch()` for callbacks, `effect()` for side effects
3. **Debug in development only** - Disable debug mode in production
4. **Watch is more efficient** - Only triggers when watched value changes, not on all dependencies

## 🔄 Migration

If you were using manual subscriptions, consider migrating to `watch()`:

```typescript
// Old way
const unsubscribe = count.subscribe(() => {
  console.log('Changed');
});

// New way (better)
watch(count, (newValue, oldValue) => {
  console.log('Changed from', oldValue, 'to', newValue);
});
```

## 📚 API Reference

See the main `README.md` for complete API documentation.
