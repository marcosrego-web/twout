// Run with: npm test (node --test tests.mjs). Expected selectors were checked against
// Tailwind v4.3's output; where twout deliberately differs (it writes group
// variants as ".x:is(<group> *)" and doesn't wrap hover in @media (hover:hover))
// it keeps the form it has always emitted.
import { test, describe } from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import Twout from "./index.js"

const compile = classes => {
  const warnings = []
  const css = Twout([].concat(classes), { onWarning: w => warnings.push(w) })
  return { css, warnings }
}

// Asserts the CSS of one class compiling `underline` and that no warning fired.
const expectUnderline = (cls, selector) => {
  const { css, warnings } = compile(cls)
  assert.equal(css, `${selector}{text-decoration-line:underline;}`)
  assert.deepEqual(warnings, [])
}

const expectSkipped = (cls, variant) => {
  const { css, warnings } = compile(cls)
  assert.equal(css, "", `${cls} should emit nothing`)
  assert.equal(warnings.length, 1)
  assert.equal(warnings[0].type, "unsupported-variant")
  assert.equal(warnings[0].className, cls)
  assert.equal(warnings[0].variant, variant)
}

describe("group-/peer- arbitrary selector lists", () => {
  test("a selector list is wrapped in :is() before the combinator", () => {
    expectUnderline(
      "group-[:hover,:focus-within]:underline",
      String.raw`.group-\[\:hover\,\:focus-within\]\:underline:is(:where(.group):is(:hover,:focus-within) *)`
    )
    expectUnderline(
      "peer-[:hover,:focus]:underline",
      String.raw`.peer-\[\:hover\,\:focus\]\:underline:is(:where(.peer):is(:hover,:focus) ~ *)`
    )
    expectUnderline(
      "group-[.a,.b]/side:underline",
      String.raw`.group-\[\.a\,\.b\]\/side\:underline:is(:where(.group\/side):is(.a,.b) *)`
    )
  })

  test("a list written with & is wrapped whole", () => {
    expectUnderline(
      "group-[&:hover,&:focus]:underline",
      String.raw`.group-\[\&\:hover\,\&\:focus\]\:underline:is(:is(:where(.group):hover,:where(.group):focus) *)`
    )
    expectUnderline(
      "peer-[&.a,&.b]:underline",
      String.raw`.peer-\[\&\.a\,\&\.b\]\:underline:is(:is(:where(.peer).a,:where(.peer).b) ~ *)`
    )
  })

  test("single selectors and commas inside parentheses are unchanged", () => {
    expectUnderline(
      "group-[:hover]:underline",
      String.raw`.group-\[\:hover\]\:underline:is(:where(.group):hover *)`
    )
    expectUnderline(
      "group-[:is(.a,.b)]:underline",
      String.raw`.group-\[\:is\(\.a\,\.b\)\]\:underline:is(:where(.group):is(.a,.b) *)`
    )
    expectUnderline(
      "group-is-[:hover,:focus-within]:underline",
      String.raw`.group-is-\[\:hover\,\:focus-within\]\:underline:is(:where(.group):is(:hover,:focus-within) *)`
    )
    expectUnderline(
      "group-[.dark_&]:underline",
      String.raw`.group-\[\.dark_\&\]\:underline:is(.dark :where(.group) *)`
    )
  })
})

