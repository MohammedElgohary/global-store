/**
 * Reactive DOM Binding - Automatically update DOM when reactive values change
 */

import { effect } from "./effect";
import type { Reactive, Computed } from "../types";

type BindingSource<T> = Reactive<T> | Computed<T> | (() => T);

/**
 * Get value from a binding source
 */
function getValue<T>(source: BindingSource<T>): T {
  if (typeof source === "function") {
    return source();
  }
  return source.value;
}

/**
 * Bind text content to a reactive value
 */
export function bindText<T>(
  selector: string | Element,
  source: BindingSource<T>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const value = getValue(source);
    element.textContent = String(value ?? "");
  });
}

/**
 * Bind HTML content to a reactive value
 */
export function bindHTML<T>(
  selector: string | Element,
  source: BindingSource<T>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const value = getValue(source);
    element.innerHTML = String(value ?? "");
  });
}

/**
 * Bind an attribute to a reactive value
 */
export function bindAttr<T>(
  selector: string | Element,
  attribute: string,
  source: BindingSource<T>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const value = getValue(source);
    if (value == null || value === false) {
      element.removeAttribute(attribute);
    } else {
      element.setAttribute(attribute, String(value));
    }
  });
}

/**
 * Bind a property to a reactive value
 */
export function bindProp<T>(
  selector: string | Element,
  property: string,
  source: BindingSource<T>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const value = getValue(source);
    (element as any)[property] = value;
  });
}

/**
 * Bind CSS class based on reactive value
 */
export function bindClass(
  selector: string | Element,
  className: string,
  condition: BindingSource<boolean>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const shouldHaveClass = getValue(condition);
    if (shouldHaveClass) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  });
}

/**
 * Bind style property to a reactive value
 */
export function bindStyle<T>(
  selector: string | Element,
  property: string,
  source: BindingSource<T>
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    const value = getValue(source);
    (element as HTMLElement).style.setProperty(
      property,
      String(value ?? "")
    );
  });
}

/**
 * Render template function into an element
 */
export function render(
  selector: string | Element,
  template: () => string
): () => void {
  const element =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return () => {};
  }

  return effect(() => {
    element.innerHTML = template();
  });
}

/**
 * Bind multiple properties at once
 */
export function bindMultiple(
  bindings: Array<{
    selector: string | Element;
    type: "text" | "html" | "attr" | "prop" | "class" | "style";
    target: string; // attribute name, property name, class name, or style property
    source: BindingSource<any>;
  }>
): () => void {
  const unbindFunctions = bindings.map((binding) => {
    switch (binding.type) {
      case "text":
        return bindText(binding.selector, binding.source);
      case "html":
        return bindHTML(binding.selector, binding.source);
      case "attr":
        return bindAttr(binding.selector, binding.target, binding.source);
      case "prop":
        return bindProp(binding.selector, binding.target, binding.source);
      case "class":
        return bindClass(
          binding.selector,
          binding.target,
          binding.source as BindingSource<boolean>
        );
      case "style":
        return bindStyle(binding.selector, binding.target, binding.source);
      default:
        return () => {};
    }
  });

  return () => {
    unbindFunctions.forEach((unbind) => unbind());
  };
}
