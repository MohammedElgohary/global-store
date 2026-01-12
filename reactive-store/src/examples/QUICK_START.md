# 🚀 Quick Start: Using Reactive Store in HTML/JavaScript

## Step-by-Step Guide

### Step 1: Create an HTML File

Create a file like `my-app.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Reactive App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="app.js"></script>
  </body>
</html>
```

### Step 2: Import Reactive Functions

In your JavaScript file (`app.js`):

```javascript
import { reactive, computed, effect } from "../index.js";
```

### Step 3: Create Reactive State

```javascript
// For simple values
const count = reactive(0);
const name = reactive("John");

// For objects
const user = reactive({
  name: "John",
  age: 30,
});
```

### Step 4: Create Computed Values (Optional)

```javascript
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
```

### Step 5: Use Effects to Update DOM

```javascript
effect(() => {
  document.getElementById("app").innerHTML = `
    <h1>Count: ${count.value}</h1>
    <p>Name: ${name.value}</p>
  `;
});
```

### Step 6: Update State in Event Handlers

```javascript
document.getElementById("button").onclick = () => {
  count.value++;
  name.value = "Jane";
};
```

## 📝 Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="counter">0</div>
    <button id="btn">Click Me</button>

    <script type="module">
      import { reactive, effect } from "../prototype.js";

      // Create reactive state
      const count = reactive(0);

      // Auto-update DOM
      effect(() => {
        document.getElementById("counter").textContent = count.value;
      });

      // Update on button click
      document.getElementById("btn").onclick = () => {
        count.value++;
      };
    </script>
  </body>
</html>
```

## 🎯 Common Patterns

### Pattern 1: Form Input Binding

```javascript
const form = reactive({
  email: "",
  password: "",
});

// Bind input to reactive state
document.getElementById("email").addEventListener("input", (e) => {
  form.email = e.target.value;
});

// Auto-update UI
effect(() => {
  document.getElementById("email-display").textContent = form.email;
});
```

### Pattern 2: List Rendering

```javascript
const items = reactive({
  list: ["Item 1", "Item 2"],
});

effect(() => {
  const html = items.list.map((item) => `<li>${item}</li>`).join("");
  document.getElementById("list").innerHTML = html;
});

// Add item
function addItem(text) {
  items.list.push(text);
}
```

### Pattern 3: Conditional Rendering

```javascript
const isLoggedIn = reactive(false);

effect(() => {
  const app = document.getElementById("app");
  if (isLoggedIn.value) {
    app.innerHTML = "<h1>Welcome!</h1>";
  } else {
    app.innerHTML = "<button>Login</button>";
  }
});
```

### Pattern 4: Computed Statistics

```javascript
const todos = reactive({
  items: [
    { text: "Task 1", done: false },
    { text: "Task 2", done: true },
  ],
});

const stats = computed(() => {
  const total = todos.items.length;
  const done = todos.items.filter((t) => t.done).length;
  return { total, done, remaining: total - done };
});

effect(() => {
  document.getElementById(
    "stats"
  ).textContent = `Total: ${stats.value.total}, Done: ${stats.value.done}`;
});
```

## 🔧 Tips

1. **Always use `effect()` for DOM updates** - This ensures the DOM stays in sync with your state

2. **Use `computed()` for derived values** - Don't recalculate in effects, use computed values

3. **Batch multiple updates** - Use `batch()` to prevent multiple DOM updates:

   ```javascript
   import { batch } from "../prototype.js";

   batch(() => {
     user.name = "John";
     user.age = 30;
     user.email = "john@example.com";
   }); // Only one DOM update!
   ```

4. **Clean up effects** - Effects return a cleanup function:

   ```javascript
   const stop = effect(() => {
     // ...
   });

   // Later, when component unmounts
   stop();
   ```

## 🚨 Common Mistakes

### ❌ Don't: Update DOM directly in event handlers

```javascript
button.onclick = () => {
  count.value++;
  document.getElementById("counter").textContent = count.value; // ❌ Don't do this!
};
```

### ✅ Do: Let effects handle DOM updates

```javascript
effect(() => {
  document.getElementById("counter").textContent = count.value; // ✅ Do this!
});

button.onclick = () => {
  count.value++; // DOM updates automatically!
};
```

### ❌ Don't: Recalculate in effects

```javascript
effect(() => {
  const sum = a.value + b.value; // ❌ Recalculated every time
  display.textContent = sum;
});
```

### ✅ Do: Use computed values

```javascript
const sum = computed(() => a.value + b.value);

effect(() => {
  display.textContent = sum.value; // ✅ Uses cached value
});
```

## 📚 Next Steps

- Check out the full examples in this directory
- Read `DESIGN.md` for architecture details
- Read `CONCEPT.md` for deeper understanding
- Try building your own reactive app!