describe("[&...] selector lists followed by more variants", () => {
  test("on its own the list is unchanged", () => {
    expectUnderline(
      "[&:hover,&:focus]:underline",
      String.raw`.\[\&\:hover\,\&\:focus\]\:underline:hover,.\[\&\:hover\,\&\:focus\]\:underline:focus`
    )
  })

  test("what follows applies to every item, not just the last", () => {
    const c = String.raw`.\[\&\:hover\,\&\:focus\]\:first\:underline`
    expectUnderline(
      "[&:hover,&:focus]:first:underline",
      `:is(${c}:hover,${c}:focus):first-child`
    )
    const s = String.raw`.\[\&\:hover\,\&\:focus\]\:space-x-2`
    assert.match(
      Twout(["[&:hover,&:focus]:space-x-2"]),
      new RegExp(`^${escapeRe(`:is(${s}:hover,${s}:focus) > :not(:last-child){`)}`)
    )
  })
})

describe("has-<state>", () => {
  test("styles an element that has a descendant in that state", () => {
    expectUnderline("has-checked:underline", String.raw`.has-checked\:underline:has(:checked)`)
    expectUnderline("has-hover:underline", String.raw`.has-hover\:underline:has(:hover)`)
    expectUnderline("has-disabled:underline", String.raw`.has-disabled\:underline:has(:disabled)`)
    expectUnderline("has-invalid:underline", String.raw`.has-invalid\:underline:has(:invalid)`)
    expectUnderline("has-first:underline", String.raw`.has-first\:underline:has(:first-child)`)
    expectUnderline("has-nth-3:underline", String.raw`.has-nth-3\:underline:has(:nth-child(3))`)
    expectUnderline("has-not-checked:underline", String.raw`.has-not-checked\:underline:has(:not(:checked))`)
    expectUnderline(
      "has-group-hover:underline",
      String.raw`.has-group-hover\:underline:has(:is(:where(.group):hover *))`
    )
  })

  test("composes with not- and breakpoints", () => {
    expectUnderline("not-has-checked:underline", String.raw`.not-has-checked\:underline:not(:has(:checked))`)
    const { css } = compile("lg:has-checked:underline")
    assert.equal(
      css,
      String.raw`@media (min-width:1024px){.lg\:has-checked\:underline:has(:checked){text-decoration-line:underline;}}`
    )
  })

  test("existing has-[...] output is unchanged", () => {
    expectUnderline("has-[img]:underline", String.raw`.has-\[img\]\:underline:has(img)`)
    expectUnderline("has-[>img]:underline", String.raw`.has-\[\>img\]\:underline:has(>img)`)
    expectUnderline("has-[&_img]:underline", String.raw`.has-\[\&_img\]\:underline:has(* img)`)
    expectUnderline("not-has-[img]:underline", String.raw`.not-has-\[img\]\:underline:not(:has(img))`)
  })

  test("pseudo-elements, child shorthands and nested :has() are refused", () => {
    expectSkipped("has-before:underline", "has-before")
    expectSkipped("has-*:underline", "has-*")
    // CSS forbids :has() inside :has(); browsers would drop the rule.
    expectSkipped("has-has-checked:underline", "has-has-checked")
  })
})

describe("group-has-/peer-has-", () => {
  test("the group or peer has a descendant in that state", () => {
    expectUnderline(
      "group-has-checked:underline",
      String.raw`.group-has-checked\:underline:is(:where(.group):has(:checked) *)`
    )
    expectUnderline(
      "peer-has-checked:underline",
      String.raw`.peer-has-checked\:underline:is(:where(.peer):has(:checked) ~ *)`
    )
    expectUnderline(
      "group-has-checked/side:underline",
      String.raw`.group-has-checked\/side\:underline:is(:where(.group\/side):has(:checked) *)`
    )
    expectUnderline(
      "group-not-has-checked:underline",
      String.raw`.group-not-has-checked\:underline:is(:where(.group):not(:has(:checked)) *)`
    )
  })

  test("existing group-has-[...] output is unchanged", () => {
    expectUnderline(
      "group-has-[img]:underline",
      String.raw`.group-has-\[img\]\:underline:is(:where(.group):has(img) *)`
    )
  })
})

describe("group-/peer- with the form-state variants", () => {
  test("peer-invalid, group-open and friends compose", () => {
    expectUnderline("peer-invalid:underline", String.raw`.peer-invalid\:underline:is(:where(.peer):invalid ~ *)`)
    expectUnderline("peer-required:underline", String.raw`.peer-required\:underline:is(:where(.peer):required ~ *)`)
    expectUnderline("group-nth-3:underline", String.raw`.group-nth-3\:underline:is(:where(.group):nth-child(3) *)`)
    expectUnderline(
      "group-open:underline",
      String.raw`.group-open\:underline:is(:where(.group):is([open],:popover-open,:open) *)`
    )
    expectUnderline("not-required:underline", String.raw`.not-required\:underline:not(:required)`)
  })
})

describe("in-*", () => {
  test("styles an element inside an ancestor in that state", () => {
    expectUnderline("in-focus:underline", String.raw`:where(:focus) .in-focus\:underline`)
    expectUnderline("in-hover:underline", String.raw`:where(:hover) .in-hover\:underline`)
    expectUnderline("in-has-checked:underline", String.raw`:where(:has(:checked)) .in-has-checked\:underline`)
    expectUnderline(
      "in-group-hover:underline",
      String.raw`:where(:is(:where(.group):hover *)) .in-group-hover\:underline`
    )
    expectUnderline("in-open:underline", String.raw`:where(:is([open],:popover-open,:open)) .in-open\:underline`)
  })

  test("in-[...] takes a selector, list or & form", () => {
    expectUnderline("in-[.a,.b]:underline", String.raw`:where(:is(.a,.b)) .in-\[\.a\,\.b\]\:underline`)
    expectUnderline("in-[.a]:underline", String.raw`:where(.a) .in-\[\.a\]\:underline`)
    expectUnderline("in-[&:hover]:underline", String.raw`:where(:hover) .in-\[\&\:hover\]\:underline`)
    expectUnderline("in-[.a_&]:underline", String.raw`:where(.a *) .in-\[\.a_\&\]\:underline`)
  })

  test("stacks in either order", () => {
    expectUnderline("hover:in-focus:underline", String.raw`:where(:focus) .hover\:in-focus\:underline:hover`)
    expectUnderline("in-focus:hover:underline", String.raw`:where(:focus) .in-focus\:hover\:underline:hover`)
    expectUnderline("in-focus:after:underline", String.raw`:where(:focus) .in-focus\:after\:underline::after`)
    const { css } = compile("lg:in-focus:underline")
    assert.equal(
      css,
      String.raw`@media (min-width:1024px){:where(:focus) .lg\:in-focus\:underline{text-decoration-line:underline;}}`
    )
  })

  test("wraps a list or complex selector so the ancestor applies to all of it", () => {
    expectUnderline(
      "in-[.a]:in-[.b]:underline",
      String.raw`:where(.b) :is(:where(.a) .in-\[\.a\]\:in-\[\.b\]\:underline)`
    )
    const c = String.raw`.\[\&\:hover\,\&\:focus\]\:in-focus\:underline`
    expectUnderline("[&:hover,&:focus]:in-focus:underline", `:where(:focus) :is(${c}:hover,${c}:focus)`)
  })

  test("a class whose name starts with a digit isn't mistaken for a complex selector", () => {
    // "2xl:" is escaped as "\32 xl\:" - that space ends the escape.
    const { css } = compile("in-focus:2xl:underline")
    assert.equal(
      css,
      String.raw`@media (min-width:1536px){:where(:focus) .in-focus\:2xl\:underline{text-decoration-line:underline;}}`
    )
  })

  test("in-range is still the :in-range pseudo-class", () => {
    expectUnderline("in-range:underline", String.raw`.in-range\:underline:in-range`)
  })

  test("forms with nothing to be inside of are refused", () => {
    expectSkipped("in-[>.a]:underline", "in-[>.a]")
    expectSkipped("in-[@media_print]:underline", "in-[@media_print]")
    expectSkipped("in-before:underline", "in-before")
    expectSkipped("in-*:underline", "in-*")
    expectSkipped("in-focus/name:underline", "in-focus/name")
  })
})

describe("is-[...] (twout's own variant, not in Tailwind)", () => {
  // Exact 1.2.11 output; none of these should ever change.
  const cases = {
    "is-[.active]:flex": String.raw`.is-\[\.active\]\:flex:is(.active){display:flex;}`,
    "is-[&.active]:flex": String.raw`.is-\[\&\.active\]\:flex:is(.active){display:flex;}`,
    "is-[:hover,:focus]:underline": String.raw`.is-\[\:hover\,\:focus\]\:underline:is(:hover,:focus){text-decoration-line:underline;}`,
    "is-[&.a,&.b]:flex": String.raw`.is-\[\&\.a\,\&\.b\]\:flex:is(.a,.b){display:flex;}`,
    "is-[.dark_&]:bg-black": String.raw`.is-\[\.dark_\&\]\:bg-black:is(.dark *){background-color:#000000;}`,
    "is-[[open]]:block": String.raw`.is-\[\[open\]\]\:block:is([open]){display:block;}`,
    "is-[:nth-child(2)]:mt-4": String.raw`.is-\[\:nth-child\(2\)\]\:mt-4:is(:nth-child(2)){margin-top:calc(var(--spacing,0.25rem) * 4);}`,
    "lg:is-[.active]:grid": String.raw`@media (min-width:1024px){.lg\:is-\[\.active\]\:grid:is(.active){display:grid;}}`,
    "hover:is-[.active]:underline": String.raw`.hover\:is-\[\.active\]\:underline:hover:is(.active){text-decoration-line:underline;}`,
    "is-[.active]:hover:underline": String.raw`.is-\[\.active\]\:hover\:underline:is(.active):hover{text-decoration-line:underline;}`,
    "is-[.active]:before:content-['x']": String.raw`.is-\[\.active\]\:before\:content-\[\'x\'\]:is(.active)::before{content:'x';}`,
    "not-is-[.active]:flex": String.raw`.not-is-\[\.active\]\:flex:not(:is(.active)){display:flex;}`,
    "group-is-[.active]:flex": String.raw`.group-is-\[\.active\]\:flex:is(:where(.group):is(.active) *){display:flex;}`,
    "peer-is-[:checked]:block": String.raw`.peer-is-\[\:checked\]\:block:is(:where(.peer):is(:checked) ~ *){display:block;}`
  }

  for (const [cls, expected] of Object.entries(cases)) {
    test(cls, () => {
      assert.deepEqual(compile(cls), { css: expected, warnings: [] })
    })
  }

  test("is-<word>: without brackets is not a variant", () => {
    // 1.2.11 emitted ".is-active\:flex:is-active", a selector no browser accepts.
    expectSkipped("is-active:flex", "is-active")
    // A bare is-* class isn't a utility, so it stays silent.
    assert.deepEqual(compile("is-active"), { css: "", warnings: [] })
  })
})

describe("unsupported variants", () => {
  test("emit no CSS and report the variant", () => {
    expectSkipped("aria-checked:underline", "aria-checked")
    expectSkipped("motion-safe:underline", "motion-safe")
    expectSkipped("supports-[display:grid]:underline", "supports-[display:grid]")
    expectSkipped("inert:underline", "inert")
    expectSkipped("hover:foo:underline", "foo")
    expectSkipped("group-foo:underline", "group-foo")
    expectSkipped("not-foo:underline", "not-foo")
    // Object.prototype keys aren't variants either.
    expectSkipped("constructor:underline", "constructor")
    expectSkipped("toString:underline", "toString")
    // A stray colon leaves an empty variant, which used to throw.
    expectSkipped(":underline", "")
    expectSkipped("hover::underline", "")
    expectSkipped("::before:underline", "")
  })

  test("the warning names the class and variant", () => {
    const { warnings } = compile("has-foo:underline")
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0].type, "unsupported-variant")
    assert.equal(warnings[0].className, "has-foo:underline")
    assert.equal(warnings[0].variant, "has-foo")
    assert.match(warnings[0].message, /has-foo/)
  })

  test("other classes in the same call still compile", () => {
    const { css, warnings } = compile(["hover:opacity-50", "aria-checked:opacity-50", "focus:opacity-50"])
    assert.equal(
      css,
      String.raw`.hover\:opacity-50:hover{opacity:0.5;}.focus\:opacity-50:focus{opacity:0.5;}`
    )
    assert.equal(warnings.length, 1)
  })

  test("a skipped animate-* class leaves no @keyframes behind", () => {
    assert.equal(compile("aria-busy:animate-spin").css, "")
    assert.match(compile(["aria-busy:animate-spin", "animate-spin"]).css, /@keyframes spin/)
  })

  test("an unknown utility is not reported", () => {
    // CMS class lists carry non-Tailwind classes; only unknown variants warn.
    assert.deepEqual(compile(["js-toggle", "hover:js-toggle", "aria-checked:js-toggle"]), {
      css: "",
      warnings: []
    })
  })

  test("variants that already produced valid CSS keep their exact output", () => {
    for (const v of [
      "required", "invalid", "valid", "optional", "default", "indeterminate",
      "user-valid", "user-invalid", "in-range", "out-of-range", "read-only",
      "autofill", "first-letter", "first-line", "read-write", "link", "any-link",
      "defined", "fullscreen", "modal", "popover-open"
    ]) {
      const cls = `${v}:underline`
      expectUnderline(cls, `.${v}\\:underline:${v}`)
    }
    expectUnderline("nth-child(2n):underline", String.raw`.nth-child\(2n\)\:underline:nth-child(2n)`)
  })

  test("open: uses the form every browser can parse", () => {
    expectUnderline("open:underline", String.raw`.open\:underline:is([open],:popover-open,:open)`)
  })

  test("without onWarning each distinct warning is printed once", () => {
    const printed = []
    const original = console.warn
    console.warn = (...args) => printed.push(args.join(" "))
    try {
      Twout(["aria-once-only:underline"])
      Twout(["aria-once-only:underline"])
      Twout(["aria-once-only:underline", "hover:underline"])
    } finally {
      console.warn = original
    }
    assert.equal(printed.length, 1)
    assert.match(printed[0], /^\[twout\] .*aria-once-only:underline/)
  })
})

