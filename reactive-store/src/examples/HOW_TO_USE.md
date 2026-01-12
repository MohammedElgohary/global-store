# 📘 How to Use Reactive Store in HTML and JavaScript

## 🎯 Overview

The reactive store system allows you to create **reactive data** that automatically updates the DOM when values change - **all without React or any framework!**

## 🚀 Basic Usage

### 1. Import the Functions

In your HTML file, use ES modules:

```html
<script type="module">
  import { reactive, computed, effect } from '../index.js';
  
  // Your code here
</script>
```

### 2. Create Reactive State

```javascript
// Simple value
const count = reactive(0);

// Object
const user = reactive({
  name: 'John',
  age: 30
});
```

### 3. Update DOM Automatically

```javascript
effect(() => {
  document.getElementById('counter').textContent = count.value;
});
```

### 4. Change Values

```javascript
// When you change the value, the DOM updates automatically!
count.value = 10;
user.name = 'Jane';
```

## 📝 Complete Working Example

```html
<!DOCTYPE html>
<html>
<head>
  <title>Reactive Counter</title>
</head>
<body>
  <h1 id="counter">0</h1>
  <button id="increment">+</button>
  <button id="decrement">-</button>

  <script type="module">
    import { reactive, effect } from '../reactive-store/src/prototype.js';

    // Create reactive state
    const count = reactive(0);

    // Automatically update DOM when count changes
    effect(() => {
      document.getElementById('counter').textContent = count.value;
    });

    // Update state on button clicks
    document.getElementById('increment').onclick = () => {
      count.value++;
    };

    document.getElementById('decrement').onclick = () => {
      count.value--;
    };
  </script>
</body>
</html>
```

## 🎨 Real-World Examples

### Example 1: Form with Validation

```html
<input type="email" id="email">
<div id="error"></div>
<button id="submit" disabled>Submit</button>

<script type="module">
  import { reactive, computed, effect } from '../index.js';

  const form = reactive({
    email: ''
  });

  const isValid = computed(() => {
    return form.email.includes('@');
  });

  // Auto-update UI
  effect(() => {
    document.getElementById('email').value = form.email;
    document.getElementById('error').textContent = 
      form.email && !isValid.value ? 'Invalid email' : '';
    document.getElementById('submit').disabled = !isValid.value;
  });

  // Bind input
  document.getElementById('email').addEventListener('input', (e) => {
    form.email = e.target.value;
  });
</script>
```

### Example 2: Todo List

```html
<ul id="todos"></ul>
<input id="new-todo">
<button id="add">Add</button>

<script type="module">
  import { reactive, computed, effect } from '../index.js';

  const todos = reactive({
    items: []
  });

  const count = computed(() => todos.items.length);

  // Auto-render list
  effect(() => {
    document.getElementById('todos').innerHTML = 
      todos.items.map((todo, i) => 
        `<li>${todo} <button onclick="removeTodo(${i})">Delete</button></li>`
      ).join('');
  });

  // Add todo
  document.getElementById('add').onclick = () => {
    const input = document.getElementById('new-todo');
    todos.items.push(input.value);
    input.value = '';
  };

  window.removeTodo = (index) => {
    todos.items.splice(index, 1);
  };
</script>
```

### Example 3: Shopping Cart

```html
<div id="cart"></div>
<div id="total"></div>

<script type="module">
  import { reactive, computed, effect } from '../index.js';

  const cart = reactive({
    items: [
      { name: 'Product 1', price: 10, quantity: 2 }
    ]
  });

  const total = computed(() => {
    return cart.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
  });

  effect(() => {
    document.getElementById('cart').innerHTML = 
      cart.items.map(item => 
        `<div>${item.name} - $${item.price} x ${item.quantity}</div>`
      ).join('');
    
    document.getElementById('total').textContent = 
      `Total: $${total.value}`;
  });
</script>
```

## 🔑 Key Concepts

### Reactive Values
```javascript
const count = reactive(0);
count.value = 10; // Automatically notifies subscribers
```

### Computed Values
```javascript
const double = computed(() => count.value * 2);
// Automatically updates when count changes
```

### Effects
```javascript
effect(() => {
  // This runs automatically when dependencies change
  updateDOM();
});
```

### Reactive Objects
```javascript
const user = reactive({ name: 'John' });
user.name = 'Jane'; // Automatically triggers effects
```

## ⚠️ Important Notes

### 1. ES Modules Required
You **must** use `type="module"` in your script tag:
```html
<script type="module">
  // Your code
</script>
```

### 2. Server Required
You **cannot** open HTML files directly (`file://`). You need a web server:
- Use Vite: `npm run dev`
- Use Python: `python -m http.server 8000`
- Use any static file server

### 3. Import Path
Make sure the import path is correct relative to your HTML file:
```javascript
// If HTML is in examples/ and store is in reactive-store/src/
import { reactive } from '../reactive-store/src/prototype.js';
```

## 🎯 Common Patterns

### Pattern 1: Two-Way Binding
```javascript
const value = reactive('');

// Input → State
input.addEventListener('input', (e) => {
  value.value = e.target.value;
});

// State → DOM
effect(() => {
  input.value = value.value;
});
```

### Pattern 2: Conditional Rendering
```javascript
const isVisible = reactive(true);

effect(() => {
  element.style.display = isVisible.value ? 'block' : 'none';
});
```

### Pattern 3: List Rendering
```javascript
const items = reactive({ list: [] });

effect(() => {
  container.innerHTML = items.list
    .map(item => `<div>${item}</div>`)
    .join('');
});
```

### Pattern 4: Batch Updates
```javascript
import { batch } from '../reactive-store/src/prototype.js';

batch(() => {
  user.name = 'John';
  user.age = 30;
  user.email = 'john@example.com';
}); // Only one DOM update!
```

## 🐛 Troubleshooting

### Problem: "Cannot use import statement outside a module"
**Solution:** Add `type="module"` to your script tag:
```html
<script type="module">
```

### Problem: "Failed to fetch module"
**Solution:** You need to serve files through a web server, not `file://`

### Problem: "Module not found"
**Solution:** Check the import path is correct relative to your HTML file

### Problem: DOM not updating
**Solution:** Make sure you're using `effect()` to update the DOM, not updating it directly in event handlers

## 📚 Next Steps

1. ✅ Try the `simple-example.html` to see basic usage
2. ✅ Check `counter.html` for a simple app
3. ✅ Look at `form-validation.html` for complex validation
4. ✅ Study `todo-list.html` for list management
5. ✅ Review `shopping-cart.html` for computed values

## 💡 Tips

1. **Always use `effect()` for DOM updates** - Don't update DOM directly
2. **Use `computed()` for derived values** - More efficient than calculating in effects
3. **Use `batch()` for multiple updates** - Prevents unnecessary re-renders
4. **Keep effects simple** - Just update the DOM, don't do complex logic
5. **Use reactive objects for complex state** - Easier than multiple reactive values

## 🎉 You're Ready!

You now know how to use reactive data in plain HTML and JavaScript. No React needed! 🚀
