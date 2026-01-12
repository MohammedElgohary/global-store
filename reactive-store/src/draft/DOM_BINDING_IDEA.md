# 💡 Reactive DOM Binding - Design Idea

## 🎯 Goal

Create a system that automatically updates the DOM when reactive values change, without manual `document.getElementById()` and `.innerHTML` code.

## 💭 The Problem

**Current way (manual):**
```javascript
const count = reactive(0);

effect(() => {
  document.getElementById('counter').textContent = count.value;
});
```

**What we want (declarative):**
```javascript
const count = reactive(0);

// Automatically bind to DOM
bind('#counter', () => count.value);
// or
bindText('#counter', count);
```

## 🎨 Design Ideas

### Option 1: Binding Functions

```javascript
import { reactive, bind, bindText, bindHTML, bindAttr } from './reactive-store/src';

const count = reactive(0);
const user = reactive({ name: 'John' });

// Bind text content
bindText('#counter', count);
bindText('#name', () => user.name);

// Bind HTML
bindHTML('#content', () => `<div>${user.name}</div>`);

// Bind attributes
bindAttr('#input', 'value', () => user.name);

// Bind classes
bindClass('#button', 'active', () => count.value > 0);
```

### Option 2: Template System

```javascript
import { reactive, template } from './reactive-store/src';

const state = reactive({ count: 0, name: 'John' });

template('#app', () => `
  <div>
    <h1>Count: ${state.count}</h1>
    <p>Name: ${state.name}</p>
  </div>
`);
```

### Option 3: Declarative Bindings (Vue-like)

```html
<div id="app">
  <div data-bind="text: count"></div>
  <div data-bind="text: user.name"></div>
  <input data-bind="value: user.name" />
</div>

<script>
import { reactive, bindAll } from './reactive-store/src';

const count = reactive(0);
const user = reactive({ name: 'John' });

bindAll('#app', { count, user });
</script>
```

### Option 4: Component-like System

```javascript
import { reactive, createComponent } from './reactive-store/src';

const Counter = createComponent(({ count }) => {
  return {
    template: () => `
      <div>
        <span>Count: ${count.value}</span>
        <button onclick="count.value++">+</button>
      </div>
    `,
    mount: '#app'
  };
});

const count = reactive(0);
Counter({ count });
```

## 🎯 Recommended Approach: Hybrid

Combine multiple approaches for flexibility:

### 1. Simple Bindings (for single elements)
```javascript
bindText(selector, reactiveValue);
bindHTML(selector, reactiveValue);
bindAttr(selector, attr, reactiveValue);
```

### 2. Template Rendering (for complex HTML)
```javascript
render(selector, templateFunction);
```

### 3. Declarative Bindings (for HTML attributes)
```html
<div data-text="count"></div>
<div data-html="content"></div>
<input data-value="user.name" />
```

## 📝 Example Implementation

```javascript
// bind.ts
export function bindText(selector, source) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  effect(() => {
    const value = typeof source === 'function' ? source() : source.value;
    element.textContent = value;
  });
}

export function bindHTML(selector, source) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  effect(() => {
    const value = typeof source === 'function' ? source() : source.value;
    element.innerHTML = value;
  });
}

export function render(selector, template) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  effect(() => {
    container.innerHTML = template();
  });
}
```

## 🎨 Usage Examples

### Example 1: Simple Counter
```javascript
const count = reactive(0);
bindText('#counter', count);

button.onclick = () => count.value++;
// DOM updates automatically!
```

### Example 2: Complex Template
```javascript
const todos = reactive({ items: [] });

render('#todo-list', () => {
  return todos.items.map(todo => 
    `<div>${todo.text}</div>`
  ).join('');
});
```

### Example 3: Multiple Bindings
```javascript
const user = reactive({ name: 'John', age: 30 });

bindText('#name', () => user.name);
bindText('#age', () => user.age);
bindAttr('#avatar', 'src', () => `/images/${user.name}.jpg`);
```

## 💡 Benefits

1. **Less Boilerplate** - No manual DOM updates
2. **Automatic** - DOM updates when data changes
3. **Declarative** - Describe what, not how
4. **Reactive** - Uses existing reactive system
5. **Framework-agnostic** - Works in vanilla JS

## 🔄 Comparison

### Before (Manual)
```javascript
const count = reactive(0);

effect(() => {
  document.getElementById('counter').textContent = count.value;
  document.getElementById('status').textContent = count.value > 0 ? 'Positive' : 'Zero';
  document.getElementById('button').disabled = count.value === 0;
});
```

### After (Reactive Binding)
```javascript
const count = reactive(0);

bindText('#counter', count);
bindText('#status', () => count.value > 0 ? 'Positive' : 'Zero');
bindAttr('#button', 'disabled', () => count.value === 0);
```

Much cleaner! 🎉