describe(":focus inside :has()", () => {
  const focusWarnings = cls => compile(cls).warnings.filter(w => w.type === "focus-inside-has")

  test("warns, and still emits the CSS", () => {
    const { css, warnings } = compile("has-[a:hover,a:focus]:underline")
    assert.equal(
      css,
      String.raw`.has-\[a\:hover\,a\:focus\]\:underline:has(a:hover,a:focus){text-decoration-line:underline;}`
    )
    assert.equal(warnings.length, 1)
    assert.equal(warnings[0].type, "focus-inside-has")
    assert.equal(warnings[0].className, "has-[a:hover,a:focus]:underline")
    assert.equal(warnings[0].selector, String.raw`.has-\[a\:hover\,a\:focus\]\:underline:has(a:hover,a:focus)`)
  })

  test("finds :focus, :focus-within and :focus-visible at any depth", () => {
    for (const cls of [
      "has-focus:underline",
      "has-focus-within:underline",
      "has-focus-visible:underline",
      "has-[a:not(.x):focus]:underline",
      "has-[:is(a,button):focus-visible]:underline",
      "group-has-focus:underline",
      "group-has-[a:focus]:underline",
      "not-has-[a:focus]:underline",
      "[&:has(a:focus)]:underline"
    ])
      assert.equal(focusWarnings(cls).length, 1, cls)
  })

  test("ignores :focus outside :has(), escaped names and quoted values", () => {
    for (const cls of [
      "has-[a:hover]:underline",
      "focus-within:underline",
      "group-focus:underline",
      "in-focus:underline",
      "has-[img]:focus:underline", // :focus is on the element, after :has()
      "has-[img]:focus-visible:underline",
      "has-[.focus]:underline",
      'has-[[title=":focus"]]:underline',
      "[&:has(.x)]:focus:underline"
    ])
      assert.deepEqual(focusWarnings(cls), [], cls)
  })
})

