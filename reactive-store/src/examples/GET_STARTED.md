# 🚀 Get Started with Reactive Store Examples

All examples are now in `reactive-store/src/examples/` and ready to use!

## ✅ What's Fixed

- ✅ All import paths updated to `../prototype.js`
- ✅ All examples moved to the correct location
- ✅ Documentation updated

## 🎯 Quick Test

1. **Start your dev server:**

   ```bash
   npm run dev
   ```

2. **Open any example:**
   - Simple: `http://localhost:5173/reactive-store/src/examples/simple-example.html`
   - Counter: `http://localhost:5173/reactive-store/src/examples/counter.html`
   - Form: `http://localhost:5173/reactive-store/src/examples/form-validation.html`
   - Todo List: `http://localhost:5173/reactive-store/src/examples/todo-list.html`
   - Shopping Cart: `http://localhost:5173/reactive-store/src/examples/shopping-cart.html`
   - Test Suite: `http://localhost:5173/reactive-store/src/examples/test.html`

## 📁 File Structure

```
reactive-store/src/
├── prototype.ts          # Reactive system implementation
├── examples/
│   ├── counter.html              # Simple counter example
│   ├── form-validation.html     # Form with validation
│   ├── todo-list.html           # Todo list app
│   ├── shopping-cart.html       # Shopping cart
│   ├── simple-example.html      # Basic example
│   ├── test.html                # Test suite
│   ├── README.md                # Examples overview
│   ├── QUICK_START.md           # Quick start guide
│   ├── HOW_TO_USE.md            # Detailed usage guide
│   └── GET_STARTED.md           # This file
```

## 🔧 How Import Paths Work

Since examples are in `reactive-store/src/examples/`:

- To import from `prototype.ts`: use `../prototype.js`
- The `.js` extension is needed even though the source is `.ts` (TypeScript compiles to JS)

## 📝 Example Import

```javascript
// In any example file (e.g., counter.html)
import { reactive, effect } from "../prototype.js";
```

## 🎨 Next Steps

1. **Try the examples** - Open them in your browser
2. **Modify them** - Change values, add features
3. **Create your own** - Use the patterns from examples
4. **Read the docs** - Check `HOW_TO_USE.md` for detailed patterns

## 💡 Tips

- All examples use ES modules (`type="module"`)
- You **MUST** use a web server (Vite, http-server, etc.) - **DO NOT** open files directly!
- The reactive system works in any modern browser
- No build step needed - TypeScript is compiled by Vite automatically

## 🚨 Troubleshooting

If you see a CORS error like:

```
Access to script at 'file:///...' from origin 'null' has been blocked
```

**Solution:** You're opening the file directly. Use a web server instead:

1. Run `npm run dev`
2. Open `http://localhost:9000/reactive-store/src/examples/counter.html` (not `file:///...`)

See `TROUBLESHOOTING.md` for more details.

Happy coding! 🎉
