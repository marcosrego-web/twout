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

### Using npm

```bash
npm install marcosrego-web/twout
```

### Using yarn

```bash
yarn add marcosrego-web/twout
```

### Using external `<script>` from Github in HTML `<head>` (not recommended)

```html
<script src="https://raw.githubusercontent.com/marcosrego-web/twout/refs/heads/master/index.js"></script>
```
⚠️ This method is **not recommended for production**, since Twout should ideally be used in a system that caches the output.

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
import Twout from "./twout/index.js";

const css = Twout(["text-center", "mt-4"]);
console.log(css);
```

---

### In HTML after adding the script to `<head>` (not recommended)

```html
<script>
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
Twout(classes: string[], options?: { onWarning?: (warning) => void }): string
```

* `classes` → Array of Tailwind-style class names
* `options.onWarning` → Optional. Receives each warning instead of it being printed (see below)
* Returns → CSS string

---

## ⚠️ Warnings

Twout reports two things while compiling:

| `type`                | When                                                                                                        | CSS                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------- |
| `unsupported-variant` | A class uses a variant twout can't compile (e.g. `aria-checked:`). `warning.variant` names it.              | None for that class    |
| `focus-inside-has`    | A class's selector puts `:focus`, `:focus-within` or `:focus-visible` inside `:has()`, e.g. `has-[a:focus]:` | Generated as usual     |

An unsupported variant used to be written out as an invalid selector, which browsers drop. If a minifier
later merges that rule with others that have the same declarations, the browser drops the whole merged
rule. Twout now skips such classes instead.

`:focus` inside `:has()` is valid, but in Chrome it can make every focus change restyle large parts of the
page, which hurts interaction speed (INP). When the elements the `:has()` looks for are the only focusable
content, `focus-within:` matches the same focus states without it: write `has-[a:hover]:x focus-within:x`
instead of `has-[a:hover,a:focus]:x`.

By default each distinct warning is printed once per process with `console.warn`. To collect warnings
instead (for a build report or a test):

```js
const warnings = [];
const css = Twout(classes, { onWarning: w => warnings.push(w) });
// w = { type, className, message, variant?, selector? }
```

Classes with no matching utility (e.g. your own `card` or `js-toggle`) emit nothing and are not reported.

---

## 📐 Media queries and output order

| Variant                                    | Wraps the rule in                                     |
| ------------------------------------------ | ----------------------------------------------------- |
| `sm:` … `2xl:`, also `min-sm:` … `min-2xl:` | `@media (min-width:640px)` … `(min-width:1536px)`    |
| `max-sm:` … `max-2xl:`                     | `@media not all and (min-width:640px)` …              |
| `min-[960px]:`, `max-[960px]:`             | `@media (min-width:960px)`, `@media not all and (min-width:960px)` |
| Arbitrary: `[@media(max-width:1024px)]:`   | `@media (max-width:1024px)`, as written                |
| `print:`                                   | `@media print`                                        |

`max-*` is the exact complement of the breakpoint, as in Tailwind 4: `max-lg:` applies below 1024px and
`lg:` from 1024px, so they never both apply. Use an arbitrary at-rule to keep a legacy query exactly,
inclusive `max-width` included. It accepts `@media`, `@supports`, `@container`, `@layer`, `@scope` and
`@starting-style`; `_` reads as a space (`[@media_print_and_(min-width:600px)]:`).

At-rules add no specificity, so which rule wins depends on its place in the CSS. Twout places classes
the same way whatever order you list them in: base rules, then `portrait:`, `landscape:`, `dark:`, then
`max-*` from widest to narrowest, `sm:`…`2xl:` and `min-*` from narrowest to widest, container queries,
`print:`, and arbitrary at-rules last. Among those, plain `max-width` queries go widest first and
`min-width` ones narrowest first, so a narrower `max-width` still wins, as in the stylesheet it came
from. Other at-rules keep the order you listed them in. A class is placed by all its at-rule variants:
`hover:lg:flex` sorts with `lg:`, and `md:max-lg:flex` comes after `md:` and before `lg:`.

**Important** — `mt-4!` (Tailwind 4), `!mt-4` and `lg:!mt-4` (Tailwind 3) and twout's own `!lg:mt-4` all
add `!important`. Tailwind 4 generates nothing for `!lg:mt-4`, so prefer `lg:mt-4!` in classes that a
real Tailwind build may also read.

**Arbitrary properties** — `[--offset:12rem]`, `[transition:var(--menu)]`, with any variants. Underscores
read as spaces except in `url()` and `var()` names. A value with a `;` or `{}` outside brackets, or with
unbalanced brackets, generates nothing, as in Tailwind.

**Data attributes** — `data-open:` and `data-[open]:` match `[data-open]`; `data-[state=open]:` matches
`[data-state="open"]`. They combine with `group-`, `peer-`, `in-`, `has-` and `not-`.

---

## ✨ Examples

### Example Output

| Classes                        | CSS Output                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `["text-center"]`              | `.text-center{text-align:center;}`                                                                                  |
| `["mt-4"]`                     | `.mt-4{margin-top:calc(var(--spacing,0.25rem) * 4);}`                                                               |
| `["grid","grid-cols-2"]`       | `.grid{display:grid;}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr));}`                                  |
| `["lg:grid-cols-3"]`           | `@media (min-width:1024px){.lg\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr));}}`                       |
| `["max-lg:hidden"]`            | `@media not all and (min-width:1024px){.max-lg\:hidden{display:none;}}`                                             |
| `["min-[960px]:flex"]`         | `@media (min-width:960px){.min-\[960px\]\:flex{display:flex;}}`                                                     |
| `["[@media(max-width:1024px)]:hidden"]` | `@media (max-width:1024px){.\[\@media\(max-width\:1024px\)\]\:hidden{display:none;}}`                      |
| `["print:hidden"]`             | `@media print{.print\:hidden{display:none;}}`                                                                       |
| `["landscape:grid"]`           | `@media (orientation:landscape){.landscape\:grid{display:grid;}}`                                                   |
| `["portrait:flex-col"]`        | `@media (orientation:portrait){.portrait\:flex-col{flex-direction:column;}}`                                       |
| `["@container"]`               | `.\@container{container-type:inline-size;}`                                                                         |
| `["@md:flex-row"]`             | `@container (width>=28rem){.\@md\:flex-row{flex-direction:row;}}`                                                   |
| `["@max-md:flex-col"]`         | `@container (width<28rem){.\@max-md\:flex-col{flex-direction:column;}}`                                             |
| `["@sm/main:flex-col"]`        | `@container main (width>=24rem){.\@sm\/main\:flex-col{flex-direction:column;}}`                                     |
| `["hover:bg-blue-500"]`        | `.hover\:bg-blue-500:hover{background-color:#3b82f6;}`                                                              |
| `["bg-[red]"]`                 | `.bg-\[red\]{background-color:red;}`                                                                                |
| `["bg-(primary)"]`             | `.bg-\(primary\){background-color:var(--primary);}`                                                                 |
| `["[--offset:12.188rem]"]`     | `.\[--offset\:12\.188rem\]{--offset:12.188rem;}`                                                                    |
| `["lg:[transition:var(--menu)]"]` | `@media (min-width:1024px){.lg\:\[transition\:var\(--menu\)\]{transition:var(--menu);}}`                         |
| `["mt-4!"]`                    | `.mt-4\!{margin-top:calc(var(--spacing,0.25rem) * 4) !important;}`                                                  |
| `["has-[img]:grid"]`           | `.has-\[img\]\:grid:has(img){display:grid;}`                                                                        |
| `["lg:has-[img]:grid-cols-2"]` | `@media (min-width:1024px){.lg\:has-\[img\]\:grid-cols-2:has(img){grid-template-columns:repeat(2,minmax(0,1fr));}}` |
| `["has-checked:underline"]`    | `.has-checked\:underline:has(:checked){text-decoration-line:underline;}`                                            |
| `["group-has-checked:flex"]`   | `.group-has-checked\:flex:is(:where(.group):has(:checked) *){display:flex;}`                                        |
| `["in-focus:underline"]`       | `:where(:focus) .in-focus\:underline{text-decoration-line:underline;}`                                              |
| `["peer-invalid:visible"]`     | `.peer-invalid\:visible:is(:where(.peer):invalid ~ *){visibility:visible;}`                                         |
| `["data-[open]:block"]`        | `.data-\[open\]\:block[data-open]{display:block;}`                                                                  |
| `["group-data-[open]:block"]`  | `.group-data-\[open\]\:block:is(:where(.group)[data-open] *){display:block;}`                                       |

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