// ---- Compared with Tailwind v4 ----
// Each case pairs a class with the CSS Tailwind 4.3.5 generates for it: the
// utilities layer of @tailwindcss/node's compile('@import "tailwindcss"')
// .build([cls]), minified by lightningcss as the Tailwind CLI and Vite plugin
// ship it. asTwout() rewrites that in the form twout has always written, and
// twout's output must then match it exactly. The rewrites are:
//   - breakpoints in px, not rem (64rem -> 1024px);
//   - every declaration ends with ";", and important is " !important";
//   - hover: isn't wrapped in @media (hover:hover);
//   - group-*/peer-* are ".x:is(<group> *)", Tailwind's ":is(<group> .x)";
//   - spacing reads var(--spacing,0.25rem), and 0.5 keeps its leading zero.
// Selectors, at-rules, properties and values are otherwise Tailwind's.
const tailwindBreakpoints = { "40rem": "640px", "48rem": "768px", "64rem": "1024px", "80rem": "1280px", "96rem": "1536px" }

function asTwout(tailwind, cls) {
  let css = tailwind
  if (smartVariants(cls).includes("hover")) css = unwrapAtRule(css, "@media (hover:hover){")
  return css
    .replace(/\(min-width:(\d+rem)\)/g, (m, rem) => (tailwindBreakpoints[rem] ? `(min-width:${tailwindBreakpoints[rem]})` : m))
    .replace(
      /:is\((:where\(\.(?:group|peer)[^)]*\)[^\s~]*)( |~)((?:\\.|[^\\\s{)])+)\)\{/g,
      (_, group, combinator, x) => `${x}:is(${group}${combinator === "~" ? " ~ " : " "}*){`
    )
    .replace(/!important/g, " !important")
    .replace(/([^;{}])\}/g, "$1;}")
    .replace(/(^|[^\\]):\.(\d)/g, "$1:0.$2")
    .replace(/var\(--spacing\)/g, "var(--spacing,0.25rem)")
}

