# 🔄 Reactive Store vs. Other Frameworks

This document explains how **reactive-store** compares to existing reactive frameworks and libraries.

## 🎯 What is Reactive-Store?

**Reactive-store** is a **lightweight, framework-agnostic reactive state management system** inspired by modern reactive frameworks, but designed to work **standalone in vanilla JavaScript**.

## 📊 Comparison Table

| Feature | Reactive-Store | Vue 3 | Solid.js | MobX | RxJS | Svelte |
|---------|---------------|-------|----------|------|------|--------|
| **Reactive Primitives** | ✅ `reactive()` | ✅ `ref()` | ✅ `createSignal()` | ✅ `observable()` | ✅ `BehaviorSubject` | ✅ `$:` |
| **Reactive Objects** | ✅ `reactive({})` | ✅ `reactive({})` | ✅ `createStore()` | ✅ `observable({})` | ❌ | ✅ `$:` |
| **Computed Values** | ✅ `computed()` | ✅ `computed()` | ✅ `createMemo()` | ✅ `computed()` | ✅ `combineLatest` | ✅ `$:` |
| **Effects** | ✅ `effect()` | ✅ `watchEffect()` | ✅ `createEffect()` | ✅ `autorun()` | ✅ `subscribe()` | ✅ `$:` |
| **DOM Binding** | ✅ Built-in | ✅ Template | ✅ JSX | ❌ | ❌ | ✅ Template |
| **Framework Agnostic** | ✅ Yes | ❌ Vue only | ❌ Solid only | ✅ Yes | ✅ Yes | ❌ Svelte only |
| **Vanilla JS** | ✅ Yes | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| **Size** | ~12 KB | ~40 KB | ~15 KB | ~25 KB | ~50 KB | ~15 KB |

## 🎨 Similarities to Existing Frameworks

### 1. **Vue 3 Composition API** (Very Similar!)

**Vue 3:**
```javascript
import { ref, computed, watchEffect } from 'vue';

const count = ref(0);
const double = computed(() => count.value * 2);
watchEffect(() => console.log(count.value));
```

**Reactive-Store:**
```javascript
import { reactive, computed, effect } from './reactive-store/src';

const count = reactive(0);
const double = computed(() => count.value * 2);
effect(() => console.log(count.value));
```

**Similarities:**
- ✅ Same API pattern (`reactive`/`ref`, `computed`, `effect`/`watchEffect`)
- ✅ Same dependency tracking mechanism
- ✅ Same reactive object behavior (Proxy-based)
- ✅ Same lazy computed evaluation

**Differences:**
- ❌ Vue requires Vue framework
- ✅ Reactive-store works in vanilla JS
- ✅ Reactive-store has built-in DOM binding

### 2. **Solid.js** (Similar Concepts!)

**Solid.js:**
```javascript
import { createSignal, createMemo, createEffect } from 'solid-js';

const [count, setCount] = createSignal(0);
const double = createMemo(() => count() * 2);
createEffect(() => console.log(count()));
```

**Reactive-Store:**
```javascript
import { reactive, computed, effect } from './reactive-store/src';

const count = reactive(0);
const double = computed(() => count.value * 2);
effect(() => console.log(count.value));
```

**Similarities:**
- ✅ Fine-grained reactivity
- ✅ Automatic dependency tracking
- ✅ Computed values
- ✅ Effects system

**Differences:**
- ❌ Solid requires JSX/compiler
- ✅ Reactive-store works without compilation
- ✅ Reactive-store has DOM binding utilities

### 3. **MobX** (Similar Philosophy!)

**MobX:**
```javascript
import { observable, computed, autorun } from 'mobx';

const state = observable({ count: 0 });
const double = computed(() => state.count * 2);
autorun(() => console.log(state.count));
```

**Reactive-Store:**
```javascript
import { reactive, computed, effect } from './reactive-store/src';

const state = reactive({ count: 0 });
const double = computed(() => state.count * 2);
effect(() => console.log(state.count));
```

