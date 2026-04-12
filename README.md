# Twout (Tailwind Classes Output)

## 🚀 What is it?

**Twout** stands for **Tailwind Classes Output**.

It’s a utility function that mimics how Tailwind generates styles and returns the corresponding CSS as a string.

Instead of relying on Tailwind’s build process, Twout lets you dynamically generate styles from class names — anywhere.

---

## 🤔 Why does this exist?

Tailwind is an amazing framework, but it has one limitation:

> ❗ There is no official way to generate Tailwind’s output CSS dynamically outside of its build process.

Twout solves that.

### 💡 Use cases

* Create **page-specific CSS instead of one global file**
* Store Tailwind classes in **CMS fields**
* Generate Tailwind styles **from APIs**
* Apply styles dynamically from **database-driven content**
* Use Tailwind logic in **non-standard environments**

---

## ⚠️ Important Note (Production Usage)

Twout is **not intended to replace Tailwind in production builds**.

Instead, it’s designed for:

* 🧪 **Staging environments**
* ⚡ **Static site generators**
* 💾 Systems that can **cache or persist generated CSS**
* 🧩 Dynamic systems where styles are generated once and reused

👉 Recommended workflow:

1. Generate CSS using Twout
2. Cache/store the CSS -or- Generate static files using NextJS SSG (or similar)
3. Serve the cached CSS in production

---

## 📦 Installation

### Install from GitHub

#### Using npm

```bash
npm install marcosrego-web/twout
```

#### Using yarn

```bash
yarn add marcosrego-web/twout
```

---

## 🧩 Import & Usage

### In React / Next.js

```js
import Twout from "twout";

const classes = [
  "grid",
  "lg:grid-cols-2",
  "gap-4",
  "hover:bg-blue-500"
];

const css = Twout(classes);
```

---

### In Vanilla JavaScript

```js
import Twout from "./twout.js";

const css = Twout(["text-center", "mt-4"]);
console.log(css);
```

---

### Using `<script>` in HTML (not recommended)

You can also load it directly:

```html
<script type="module">
  import Twout from "https://raw.githubusercontent.com/marcosrego-web/twout/refs/heads/master/dist/index.js";

  const css = Twout(["grid", "gap-4"]);
  console.log(css);
</script>
```

⚠️ This method is **not recommended for production**, since Twout should ideally be used in a system that caches the output.

---

## 🛠 How to Use

1. Use **Tailwind classes** as you normally would
2. Pass them into the `Twout()` function
3. Receive a **CSS string output**

👉 Learn Tailwind classes here:
[https://tailwindcss.com/docs/styling-with-utility-classes](https://tailwindcss.com/docs/styling-with-utility-classes)

---

### Function Signature

```js
Twout(classes: string[]): string
```

* `classes` → Array of Tailwind-style class names
* Returns → CSS string

---

## ✨ Examples

### Example Output

| Classes                        | CSS Output                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `["text-center"]`              | `.text-center{text-align:center;}`                                                                                  |
| `["mt-4"]`                     | `.mt-4{margin-top:1rem;}`                                                                                           |
| `["grid","grid-cols-2"]`       | `.grid{display:grid;}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));}`                                  |
| `["lg:grid-cols-3"]`           | `@media (min-width:1024px){.lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr));}}`                       |
| `["hover:bg-blue-500"]`        | `.hover\:bg-blue-500:hover{background-color:#3b82f6;}`                                                              |
| `["bg-[red]"]`                 | `.bg-\[red\]{background-color:red;}`                                                                                |
| `["bg-(primary)"]`             | `.bg-\(primary\){background-color:var(--primary);}`                                                                 |
| `["has-[img]:grid"]`           | `.has-\[img\]\:grid:has(img){display:grid;}`                                                                        |
| `["lg:has-[img]:grid-cols-2"]` | `@media (min-width:1024px){.lg\:has-\[img\]\:grid-cols-2:has(img){grid-template-columns:repeat(2,minmax(0,1fr));}}` |

---

## 💡 Example in Practice

```js
const css = Twout([
  "grid",
  "gap-6",
  "lg:grid-cols-3",
  "hover:bg-(primary)",
  "has-[img]:p-4"
]);

console.log(css);
```

---