// The variants of a class, split at the colons outside brackets.
function smartVariants(cls) {
  const parts = cls.split(/:(?![^[]*\])(?![^(]*\))/)
  return parts.slice(0, -1)
}

// Removes an at-rule's prelude and its closing brace, keeping what's inside.
function unwrapAtRule(css, prelude) {
  const start = css.indexOf(prelude)
  if (start === -1) return css
  let depth = 0
  for (let i = start + prelude.length - 1; i < css.length; i++) {
    if (css[i] === "\\") i++
    else if (css[i] === "{") depth++
    else if (css[i] === "}" && --depth === 0)
      return css.slice(0, start) + css.slice(start + prelude.length, i) + css.slice(i + 1)
  }
  return css
}

const sameAsTailwind = cases => {
  for (const [cls, tailwind] of cases)
    test(cls, () => {
      assert.deepEqual(compile(cls), { css: asTwout(tailwind, cls), warnings: [] })
    })
}

// Classes Tailwind 4.3.5 generates nothing for. twout emits nothing too; for
// an invalid variant it also says so, as for any variant it can't compile.
const expectNothing = cls => assert.deepEqual(compile(cls), { css: "", warnings: [] }, cls)

describe("max-* and min-* breakpoints (Tailwind v4)", () => {
  sameAsTailwind([
    ["max-sm:hidden", String.raw`@media not all and (min-width:40rem){.max-sm\:hidden{display:none}}`],
    ["max-md:hidden", String.raw`@media not all and (min-width:48rem){.max-md\:hidden{display:none}}`],
    ["max-lg:hidden", String.raw`@media not all and (min-width:64rem){.max-lg\:hidden{display:none}}`],
    ["max-xl:hidden", String.raw`@media not all and (min-width:80rem){.max-xl\:hidden{display:none}}`],
    ["max-2xl:hidden", String.raw`@media not all and (min-width:96rem){.max-2xl\:hidden{display:none}}`],
    ["lg:block", String.raw`@media (min-width:64rem){.lg\:block{display:block}}`],
    ["min-lg:block", String.raw`@media (min-width:64rem){.min-lg\:block{display:block}}`],
    ["min-[960px]:flex", String.raw`@media (min-width:960px){.min-\[960px\]\:flex{display:flex}}`],
    ["max-[960px]:p-2", String.raw`@media not all and (min-width:960px){.max-\[960px\]\:p-2{padding:calc(var(--spacing) * 2)}}`],
    ["min-[60rem]:flex", String.raw`@media (min-width:60rem){.min-\[60rem\]\:flex{display:flex}}`],
    ["max-lg:[&_.x]:hidden", String.raw`@media not all and (min-width:64rem){.max-lg\:\[\&_\.x\]\:hidden .x{display:none}}`],
    ["max-lg:hover:opacity-50", String.raw`@media not all and (min-width:64rem){@media (hover:hover){.max-lg\:hover\:opacity-50:hover{opacity:.5}}}`],
    ["max-lg:mt-2!", String.raw`@media not all and (min-width:64rem){.max-lg\:mt-2\!{margin-top:calc(var(--spacing) * 2)!important}}`],
    ["md:max-lg:flex", String.raw`@media (min-width:48rem){@media not all and (min-width:64rem){.md\:max-lg\:flex{display:flex}}}`]
  ])

  // A tiny evaluator for the two media queries breakpoints produce.
  const appliesAt = (css, width) => {
    const m = css.match(/^@media (not all and )?\(min-width:(\d+)px\)\{/)
    assert.ok(m, `unexpected query in ${css}`)
    return (width >= Number(m[2])) !== !!m[1]
  }

  test("max-*: is the exact complement of the min-width breakpoint", () => {
    for (const [bp, px] of Object.entries({ sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 })) {
      const min = Twout([`${bp}:block`])
      const max = Twout([`max-${bp}:hidden`])
      for (const width of [px - 1, px - 0.5, px, px + 0.5, px + 1])
        assert.notEqual(appliesAt(min, width), appliesAt(max, width), `${bp} at ${width}px`)
    }
    // The case from the request: at exactly 1024px lg: applies and max-lg: doesn't.
    assert.equal(appliesAt(Twout(["lg:block"]), 1024), true)
    assert.equal(appliesAt(Twout(["max-lg:hidden"]), 1024), false)
    assert.equal(appliesAt(Twout(["max-[960px]:p-2"]), 960), false)
    assert.equal(appliesAt(Twout(["min-[960px]:flex"]), 960), true)
  })

  test("!max-lg:mt-0 is twout's form of Tailwind's max-lg:mt-0!", () => {
    // Tailwind 4 generates nothing for a "!" in front of the variants; twout
    // has always accepted it (!lg:mt-0) and writes the same rule.
    const { css, warnings } = compile("!max-lg:mt-0")
    assert.equal(
      css,
      String.raw`@media not all and (min-width:1024px){.\!max-lg\:mt-0{margin-top:calc(var(--spacing,0.25rem) * 0) !important;}}`
    )
    assert.deepEqual(warnings, [])
    assert.equal(css, Twout(["max-lg:mt-0!"]).replace(String.raw`.max-lg\:mt-0\!`, String.raw`.\!max-lg\:mt-0`))
  })

  test("names that aren't breakpoints are refused", () => {
    expectSkipped("max-foo:hidden", "max-foo")
    expectSkipped("min-foo:hidden", "min-foo")
    expectSkipped("max-lg/x:hidden", "max-lg/x")
    expectSkipped("max-[1px;}*{x:y]:hidden", "max-[1px;}*{x:y]")
  })
})

describe("arbitrary at-rules (Tailwind v4)", () => {
  sameAsTailwind([
    ["[@media(max-width:1024px)]:hidden", String.raw`@media (max-width:1024px){.\[\@media\(max-width\:1024px\)\]\:hidden{display:none}}`],
    ["[@media_print]:hidden", String.raw`@media print{.\[\@media_print\]\:hidden{display:none}}`],
    ["[@supports(display:grid)]:grid", String.raw`@supports (display:grid){.\[\@supports\(display\:grid\)\]\:grid{display:grid}}`],
    ["[@container_card_(min-width:400px)]:flex", String.raw`@container card (min-width:400px){.\[\@container_card_\(min-width\:400px\)\]\:flex{display:flex}}`],
    ["[@media(max-width:1024px)]:max-lg:hidden", String.raw`@media (max-width:1024px){@media not all and (min-width:64rem){.\[\@media\(max-width\:1024px\)\]\:max-lg\:hidden{display:none}}}`],
    ["max-lg:[@media(hover:hover)]:hidden", String.raw`@media not all and (min-width:64rem){@media (hover:hover){.max-lg\:\[\@media\(hover\:hover\)\]\:hidden{display:none}}}`]
  ])

  test("at-rules that can't hold a style rule, and broken ones, are refused", () => {
    expectSkipped("[@font-face]:flex", "[@font-face]")
    expectSkipped("[@media(x){}]:flex", "[@media(x){}]")
    // An unclosed "(" leaves no variant to split off: an unknown class, silent.
    expectNothing("[@media(x]:flex")
  })
})

describe("ordering of at-rule variants", () => {
  // The selector of each rule, unescaped, in output order.
  const order = classes =>
    [...Twout(classes, { onWarning() {} }).matchAll(/(?:^|[{}])(\.(?:\\.|[^{\\])*)\{/g)].map(m =>
      m[1].replace(/\\(.)/g, "$1")
    )

  test("media rules come after base rules whatever the input order", () => {
    const classes = ["max-lg:mt-0", "[@media(max-width:1024px)]:hidden", "print:hidden", "min-[960px]:flex", "mt-4", "block"]
    const forward = order(classes)
    const reversed = order([...classes].reverse())
    // Base rules keep their listed order; the media rules are the same either way.
    assert.deepEqual(forward.slice(0, 2), [".mt-4", ".block"])
    assert.deepEqual(reversed.slice(0, 2), [".block", ".mt-4"])
    assert.deepEqual(forward.slice(2), reversed.slice(2))
    assert.equal(forward.length, 6)
  })

  test("a leading ! or a later variant doesn't hide the breakpoint", () => {
    // 1.3.0 put these with the base rules, so !mt-4 and hover:hidden won.
    assert.deepEqual(order(["!max-lg:mt-0", "!mt-4"]), [".!mt-4", ".!max-lg:mt-0"])
    assert.deepEqual(order(["hover:lg:flex", "hover:hidden"]), [".hover:hidden:hover", ".hover:lg:flex:hover"])
  })

  test("as in Tailwind: max-* widest first, then min-* narrowest first, then print", () => {
    const expected = [
      ".block",
      ".max-xl:block",
      ".max-lg:block",
      ".max-[960px]:block",
      ".max-md:block",
      ".md:block",
      ".md:max-lg:block",
      ".min-[960px]:block",
      ".lg:block",
      ".print:block"
    ]
    for (let i = 0; i < 5; i++) {
      const shuffled = expected.map(s => s.slice(1)).sort(() => Math.random() - 0.5)
      assert.deepEqual(order(shuffled), expected)
    }
  })

  test("arbitrary at-rules come last; simple width queries cascade like breakpoints", () => {
    // Narrower max-width and wider min-width come later and win, as they did
    // in the stylesheet these queries are copied from. Tailwind sorts them
    // by their text instead, which would put 991px after 767px.
    const expected = [
      ".print:block",
      ".[@media(max-width:991px)]:block",
      ".[@media(max-width:767px)]:block",
      ".[@media(min-width:768px)]:block",
      ".[@media(min-width:1200px)]:block",
      ".[@supports(display:grid)]:block"
    ]
    for (let i = 0; i < 5; i++) {
      const shuffled = expected.map(s => s.slice(1)).sort(() => Math.random() - 0.5)
      assert.deepEqual(order(shuffled), expected)
    }
  })
})

describe("arbitrary properties (Tailwind v4)", () => {
  sameAsTailwind([
    ["[--offset-1:12.188rem]", String.raw`.\[--offset-1\:12\.188rem\]{--offset-1:12.188rem}`],
    ["lg:[--font-size-1:3.125rem]", String.raw`@media (min-width:64rem){.lg\:\[--font-size-1\:3\.125rem\]{--font-size-1:3.125rem}}`],
    ["[transition:var(--menu-transition)]", String.raw`.\[transition\:var\(--menu-transition\)\]{transition:var(--menu-transition)}`],
    [
      "[background-image:linear-gradient(var(--bg-linear-angle,90deg),transparent_0%,var(--bg-linear-to,black)_100%)]",
      String.raw`.\[background-image\:linear-gradient\(var\(--bg-linear-angle\,90deg\)\,transparent_0\%\,var\(--bg-linear-to\,black\)_100\%\)\]{background-image:linear-gradient(var(--bg-linear-angle,90deg),transparent 0%,var(--bg-linear-to,black) 100%)}`
    ],
    ["hover:[--x:1]", String.raw`@media (hover:hover){.hover\:\[--x\:1\]:hover{--x:1}}`],
    ["[&_a]:[color:red]", String.raw`.\[\&_a\]\:\[color\:red\] a{color:red}`],
    ["![--x:1]", String.raw`.\!\[--x\:1\]{--x:1!important}`],
    ["[--x:1]!", String.raw`.\[--x\:1\]\!{--x:1!important}`],
    ["[-webkit-line-clamp:3]", String.raw`.\[-webkit-line-clamp\:3\]{-webkit-line-clamp:3}`],
    ["[--my_var:a_b]", String.raw`.\[--my_var\:a_b\]{--my_var:a b}`],
    ["[margin:var(--a_b,1px_2px)]", String.raw`.\[margin\:var\(--a_b\,1px_2px\)\]{margin:var(--a_b,1px 2px)}`],
    [
      "[background-image:url(data:image/svg+xml;base64,AA)]!",
      String.raw`.\[background-image\:url\(data\:image\/svg\+xml\;base64\,AA\)\]\!{background-image:url(data:image/svg+xml;base64,AA)!important}`
    ],
    ["lg:[@media(hover:hover)]:[--x:1]", String.raw`@media (min-width:64rem){@media (hover:hover){.lg\:\[\@media\(hover\:hover\)\]\:\[--x\:1\]{--x:1}}}`]
  ])

  test("invalid properties and values emit nothing, as in Tailwind", () => {
    for (const cls of ["[Color:red]", "[--x:a;b]", "[--x:a}]", "[--x:(a]", "[color:]", "-[--x:1]"]) expectNothing(cls)
  })
})

describe("important as a suffix (Tailwind v4)", () => {
  sameAsTailwind([
    ["pb-2!", String.raw`.pb-2\!{padding-bottom:calc(var(--spacing) * 2)!important}`],
    ["lg:pb-2!", String.raw`@media (min-width:64rem){.lg\:pb-2\!{padding-bottom:calc(var(--spacing) * 2)!important}}`],
    // Tailwind's legacy prefix after the variants.
    ["lg:!pb-2", String.raw`@media (min-width:64rem){.lg\:\!pb-2{padding-bottom:calc(var(--spacing) * 2)!important}}`],
    ["[&_a]:text-(--light)!", String.raw`.\[\&_a\]\:text-\(--light\)\! a{color:var(--light)!important}`],
    ["bg-[var(--brand_color)]", String.raw`.bg-\[var\(--brand_color\)\]{background-color:var(--brand_color)}`]
  ])

  test("the classes from the request", () => {
    // Tailwind writes spacing 0 as "0"; twout keeps its calc() form.
    const zero = "calc(var(--spacing,0.25rem) * 0) !important"
    assert.equal(Twout(["pb-0!"]), String.raw`.pb-0\!{padding-bottom:${zero};}`)
    assert.equal(Twout(["lg:pb-0!"]), String.raw`@media (min-width:1024px){.lg\:pb-0\!{padding-bottom:${zero};}}`)
    // text-(light) is twout's shorthand for text-(--light); Tailwind has no such form.
    assert.equal(Twout(["[&_a]:text-(light)!"]), String.raw`.\[\&_a\]\:text-\(light\)\! a{color:var(--light) !important;}`)
  })

  test("same rule as the ! prefix", () => {
    for (const [suffix, prefix] of [["mt-4!", "!mt-4"], ["-mt-4!", "!-mt-4"], ["bg-red-500/50!", "!bg-red-500/50"]]) {
      const strip = css => css.replace(/^[^{]+/, "")
      assert.equal(strip(Twout([suffix])), strip(Twout([prefix])), suffix)
    }
  })

  test("a negative value can follow the variants, as in Tailwind (lg:-mt-4)", () => {
    // Tailwind writes calc(var(--spacing) * -4); twout keeps its own negation.
    assert.equal(
      Twout(["lg:-mt-4"]),
      String.raw`@media (min-width:1024px){.lg\:-mt-4{margin-top:calc(calc(var(--spacing,0.25rem) * 4) * -1);}}`
    )
  })

  test("! inside a url() or a string is left alone", () => {
    assert.equal(
      Twout(["!bg-[url(data:image/svg+xml;base64,AA)]"]),
      String.raw`.\!bg-\[url\(data\:image\/svg\+xml\;base64\,AA\)\]{background-image:url(data:image/svg+xml;base64,AA) !important;}`
    )
  })
})

describe("data-* variants (Tailwind v4)", () => {
  sameAsTailwind([
    ["data-[open]:block", String.raw`.data-\[open\]\:block[data-open]{display:block}`],
    ["data-open:block", String.raw`.data-open\:block[data-open]{display:block}`],
    ["data-[size=2]:block", String.raw`.data-\[size\=2\]\:block[data-size="2"]{display:block}`],
    ["group-data-[open]:block", String.raw`:is(:where(.group)[data-open] .group-data-\[open\]\:block){display:block}`],
    ["peer-data-[open]:block", String.raw`:is(:where(.peer)[data-open]~.peer-data-\[open\]\:block){display:block}`],
    ["group-data-[open]/menu:block", String.raw`:is(:where(.group\/menu)[data-open] .group-data-\[open\]\/menu\:block){display:block}`],
    ["in-data-[open]:block", String.raw`:where([data-open]) .in-data-\[open\]\:block{display:block}`],
    ["not-data-[open]:block", String.raw`.not-data-\[open\]\:block:not([data-open]){display:block}`],
    ["has-data-[open]:block", String.raw`.has-data-\[open\]\:block:has([data-open]){display:block}`],
    ["data-[open]:hover:block", String.raw`@media (hover:hover){.data-\[open\]\:hover\:block[data-open]:hover{display:block}}`]
  ])

  test("values are quoted as Tailwind writes them before minifying", () => {
    // Tailwind's minifier then drops the quotes where they aren't needed.
    expectUnderline("data-[state=open]:underline", String.raw`.data-\[state\=open\]\:underline[data-state="open"]`)
    expectUnderline("data-[state=open_i]:underline", String.raw`.data-\[state\=open_i\]\:underline[data-state="open" i]`)
    expectUnderline("data-[state~=open]:underline", String.raw`.data-\[state\~\=open\]\:underline[data-state~="open"]`)
    expectUnderline("data-[state='a_b']:underline", String.raw`.data-\[state\=\'a_b\'\]\:underline[data-state='a_b']`)
  })

  test("an invalid attribute name is refused", () => {
    expectSkipped("data-[a_b]:block", "data-[a_b]")
    expectSkipped("data-state/x:block", "data-state/x")
  })
})

describe("print (Tailwind v4)", () => {
  sameAsTailwind([
    ["print:hidden", String.raw`@media print{.print\:hidden{display:none}}`],
    ["lg:print:hidden", String.raw`@media (min-width:64rem){@media print{.lg\:print\:hidden{display:none}}}`]
  ])
})

describe("README examples", () => {
  const readme = fs.readFileSync(new URL("./README.md", import.meta.url), "utf8")
  const rows = [...readme.matchAll(/^\| `(\[.*?\])`\s*\| `(.*?)`\s*\|$/gm)]

  test("the README has examples to check", () => {
    assert.ok(rows.length >= 15)
  })

  for (const [, classes, expected] of rows)
    test(classes, () => {
      assert.equal(Twout(JSON.parse(classes), { onWarning() {} }), expected)
    })
})

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
