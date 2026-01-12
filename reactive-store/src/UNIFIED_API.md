# 🔄 Unified Reactive API

The `reactive()` function now works for **both primitives and objects** automatically!

## ✨ What Changed

**Now:**
- `reactive()` - Works for **both** primitives and objects automatically!
- `reactiveObject()` - **Removed** - use `reactive()` instead

## 🎯 How It Works

The `reactive()` function automatically detects the type:

### For Primitives (numbers, strings, booleans, etc.)
```typescript
const count = reactive(0);
count.value = 10; // Use .value
console.log(count.value); // 10
```

### For Objects
```typescript
const user = reactive({ name: 'John', age: 30 });
user.name = 'Jane'; // Direct property access (no .value needed!)
console.log(user.name); // 'Jane'
```

## 📝 Examples

### Example 1: Primitive
```typescript
import { reactive, effect } from './reactive-store/src';

const count = reactive(0);

effect(() => {
  console.log('Count:', count.value);
});

count.value = 5; // Logs: "Count: 5"
```

### Example 2: Object
```typescript
import { reactive, effect } from './reactive-store/src';

const user = reactive({
  name: 'John',
  age: 30,
  address: {
    city: 'NYC'
  }
});

effect(() => {
  console.log(user.name, user.age, user.address.city);
});

user.name = 'Jane'; // Triggers effect
user.age = 31; // Triggers effect
user.address.city = 'LA'; // Triggers effect (deep reactivity)
```

### Example 3: Mixed Usage
```typescript
import { reactive, computed, effect } from './reactive-store/src';

// Primitive
const count = reactive(0);

// Object
const user = reactive({
  name: 'John',
  age: 30
});

// Computed using both
const display = computed(() => {
  return `${user.name} (${user.age}) - Count: ${count.value}`;
});

effect(() => {
  console.log(display.value);
});

count.value = 5; // Updates display
user.name = 'Jane'; // Updates display
```

## 🔄 Backward Compatibility

`reactiveObject()` has been **removed**. Use `reactive()` instead:

```typescript
// ✅ Use reactive() for everything
const user = reactive({ name: 'John' });

// ❌ reactiveObject() no longer exists
```

## 💡 Benefits

1. **Simpler API** - One function instead of two
2. **Automatic Detection** - No need to choose which function to use
3. **Consistent Behavior** - Same reactivity system for both
4. **Backward Compatible** - Existing code still works

## 🎨 Migration Guide

### Old Way (No longer works)
```typescript
import { reactive, reactiveObject } from './reactive-store/src';

const count = reactive(0);
const user = reactiveObject({ name: 'John' }); // ❌ reactiveObject removed
```

### New Way
```typescript
import { reactive } from './reactive-store/src';

const count = reactive(0);
const user = reactive({ name: 'John' }); // ✅ Use reactive for everything!
```

## 🚀 Usage

Just use `reactive()` for everything:

```typescript
// Primitive
const count = reactive(0);
count.value = 10;

// Object
const user = reactive({ name: 'John' });
user.name = 'Jane';

// Array (treated as primitive - use .value)
const items = reactive([1, 2, 3]);
items.value.push(4);

// Nested objects (deep reactivity)
const state = reactive({
  user: {
    name: 'John',
    profile: {
      bio: 'Developer'
    }
  }
});
state.user.profile.bio = 'Designer'; // Deep reactivity works!
```

## ⚠️ Important Notes

1. **Primitives use `.value`** - Numbers, strings, booleans, arrays
2. **Objects use direct access** - No `.value` needed
3. **Deep reactivity** - Nested objects are automatically reactive
4. **Arrays are primitives** - Use `.value` for arrays

## 🎉 Result

Now you have **one unified function** that works for everything! 🚀
