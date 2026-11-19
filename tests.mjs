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
    expectSkipped("data-[state=open]:underline", "data-[state=open]")
    expectSkipped("max-md:underline", "max-md")
    expectSkipped("print:underline", "print")
    expectSkipped("inert:underline", "inert")
    expectSkipped("hover:foo:underline", "foo")
    expectSkipped("group-foo:underline", "group-foo")
    expectSkipped("not-foo:underline", "not-foo")
    // Object.prototype keys aren't variants either.
    expectSkipped("constructor:underline", "constructor")
    expectSkipped("toString:underline", "toString")
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
