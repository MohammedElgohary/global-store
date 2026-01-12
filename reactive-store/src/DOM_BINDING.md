# 🎨 Reactive DOM Binding

Automatically update the DOM when reactive values change - **no manual DOM manipulation needed!**

## 🎯 The Problem

**Before (manual DOM updates):**
```javascript
const count = reactive(0);

effect(() => {
  document.getElementById('counter').textContent = count.value;
  document.getElementById('status').textContent = count.value > 0 ? 'Positive' : 'Zero';
  document.getElementById('button').disabled = count.value === 0;
});
```

**After (reactive binding):**
```javascript
const count = reactive(0);

bindText('#counter', count);
bindText('#status', () => count.value > 0 ? 'Positive' : 'Zero');
bindAttr('#button', 'disabled', () => count.value === 0);
```

Much cleaner! ✨

## 📚 API Reference

### `bindText(selector, source)`

Bind text content to a reactive value.

```javascript
const count = reactive(0);
bindText('#counter', count);

count.value = 10; // DOM updates automatically!
```

### `bindHTML(selector, source)`

Bind HTML content to a reactive value.

```javascript
const user = reactive({ name: 'John' });
bindHTML('#content', () => `<div><strong>${user.name}</strong></div>`);
```

### `bindAttr(selector, attribute, source)`

Bind an attribute to a reactive value.

```javascript
const user = reactive({ name: 'John' });
bindAttr('#input', 'value', () => user.name);
bindAttr('#button', 'disabled', () => !user.name);
```

### `bindProp(selector, property, source)`

Bind a property to a reactive value.

```javascript
const checked = reactive(false);
bindProp('#checkbox', 'checked', checked);
```

### `bindClass(selector, className, condition)`

Toggle a CSS class based on a reactive condition.

```javascript
const isActive = reactive(false);
bindClass('#button', 'active', isActive);
```

### `bindStyle(selector, property, source)`

Bind a CSS style property to a reactive value.

```javascript
const color = reactive('red');
bindStyle('#text', 'color', color);
```

### `render(selector, template)`

Render a template function into an element.

```javascript
const todos = reactive({ items: [] });

render('#todo-list', () => {
  return todos.items.map(todo => 
    `<div>${todo.text}</div>`
  ).join('');
});
```

### `bindMultiple(bindings)`

Bind multiple properties at once.

```javascript
const user = reactive({ name: 'John', age: 30 });

bindMultiple([
  { selector: '#name', type: 'text', target: '', source: () => user.name },
  { selector: '#age', type: 'text', target: '', source: () => user.age },
  { selector: '#input', type: 'attr', target: 'value', source: () => user.name },
]);
```

## 🎨 Complete Example

```html
<!DOCTYPE html>
<html>
<body>
  <div id="counter">0</div>
  <div id="status"></div>
  <button id="btn">Click</button>

  <script type="module">
    import { reactive, bindText, bindAttr, bindClass } from './reactive-store/src';

    const count = reactive(0);
    const isPositive = computed(() => count.value > 0);

    // Automatic DOM updates!
    bindText('#counter', count);
    bindText('#status', () => count.value > 0 ? 'Positive' : 'Zero');
    bindAttr('#btn', 'disabled', () => count.value === 0);
    bindClass('#btn', 'active', isPositive);

    document.getElementById('btn').onclick = () => {
      count.value++;
    };
  </script>
</body>
</html>
```

## 💡 Benefits

1. **Less Code** - No manual `document.getElementById()`
2. **Automatic Updates** - DOM updates when data changes
3. **Declarative** - Describe what, not how
4. **Reactive** - Uses existing reactive system
5. **Type-safe** - Full TypeScript support

## 🔄 Comparison

### Manual Way
```javascript
const count = reactive(0);
const status = reactive('Zero');

effect(() => {
  const counterEl = document.getElementById('counter');
  const statusEl = document.getElementById('status');
  if (counterEl) counterEl.textContent = count.value;
  if (statusEl) statusEl.textContent = status.value;
});
```

### Reactive Binding Way
```javascript
const count = reactive(0);
const status = reactive('Zero');

bindText('#counter', count);
bindText('#status', status);
```

## 🎯 Use Cases

- **Forms** - Auto-update validation messages
- **Counters** - Auto-update displays
- **Lists** - Auto-render when items change
- **Charts** - Auto-update when data changes
- **Dashboards** - Auto-update all widgets

## 📝 See It In Action

Check out `examples/dom-binding-demo.html` for a complete working example!