**Similarities:**
- ✅ Observable pattern
- ✅ Automatic dependency tracking
- ✅ Computed values
- ✅ Framework-agnostic

**Differences:**
- ❌ MobX requires decorators or `makeObservable`
- ✅ Reactive-store uses simple function calls
- ✅ Reactive-store has DOM binding

### 4. **Svelte** (Similar Reactivity Model!)

**Svelte:**
```javascript
let count = $state(0);
let double = $derived(count * 2);
$effect(() => console.log(count));
```

**Reactive-Store:**
```javascript
import { reactive, computed, effect } from './reactive-store/src';

const count = reactive(0);
const double = computed(() => count.value * 2);
effect(() => console.log(count.value));
```

**Similarities:**
- ✅ Reactive primitives
- ✅ Derived values
- ✅ Effects
- ✅ Compile-time optimizations (Svelte) vs runtime (Reactive-Store)

**Differences:**
- ❌ Svelte requires compiler
- ✅ Reactive-store works at runtime
- ✅ Reactive-store works in vanilla JS

## 🎯 Key Differences

### What Makes Reactive-Store Unique?

1. **Framework-Agnostic**
   - Works in vanilla JavaScript
   - No framework required
   - Can be used with React, Vue, Angular, or standalone

2. **Built-in DOM Binding**
   - `bindText()`, `bindHTML()`, `render()` functions
   - No template compiler needed
   - Works directly with DOM

3. **Lightweight**
   - ~12 KB minified
   - Zero dependencies
   - Small API surface

4. **Simple API**
   - No decorators
   - No compilation step
   - Just functions

## 🔄 API Comparison

### Creating Reactive Values

| Framework | API |
|-----------|-----|
| **Reactive-Store** | `reactive(0)` |
| **Vue 3** | `ref(0)` |
| **Solid.js** | `createSignal(0)` |
| **MobX** | `observable.box(0)` |
| **Svelte** | `$state(0)` |

### Computed Values

| Framework | API |
|-----------|-----|
| **Reactive-Store** | `computed(() => a.value + b.value)` |
| **Vue 3** | `computed(() => a.value + b.value)` |
| **Solid.js** | `createMemo(() => a() + b())` |
| **MobX** | `computed(() => a.get() + b.get())` |
| **Svelte** | `$derived(a + b)` |

### Effects

| Framework | API |
|-----------|-----|
| **Reactive-Store** | `effect(() => console.log(count.value))` |
| **Vue 3** | `watchEffect(() => console.log(count.value))` |
| **Solid.js** | `createEffect(() => console.log(count()))` |
| **MobX** | `autorun(() => console.log(count.get()))` |
| **Svelte** | `$effect(() => console.log(count))` |

## 💡 Use Cases

### When to Use Reactive-Store?

✅ **Use Reactive-Store when:**
- Building vanilla JavaScript applications
- Need reactivity without a framework
- Want lightweight state management
- Need DOM binding without templates
- Working with existing projects (can integrate anywhere)

❌ **Don't use Reactive-Store when:**
- Already using Vue 3 (use Vue's built-in reactivity)
- Already using Solid.js (use Solid's reactivity)
- Need compile-time optimizations (use Svelte)
- Need complex async streams (use RxJS)

## 🎨 Inspiration

Reactive-store is **inspired by**:
- **Vue 3 Composition API** - API design and reactivity model
- **Solid.js** - Fine-grained reactivity concepts
- **MobX** - Observable pattern
- **Svelte** - Reactive primitives

But it's **not a replacement** for these frameworks - it's a **standalone solution** for vanilla JavaScript.

## 📚 Summary

**Reactive-store** is most similar to:
1. **Vue 3 Composition API** - Almost identical API
2. **Solid.js** - Similar reactivity model
3. **MobX** - Similar observable pattern

But it's **unique** because:
- ✅ Works in vanilla JavaScript (no framework needed)
- ✅ Has built-in DOM binding utilities
- ✅ Lightweight and dependency-free
- ✅ Can be used alongside any framework

Think of it as **"Vue 3's reactivity system, but for vanilla JavaScript"** with added DOM binding utilities!
