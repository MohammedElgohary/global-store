# 🔧 Troubleshooting Guide

## ❌ CORS Error: "Cross origin requests are only supported for protocol schemes"

### The Problem

You're seeing this error:
```
Access to script at 'file:///...' from origin 'null' has been blocked by CORS policy
```

**Why?** You're opening the HTML file directly (double-clicking it), which uses the `file://` protocol. ES modules (`import` statements) don't work with `file://` due to browser security restrictions.

### ✅ Solution 1: Use Vite Dev Server (Recommended)

Since you're using Vite, this is the easiest solution:

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   ```
   http://localhost:9000/reactive-store/src/examples/counter.html
   ```

   Or navigate to:
   - `http://localhost:9000/reactive-store/src/examples/simple-example.html`
   - `http://localhost:9000/reactive-store/src/examples/form-validation.html`
   - etc.
   
   **Note:** Your Vite config uses port 9000, not the default 5173.

### ✅ Solution 2: Use Python HTTP Server

If you don't want to use Vite:

1. **Navigate to project root:**
   ```bash
   cd D:\Work\__PRACTISE\React\global-store
   ```

2. **Start Python server:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or Python 2
   python -m SimpleHTTPServer 8000
   ```

3. **Open in browser:**
   ```
   http://localhost:8000/reactive-store/src/examples/counter.html
   ```

### ✅ Solution 3: Use Node.js http-server

1. **Install http-server globally:**
   ```bash
   npm install -g http-server
   ```

2. **Navigate to project root:**
   ```bash
   cd D:\Work\__PRACTISE\React\global-store
   ```

3. **Start server:**
   ```bash
   http-server -p 8000
   ```

4. **Open in browser:**
   ```
   http://localhost:8000/reactive-store/src/examples/counter.html
   ```

### ✅ Solution 4: Use VS Code Live Server Extension

1. **Install "Live Server" extension in VS Code**

2. **Right-click on the HTML file** → "Open with Live Server"

3. **It will automatically open in browser** with the correct URL

### ✅ Solution 5: Use Browser Extension

Some browsers have extensions that allow `file://` to work, but this is **not recommended** for development.

## 🎯 Quick Reference

| Method | Command | URL Format |
|--------|---------|------------|
| **Vite** (Recommended) | `npm run dev` | `http://localhost:9000/reactive-store/src/examples/counter.html` |
| **Python** | `python -m http.server 8000` | `http://localhost:8000/reactive-store/src/examples/counter.html` |
| **http-server** | `http-server -p 8000` | `http://localhost:8000/reactive-store/src/examples/counter.html` |
| **Live Server** | Right-click → Open with Live Server | Auto-opens |

## 🚨 Common Mistakes

### ❌ Don't Do This:
- Double-clicking the HTML file
- Opening with `file:///` protocol
- Using `file:///D:/Work/.../counter.html` in browser

### ✅ Do This:
- Use a web server (Vite, Python, etc.)
- Use `http://localhost:PORT/...` URLs
- Use VS Code Live Server extension

## 💡 Why This Happens

1. **ES Modules require HTTP/HTTPS** - Browsers enforce this for security
2. **CORS Policy** - `file://` protocol is considered a different origin
3. **Security** - Prevents local files from accessing other local files

## 🔍 Verify It's Working

When it's working correctly, you should see:
- ✅ No CORS errors in console
- ✅ The page loads correctly
- ✅ Reactive features work (buttons update the counter)
- ✅ Console shows no errors

## 📝 Quick Test

1. Start Vite: `npm run dev`
2. Open: `http://localhost:9000/reactive-store/src/examples/counter.html`
3. Click the buttons - they should work!

If you still see errors, check:
- Is the dev server running?
- Are you using the correct URL (http:// not file://)?
- Are there any other errors in the console?
