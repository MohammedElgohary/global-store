# 🔄 Migration Guide: reactiveObject → reactive

## What Changed

`reactiveObject()` has been **removed** and unified into `reactive()`. Now `reactive()` automatically handles both primitives and objects!

## ✅ Quick Migration

### Before
```typescript
import { reactive, reactiveObject } from './reactive-store/src';

const count = reactive(0);
const user = reactiveObject({ name: 'John' });
```

### After
```typescript
import { reactive } from './reactive-store/src';

const count = reactive(0);
const user = reactive({ name: 'John' }); // Same function!
```

## 📝 Examples

### Example 1: Simple Object
```typescript
// ❌ Old
const user = reactiveObject({ name: 'John', age: 30 });

// ✅ New
const user = reactive({ name: 'John', age: 30 });
```

### Example 2: Nested Objects
```typescript
// ❌ Old
const state = reactiveObject({
  user: {
    name: 'John',
    profile: { bio: 'Developer' }
  }
});

// ✅ New
const state = reactive({
  user: {
    name: 'John',
    profile: { bio: 'Developer' }
  }
});
```

### Example 3: Arrays (Still use .value)
```typescript
// Arrays are treated as primitives
const items = reactive([1, 2, 3]);
items.value.push(4); // Use .value for arrays
```

## 🎯 How It Works Now

- **Objects** → Direct property access (no `.value`)
  ```typescript
  const user = reactive({ name: 'John' });
  user.name = 'Jane'; // Direct access
  ```

- **Primitives** → Use `.value`
  ```typescript
  const count = reactive(0);
  count.value = 10; // Use .value
  ```

## ✅ All Examples Updated

All example files have been updated:
- ✅ `counter.html`
- ✅ `form-validation.html`
- ✅ `todo-list.html`
- ✅ `shopping-cart.html`
- ✅ `test.html`
- ✅ `advanced-features.html`

## 🚀 Benefits

1. **Simpler API** - One function instead of two
2. **Automatic Detection** - No need to choose
3. **Consistent** - Same behavior everywhere
4. **Less Confusion** - No more "which one do I use?"

## 💡 Tips

- Use `reactive()` for **everything**
- Objects get direct property access automatically
- Primitives use `.value` automatically
- Deep reactivity works the same way

Happy coding! 🎉
