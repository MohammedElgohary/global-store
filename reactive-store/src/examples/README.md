# 📚 Reactive Store Examples - Vanilla JavaScript

These examples demonstrate how to use the reactive store system in plain HTML and JavaScript **without React**.

## 🚀 How to Run

Since these use ES modules, you need to serve them through a web server. With Vite:

```bash
# If using Vite (recommended)
npm run dev

# Then open:
# http://localhost:5173/reactive-store/src/examples/counter.html
# http://localhost:5173/reactive-store/src/examples/form-validation.html
# http://localhost:5173/reactive-store/src/examples/todo-list.html
# http://localhost:5173/reactive-store/src/examples/shopping-cart.html
```

Or use any static file server:
```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server

# Then open: http://localhost:8000/reactive-store/src/examples/counter.html
```

## 📖 Examples

### 1. **Counter** (`counter.html`)
Simple counter that demonstrates:
- Creating reactive values
- Using `effect()` to update DOM automatically
- Multiple reactive values working together

**Key Concepts:**
```javascript
const count = reactive(0);

effect(() => {
  document.getElementById('counter').textContent = count.value;
});

count.value++; // DOM updates automatically!
```

### 2. **Form Validation** (`form-validation.html`)
Form with real-time validation showing:
- Reactive objects
- Computed values for validation
- Automatic UI updates based on state

**Key Concepts:**
```javascript
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});

const isFormValid = computed(() => {
  return emailValid.value && passwordValid.value && passwordsMatch.value;
});

effect(() => {
  submitButton.disabled = !isFormValid.value;
});
```

### 3. **Todo List** (`todo-list.html`)
Full-featured todo app demonstrating:
- Reactive arrays
- Computed statistics
- Adding/removing items
- Toggling completion

**Key Concepts:**
```javascript
const todos = reactive({
  items: []
});

const completedCount = computed(() => {
  return todos.items.filter(todo => todo.completed).length;
});
```

### 4. **Shopping Cart** (`shopping-cart.html`)
Shopping cart with:
- Complex computed values (subtotal, tax, total)
- Quantity management
- Item removal
- Batch updates

**Key Concepts:**
```javascript
const subtotal = computed(() => {
  return cart.items.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
});
```

## 🎯 Key Patterns

### Pattern 1: Reactive State
```javascript
// Create reactive state
const state = reactive({
  count: 0,
  name: 'John'
});
```

### Pattern 2: Computed Values
```javascript
// Derived values that update automatically
const double = computed(() => state.count * 2);
```

### Pattern 3: Effects for DOM Updates
```javascript
// Automatically update DOM when state changes
effect(() => {
  document.getElementById('display').textContent = state.count;
});
```

### Pattern 4: Event Handlers
```javascript
// Update reactive state in event handlers
button.onclick = () => {
  state.count++;
};
```

## 💡 Benefits Over Manual DOM Updates

### ❌ Without Reactivity (Manual)
```javascript
let count = 0;

function updateCount(newValue) {
  count = newValue;
  document.getElementById('counter').textContent = count;
  document.getElementById('status').textContent = count > 0 ? 'Positive' : 'Zero';
  // ... more manual updates
}

updateCount(5);
```

### ✅ With Reactivity (Automatic)
```javascript
const count = reactive(0);

effect(() => {
  document.getElementById('counter').textContent = count.value;
  document.getElementById('status').textContent = count.value > 0 ? 'Positive' : 'Zero';
});

count.value = 5; // Everything updates automatically!
```

## 🔧 Integration Tips

### 1. Import the Reactive Functions
```javascript
import { reactive, computed, effect } from '../index.js';
```

### 2. Create Reactive State
```javascript
// For primitives
const count = reactive(0);

// For objects
const user = reactive({ name: 'John', age: 30 });
```

### 3. Use Effects for Side Effects
```javascript
effect(() => {
  // This runs automatically when dependencies change
  updateUI();
});
```

### 4. Use Computed for Derived Values
```javascript
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

## 🎨 Real-World Use Cases

- **Form Validation**: Real-time validation as user types
- **Shopping Carts**: Automatic price calculations
- **Dashboards**: Auto-updating statistics
- **Games**: Reactive game state
- **Data Visualization**: Charts that update automatically
- **Live Search**: Filtering results as you type

## 🚨 Important Notes

1. **ES Modules Required**: These examples use `import` statements, so they need to be served through a web server (not `file://`)

2. **Browser Support**: Requires modern browsers with Proxy and ES6 support

3. **TypeScript**: The reactive system is written in TypeScript, but works in plain JavaScript too

4. **No Build Step Needed**: You can use the prototype directly, or build it for production

## 🔄 Next Steps

1. Try modifying the examples
2. Create your own reactive components
3. Integrate with your existing codebase
4. Build production-ready version
