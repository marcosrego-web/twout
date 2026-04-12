// Twout - Tailwind classes output

const spacing = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "8": "2rem",
  "10": "2.5rem",
  "12": "3rem",
  "16": "4rem"
}

const radii = {
  none: "0",
  sm: "0.125rem",
  "": "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px"
}

const letterSpacing = {
  tighter: "var(--tracking-tighter,-0.05em)",
  tight: "var(--tracking-tight,-0.025em)",
  normal: "var(--tracking-normal,0em)",
  wide: "var(--tracking-wide,0.025em)",
  wider: "var(--tracking-wider,0.05em)",
  widest: "var(--tracking-widest,0.1em)"
}

const textSizes = {
  xs: { fs: "0.75rem", lh: "1rem" },
  sm: { fs: "0.875rem", lh: "1.25rem" },
  base: { fs: "1rem", lh: "1.5rem" },
  lg: { fs: "1.125rem", lh: "1.75rem" },
  xl: { fs: "1.25rem", lh: "1.75rem" },
  "2xl": { fs: "1.5rem", lh: "2rem" },
  "3xl": { fs: "1.875rem", lh: "2.375rem" },
  "4xl": { fs: "2.25rem", lh: "2.75rem" },
  "5xl": { fs: "3rem", lh: "3.5rem" },
  "6xl": { fs: "3.75rem", lh: "4.25rem" },
  "7xl": { fs: "4.5rem", lh: "5rem" },
  "8xl": { fs: "6rem", lh: "6.5rem" },
  "9xl": { fs: "8rem", lh: "8.5rem" }
}

const zIndexMap = {
  auto: "auto",
  "0": "0",
  "10": "10",
  "20": "20",
  "30": "30",
  "40": "40",
  "50": "50"
}

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
}

const namedColors = {
  "red-500": "#ef4444",
  "blue-500": "#3b82f6",
  "green-500": "#22c55e",
  black: "#000000",
  white: "#ffffff"
}

const weights = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900"
}

// ---- helpers ----
const escapeClass = cls =>
  "." + cls.replace(/([!\"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, "\\$1")

const fracToPercent = num => {
  const [a, b] = num.split("/")
  const n = Number(a),
    d = Number(b)
  if (!isFinite(n) || !isFinite(d) || d === 0) return null
  return ((n * 100) / d).toFixed(6).replace(/\.?0+$/, "") + "%"
}

const opacityToDec = n => {
  const v = Number(n)
  if (!isFinite(v)) return null
  return Math.max(0, Math.min(100, v)) / 100 + ""
}

const getArbitrary = (cls, bracket) => {
  const re = bracket === "[" ? /\[(.*?)\]/ : /\((.*?)\)/
  const m = cls.match(re)
  return m?.[1] ?? null
}

const toVarRef = token =>
  `var(${token.startsWith("--") ? token : `--${token}`})`

const colorValue = token => {
  if (namedColors[token]) return namedColors[token]
  if (/^#([0-9a-f]{3,8})$/i.test(token)) return token
  if (/^(rgb|hsl)a?\(/i.test(token)) return token
  if (token.startsWith("var(") || token.startsWith("--"))
    return token.startsWith("--") ? `var(${token})` : token
  return token
}

const pseudoMap = {
  before: "::before",
  after: "::after",
  hover: ":hover",
  focus: ":focus",
  "focus-within": ":focus-within",
  "focus-visible": ":focus-visible",
  active: ":active",
  visited: ":visited",
  target: ":target",
  only: ":only-child",
  first: ":first-child",
  last: ":last-child",
  odd: ":nth-child(odd)",
  even: ":nth-child(even)",
  "first-of-type": ":first-of-type",
  "last-of-type": ":last-of-type",
  "only-of-type": ":only-of-type",
  empty: ":empty",
  disabled: ":disabled",
  enabled: ":enabled",
  checked: ":checked",
  "*": " > *",
  "**": " *",
  //Temporary way of doing :not()
  "not-focus": ":not(:focus)",
  "not-focus-within": ":not(:focus-within)",
  "not-focus-visible": ":not(:focus-visible)",
  "not-active": ":not(:active)",
  "not-visited": ":not(:visited)",
  "not-target": ":not(:target)",
  "not-only": ":not(:only-child)",
  "not-first": ":not(:first-child)",
  "not-last": ":not(:last-child)",
  "not-odd": ":not(:nth-child(odd))",
  "not-even": ":not(:nth-child(even))",
  "not-first-of-type": ":not(:first-of-type)",
  "not-last-of-type": ":not(:last-of-type)",
  "not-only-of-type": ":not(:only-of-type)",
  "not-empty": ":not(:empty)",
  "not-disabled": ":not(:disabled)",
  "not-enabled": ":not(:enabled)",
  "not-checked": ":not(:checked)"
} //Some are missing //Check: https://tailwindcss.com/docs/hover-focus-and-other-states#pseudo-class-reference

function hasNumValue(token = "") {
  if (!token) return false
  const val = token.trim()

  // Pure number
  if (/^-?\d+(\.\d+)?$/.test(val)) return true

  // Number with unit
  if (
    /^-?\d+(\.\d+)?(px|em|rem|%|cm|mm|in|pt|pc|vw|vh|vmin|vmax|ex|ch)$/.test(
      val
    )
  )
    return true

  // CSS variable that looks like a size
  if (
    /^\(?(--)?(size|spacing|width|height|font|text|border|radius|gap|padding|margin)[\w-]*\)?$/.test(
      val
    )
  )
    return true

  return false
}

const wrapVariants = (selector, rule, variants) => {
  const media = []
  let sel = selector

  variants.forEach(v => {
    if (v in breakpoints) {
      media.push(v)
    } else if (pseudoMap[v]) {
      sel += pseudoMap[v]
    } else if (/^nth-(\d+)$/.test(v)) {
      const n = v.match(/^nth-(\d+)$/)[1]
      sel += `:nth-child(${n})`
    } else if (/^nth-last-(\d+)$/.test(v)) {
      const n = v.match(/^nth-last-(\d+)$/)[1]
      sel += `:nth-last-child(${n})`
    } else if (v.startsWith("has-[")) {
      const inner = v.substring(v.indexOf("[") + 1, v.lastIndexOf("]"))
      sel += `:has(${inner})`
    } else if (v.startsWith("is-[")) {
      const inner = v.substring(v.indexOf("[") + 1, v.lastIndexOf("]"))
      sel += `:is(${inner})`
    } else if (v.startsWith("not-[")) {
      const inner = v.substring(v.indexOf("[") + 1, v.lastIndexOf("]"))
      sel += `:not(${inner})`
    } else if (v.startsWith("[&")) {
      const inner = v.substring(v.indexOf("[") + 1, v.lastIndexOf("]"))
      sel += inner
    } else {
      sel += `:${v}` // fallback (keeps original behavior)
    }
  })

  let css = `${sel}{${rule}}`
  media.reverse().forEach(v => {
    css = `@media (min-width:${breakpoints[v]}){${css}}`
  })
  return css
}

function applyFlag(rule, isNegative, isImportant) {
  let out = rule

  // Handle negative values
  if (isNegative) {
    out = out.replace(/:(.*?);/g, (_, value) => {
      value = value.trim()

      // If already negative, leave it
      if (value.startsWith("-")) return `:${value};`

      // If var() → wrap in calc()
      if (value.startsWith("var(")) return `:calc(${value} * -1);`

      // If numeric/length → prefix minus
      if (/^\d*\.?\d+(px|rem|em|%|vh|vw|deg)?$/.test(value)) {
        return `:-${value};`
      }

      return `:${value};` // fallback
    })
  }

  // Handle !important
  if (isImportant) {
    out = out.replace(/;/g, " !important;")
  }

  return out
}

function smartSplit(input) {
  const result = []
  let current = ""

  let square = 0 // []
  let round = 0 // ()

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (char === "[") square++
    else if (char === "]") square--
    else if (char === "(") round++
    else if (char === ")") round--

    if (char === ":" && square === 0 && round === 0) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }

  if (current) result.push(current)

  return result
}

const handlers = [
  //Following order from the sidebar on this URL: https://tailwindcss.com/docs/

  //LAYOUT

  // z-index
  b => {
    const m = b.match(/^z-(.+)$/)
    if (!m) return ""
    const token = m[1]
    if (token.startsWith("("))
      return `z-index:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `z-index:${getArbitrary(b, "[")};`
    return `z-index:${zIndexMap[token] ?? token};`
  },

  // overflow
  b => {
    const values = ["auto", "hidden", "clip", "visible", "scroll", "unset"]
    let m = b.match(/^overflow-(x|y)-(.+)$/)
    if (m && values.includes(m[2])) {
      return `overflow-${m[1]}:${m[2]};`
    }
    m = b.match(/^overflow-(.+)$/)
    if (m && values.includes(m[1])) {
      return `overflow:${m[1]};`
    }
    return ""
  },

  //overscroll
  b => {
    const values = ["auto", "contain", "none"]
    let m = b.match(/^overscroll-(x|y)-(.+)$/)
    if (m && values.includes(m[2])) {
      return `overscroll-behavior-${m[1]}:${m[2]};`
    }
    m = b.match(/^overscroll-(.+)$/)
    if (m && values.includes(m[1])) {
      return `overscroll-behavior:${m[1]};`
    }
    return ""
  },

  // object-fit
  b =>
    ({
      "object-contain": "-o-object-fit:contain;object-fit:contain;",
      "object-cover": "-o-object-fit: cover;object-fit:cover;",
      "object-fill": "-o-object-fit:fill;object-fit:fill;",
      "object-none": "-o-object-fit:none;object-fit:none;",
      "object-scale-down": "-o-object-fit:scale-down;object-fit:scale-down;",
      "object-top-left": "object-position: top left;",
      "object-top": "object-position: top;",
      "object-top-right": "object-position: top right;",
      "object-left": "object-position: left;",
      "object-center": "object-position: center;",
      "object-right": "object-position: right;",
      "object-bottom-left": "object-position: bottom left;",
      "object-bottom": "object-position: bottom;",
      "object-bottom-right": "object-position: bottom right;"
    }[b] || ""),

  //object-position
  /*
    (b)=>{
      let m=b.match(/^object-(.+)$/);
      if(m) {
        const prop=m[1] === "object-position";
        const token=m[2];
        if (token.startsWith("(")) return `${prop}:${toVarRef(getArbitrary(b,"(")!)};`;
        if (token.startsWith("[")) return `${prop}:${getArbitrary(b,"[")!};`;
        return "";
      }
      return "";
    },
    */

  // display
  b =>
    ({
      block: "display:block;",
      inline: "display:inline;",
      "inline-block": "display:inline-block;",
      flex: "display:flex;",
      "inline-flex": "display:inline-flex;",
      grid: "display:grid;",
      "inline-grid": "display:inline-grid;",
      hidden: "display:none;"
    }[b] || ""),

  // position + float
  b =>
    ({
      static: "position:static;",
      fixed: "position:fixed;",
      absolute: "position:absolute;",
      relative: "position:relative;",
      sticky: "position:sticky;",
      "float-left": "float:left;",
      "float-right": "float:right;",
      "float-none": "float:none;"
    }[b] || ""),

  // position offsets
  b => {
    const m = b.match(/^(top|left|right|bottom)-(.+)$/)
    if (!m) return ""
    const [, side, token] = m
    if (token.startsWith("("))
      return `${side}:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `${side}:${getArbitrary(b, "[")};`
    return `${side}:${spacing[token] ?? token};`
  },

  //FLEXBOX & GRID

  // gap
  b => {
    const m = b.match(/^gap(?:-([xy]))?-(.+)$/)
    if (!m) return ""
    const [, axis, token] = m
    let v
    if (token.startsWith("(")) v = toVarRef(getArbitrary(b, "("))
    else if (token.startsWith("[")) v = getArbitrary(b, "[")
    else v = spacing[token] ?? token
    if (!axis) return `gap:${v};`
    return axis === "x" ? `column-gap:${v};` : `row-gap:${v};`
  },

  // flexbox
  b =>
    ({
      "flex-row": "flex-direction:row;",
      "flex-row-reverse": "flex-direction:row-reverse;",
      "flex-col": "flex-direction:column;",
      "flex-col-reverse": "flex-direction:column-reverse;",
      "flex-wrap": "flex-wrap:wrap;",
      "flex-nowrap": "flex-wrap:nowrap;",
      "flex-wrap-reverse": "flex-wrap:wrap-reverse;",
      "items-start": "align-items:flex-start;",
      "items-end": "align-items:flex-end;",
      "items-center": "align-items:center;",
      "items-baseline": "align-items:baseline;",
      "items-stretch": "align-items:stretch;",
      "justify-start": "justify-content:flex-start;",
      "justify-end": "justify-content:flex-end;",
      "justify-center": "justify-content:center;",
      "justify-between": "justify-content:space-between;",
      "justify-around": "justify-content:space-around;",
      "justify-evenly": "justify-content:space-evenly;",
      "content-normal": "align-content:normal;",
      "content-start": "align-content:flex-start;",
      "content-end": "align-content:flex-end;",
      "content-center": "align-content:center;",
      "content-between": "align-content:space-between;",
      "content-around": "align-content:space-around;",
      "content-evenly": "align-content:space-evenly;",
      "content-baseline": "align-content:baseline;",
      "content-stretch": "align-content:stretch;",
      "self-auto": "align-self:auto;",
      "self-start": "align-self:flex-start;",
      "self-end": "align-self:flex-end;",
      "self-center": "align-self:center;",
      "self-stretch": "align-self:stretch;",
      "self-baseline": "align-self:baseline;",
      grow: "flex-grow:1;",
      "grow-0": "flex-grow:0;",
      shrink: "flex-shrink:1;",
      "shrink-0": "flex-shrink:0;",
      "flex-1": "flex:1 1 0%;",
      "flex-auto": "flex:1 1 auto;",
      "flex-initial": "flex:0 1 auto;",
      "flex-none": "flex:none;"
    }[b] || ""),

  // grid
  b => {
    let m = b.match(/^grid-(cols|rows|flow|flow-row|flow-col)-(.+)$/)
    if (m) {
      const prop =
        m[1] === "cols"
          ? "grid-template-columns"
          : m[1] === "rows"
          ? "grid-template-rows"
          : "grid-auto-flow"
      const token = m[2].replaceAll("-", " ").replaceAll("col", "column")
      if (m[1] != "cols" && m[1] != "rows") return `${prop}:${token};`
      if (token.startsWith("("))
        return `${prop}:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return `${prop}:${getArbitrary(b, "[")};`
      return `${prop}:repeat(${token},minmax(0,1fr));`
    }

    return ""
  },

  // grid line placement + span
  b => {
    // col and row: start end and span
    let m =
      b.match(/^col-(start|end|span)-(.+)$/) ||
      b.match(/^row-(start|end|span)-(.+)$/)
    if (m) {
      const pseudoProp = b.startsWith("col") ? "column" : "row"
      const prop =
        m[1] === "start"
          ? `grid-${pseudoProp}-start`
          : m[1] === "end"
          ? `grid-${pseudoProp}-end`
          : `grid-${pseudoProp}`
      const token = m[2]
      if (token === "auto") return `${prop}: auto;`
      if (m[1] === "span") {
        if (token === "full") return `${prop}: 1 / -1;`
        if (token.startsWith("("))
          return `${prop}: span ${toVarRef(
            getArbitrary(b, "(")
          )} / span ${toVarRef(getArbitrary(b, "("))};`
        if (token.startsWith("["))
          return `${prop}: span ${getArbitrary(b, "[")} / span ${getArbitrary(
            b,
            "["
          )};`
        return `${prop}: span ${token} / span ${token};`
      }
      if (token.startsWith("("))
        return `${prop}:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return `${prop}:${getArbitrary(b, "[")};`
      return `${prop}:${token};`
    }

    //order
    m = b.match(/^order-(.+)$/)
    if (m) {
      const prop = "order"
      const token = m[1]
      if (token == "first") return prop + ":-9999"
      if (token == "last") return prop + ":9999"
      if (token == "none") return prop + ":0"
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      if (token && !isNaN(parseFloat(token))) return prop + `:${token};`
      return ""
    }

    return ""
  },

  // SPACING

  b => {
    const set = (prop, v) => `${prop}:${v};`
    const m = b.match(/^(p|m)([trblxyse]?)-(.+)$/)
    if (!m) return ""
    const [, type, axis, token] = m
    const propBase = type === "p" ? "padding" : "margin"
    let v
    if (token.startsWith("(")) v = toVarRef(getArbitrary(b, "("))
    else if (token.startsWith("[")) v = getArbitrary(b, "[")
    else v = spacing[token] ?? token
    const atomic = side => set(`${propBase}-${side}`, v)
    if (!axis) return set(propBase, v)
    if (axis === "x")
      return `${set(`${propBase}-left`, v)}${set(`${propBase}-right`, v)}`
    if (axis === "y")
      return `${set(`${propBase}-top`, v)}${set(`${propBase}-bottom`, v)}`
    const map = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left",
      s: "inline-start",
      e: "inline-end"
    }
    return atomic(map[axis])
  },

  // SIZING

  b => {
    const apply = (prop, token) => `${prop}:${token};`
    const sizeToken = token => {
      if (token === "auto") return "auto"
      if (token === "full") return "100%"
      if (b.includes("w-") && token === "screen") return "100vw"
      if (token === "screen") return "100vh"
      if (token.startsWith("(")) return toVarRef(getArbitrary(b, "("))
      if (token.startsWith("[")) return getArbitrary(b, "[")
      const frac = fracToPercent(token)
      if (frac) return frac
      if (spacing[token]) return spacing[token]
      return token
    }
    const m = b.match(/^(w|h|min-w|min-h|max-w|max-h)-(.*)$/)
    if (!m) return ""
    const [, prop, token] = m
    const cssProp = prop
      .replace(/^w$/, "width")
      .replace(/^h$/, "height")
      .replace(/^min-w$/, "min-width")
      .replace(/^min-h$/, "min-height")
      .replace(/^max-w$/, "max-width")
      .replace(/^max-h$/, "max-height")
    return apply(cssProp, sizeToken(token))
  },

  // TYPOGRAPHY

  // Text
  b => {
    let m = b.match(/^text-(?!shadow)(.+)$/)
    if (m && !b.includes("color")) {
      const token = m[1]
      if (
        b === "text-left" ||
        b === "text-center" ||
        b === "text-right" ||
        b === "text-justify" ||
        b === "text-start" ||
        b === "text-end"
      ) {
        // Text align
        return "text-align:" + b.replace("text-", "") + ";"
      } else if (hasNumValue(token)) {
        const prop = "font-size"
        const entry = textSizes[token]
        if (entry) {
          const lh = entry.lh ? `line-height:${entry.lh};` : ""
          return prop + `:${entry.fs};${lh}`
        }
        if (token.startsWith("("))
          return prop + `:${toVarRef(getArbitrary(b, "("))};`
        if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
        return ""
      }
    }

    m = b.match(/^leading-(.+)$/)
    if (m) {
      const prop = "line-height"
      const token = m[1]
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      const token2 = b.match(/[^:-]+$/)
      if (token2 && token2[0]) return prop + `:${token2[0]};`
      return ""
    }

    m = b.match(/^font-(.+)$/)
    if (m) {
      const prop = "font-family"
      const token = m[1]

      // Font family keywords
      if (token === "sans") {
        return (
          prop +
          ":ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;"
        )
      }
      if (token === "serif") {
        return prop + ":ui-serif,Georgia,Cambria,Times New Roman,Times,serif;"
      }
      if (token === "mono") {
        return (
          prop +
          ":ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;"
        )
      }

      // Custom property: font-(varName) or font-(family-name:foo)
      if (token.startsWith("(")) {
        const val = getArbitrary(b, "(")
        if (val.startsWith("family-name:")) {
          const name = val.replace(/^family-name:/, "")
          return prop + `:var(--family-name-${name});`
        }
        return prop + `:var(--${val});`
      }

      // Arbitrary value: font-[...]
      if (token.startsWith("[")) {
        return prop + `:${getArbitrary(b, "[")};`
      }

      // Font weight
      if (weights[token]) return `font-weight:${weights[token]};`
    }

    m = b.match(/^tracking-(.+)$/)
    if (m) {
      const prop = "letter-spacing"
      const token = m[1] ?? ""
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      return prop + `:${letterSpacing[token] ?? token};`
    }

    m = b.match(/^align-(.+)$/)
    if (m) {
      const prop = "vertical-align"
      const token = m[1]
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      if (token) return prop + `:${token};` //Needs to be checked: align-text-top, align-text-bottom
      return ""
    }

    // Font style
    if (b === "italic") return "font-style:" + b + ";"
    if (b === "not-italic") return "font-style:normal;"

    // Text transform
    if (b === "normal-case") return "text-transform:none;"
    if (b === "uppercase" || b === "lowercase" || b === "capitalize")
      return "text-transform:" + b + ";"

    // Text decoration line
    if (b === "nounderline") return "text-decoration-line:none;"
    if (b === "underline" || b === "overline" || b === "line-trough")
      return "text-decoration-line:" + b + ";"

    // Text underline offset
    if (b === "underline-offset-auto") return "text-underline-offset:auto;"

    m = b.match(/^underline-(.+)$/)
    if (m) {
      const token = m[1]

      // Custom property: underline-(varName)
      if (token.startsWith("(")) {
        const val = getArbitrary(b, "(")
        return `text-underline-offset:var(--${val});`
      }

      // Arbitrary value: underline-[...]
      if (token.startsWith("[")) {
        return `text-underline-offset:${getArbitrary(b, "[")};`
      }
    }

    // List style type
    m = b.match(/^list-(.+)$/)
    if (m) {
      const token = m[1]

      if (token === "disc" || token === "decimal" || token === "none")
        return `list-style-type:${token};`

      if (token.startsWith("(")) {
        const val = getArbitrary(b, "(")
        return `list-style-type:var(--${val});`
      }

      if (token.startsWith("[")) {
        return `list-style-type:${getArbitrary(b, "[")};`
      }
    }

    return ""
  },

  //Content
  b =>
    ({
      content: "content:'';",
      "content-none": "content:none;"
    }[b] || ""),

  b => {
    const sq = getArbitrary(b, "[")
    const pa = getArbitrary(b, "(")

    if (b.startsWith("content")) {
      if (pa) return `content:${toVarRef(pa)};`
      if (sq) return `content:${colorValue(sq)};`
    }
    return ""
  },

  // COLORS

  b =>
    ({
      "bg-cover": "background-size:cover;",
      "bg-contain": "background-size:contain;",
      "bg-no-repeat": "background-repeat:no-repeat;",
      "bg-repeat": "background-repeat:repeat;",
      "bg-top-left": "background-position:top left;",
      "bg-top": "background-position:top;",
      "bg-top-right": "background-position:top right;",
      "bg-left": "background-position:left;",
      "bg-center": "background-position:center;",
      "bg-right": "background-position:right;",
      "bg-bottom-left": "background-position:bottom left;",
      "bg-bottom": "background-position:bottom;",
      "bg-bottom-right": "background-position:bottom right;",
      "bg-clip-border": "background-clip: border-box;",
      "bg-clip-padding": "background-clip: padding-box;",
      "bg-clip-content": "background-clip: content-box;",
      "bg-clip-text": "-webkit-background-clip: text; background-clip: text;"
    }[b] || ""),

  b => {
    const sq = getArbitrary(b, "[")
    const pa = getArbitrary(b, "(")

    if (b.startsWith("bg-position")) {
      if (pa) return `background-position:${toVarRef(pa)};`
      if (sq) return `background-position:${colorValue(sq)};`
    } else if (b.startsWith("bg-size")) {
      if (pa) return `background-size:${toVarRef(pa)};`
      if (sq) return `background-size:${colorValue(sq)};`
    } else if (b.startsWith("bg-linear")) {
      if (pa)
        return `background-image:linear-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
      if (sq)
        return `background-image:linear-gradient(${getArbitrary(b, "[")});`
    } else if (b.startsWith("bg-radial")) {
      if (pa)
        return `background-image:radial-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
      if (sq)
        return `background-image:radial-gradient(${getArbitrary(b, "[")});`
    } else if (b.startsWith("bg-conic")) {
      if (pa)
        return `background-image:conic-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
      if (sq) return `background-image:conic-gradient(${getArbitrary(b, "[")});`
      // <angle>, "from" and "to" are missing
    } else if (b.startsWith("bg-")) {
      //Images
      if (b === "bg-none") return "background:none;background-image:none;"
      if (pa && b.includes("image:"))
        return `background-image:${toVarRef(pa.replace("image:", ""))};`
      if (sq && b.includes("url("))
        return `background-image:${getArbitrary(b, "[")};`
      //Colors
      if (pa) return `background-color:${toVarRef(pa)};`
      if (sq) return `background-color:${colorValue(sq)};`
      return `background-color:${colorValue(b.slice(3))};`
    }

    //Text color
    if (
      b.startsWith("text-") &&
      !b.includes("left") &&
      !b.includes("center") &&
      !b.includes("right") &&
      !b.includes("justify") &&
      !b.includes("start") &&
      !b.includes("end") &&
      !b.includes("font") &&
      !b.includes("size") &&
      !b.includes("spacing")
    ) {
      if (pa && !hasNumValue(pa)) return `color:${toVarRef(pa)};`
      if (sq && !hasNumValue(sq)) return `color:${colorValue(sq)};`
      if (!hasNumValue(b.slice(5))) return `color:${colorValue(b.slice(5))};`
    }
    return ""
  },

  // BORDERS

  b =>
    ({
      "border-solid": "border-style: solid;",
      "border-dashed": "border-style: dashed;",
      "border-dotted": "border-style: dotted;",
      "border-double": "border-style: double;",
      "border-hidden": "border-style: hidden;",
      "border-none": "border-style: none;"
    }[b] || ""),

  b => {
    if (b === "border") return "border-width:1px;"

    // Border with sides
    let m = b.match(/^border-(t|r|b|l|y|x)(?:-(.+))?$/)
    if (m) {
      const side = m[1]
      const map = {
        x: "left",
        y: "top",
        t: "top",
        r: "right",
        b: "bottom",
        l: "left"
      }
      const val = m[2]

      if (!val) return `border-${map[side]}-width:1px;`

      const prop = `border-${map[side]}-${
        !hasNumValue(val) ? "color" : "width"
      }`
      const prop2 = `border-${map[side]
        .replace("top", "bottom")
        .replace("left", "right")}-${!hasNumValue(val) ? "color" : "width"}`

      if (val.startsWith("("))
        return (
          `${prop}:${toVarRef(getArbitrary(b, "("))};` +
          (side == "x" || side == "y"
            ? `${prop2}:${toVarRef(getArbitrary(b, "("))};`
            : "")
        )

      if (val.startsWith("["))
        return (
          `${prop}:${getArbitrary(b, "[")};` +
          (side == "x" || side == "y"
            ? `${prop2}:${getArbitrary(b, "[")};`
            : "")
        )

      if (/^\d+$/.test(val))
        return (
          `${prop.replace("color", "width")}:${val}px;` +
          (side == "x" || side == "y"
            ? `${prop2.replace("color", "width")}:${val}px;`
            : "")
        )

      return ""
    }

    //Border all sides
    m = b.match(/^border-(.+)$/)
    if (m) {
      const val = m[1]
      const prop = hasNumValue(val) ? "width" : "color"
      if (val.startsWith("("))
        return `border-${prop}:${toVarRef(getArbitrary(b, "("))};`
      if (val.startsWith("[")) return `border-${prop}:${getArbitrary(b, "[")};`
      if (/^\d+$/.test(val)) return `border-width:${val}px;`
    }

    return ""
  },

  b => {
    //Border radius with sides
    let rd = b.match(/^rounded-(t|r|b|l)(?:-(.+))?$/)
    if (rd) {
      const side = rd[1]
      const map = {
        t: "top-left",
        r: "top-right",
        b: "bottom-right",
        l: "bottom-left"
      }
      const val = rd[2]

      if (val.startsWith("("))
        return `border-${map[side]}-radius:${toVarRef(getArbitrary(b, "("))};`

      if (val.startsWith("["))
        return `border-${map[side]}-radius:${getArbitrary(b, "[")};`

      if (/^\d+$/.test(val)) return `border-${map[side]}-radius:${val}px;`

      return ""
    }

    //Border radius all sides
    rd = b.match(/^rounded-(.+)$/)
    if (rd) {
      const val = rd[1]
      if (val.startsWith("("))
        return `border-radius:${toVarRef(getArbitrary(b, "("))};`
      if (val.startsWith("[")) return `border-radius:${getArbitrary(b, "[")};`
      if (/^\d+$/.test(val)) return `border-radius:${val}px;`
    }

    return ""
  },

  //EFFECTS

  // opacity
  b => {
    const m = b.match(/^opacity-(.+)$/)
    if (!m) return ""
    const token = m[1]
    if (token.startsWith("("))
      return `opacity:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `opacity:${getArbitrary(b, "[")};`
    const dec = opacityToDec(token)
    return dec ? `opacity:${dec};` : ""
  },

  // box-shadow
  b => {
    const sh = b.match(/^shadow(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token == "none") return `box-shadow:0 0 #0000;`
    if (token.startsWith("("))
      return `box-shadow:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `box-shadow:${getArbitrary(b, "[")};`
    return token === ""
      ? `box-shadow:0 1px 3px 0 rgb(0 0 0 / 0.1),0 1px 2px -1px rgb(0 0 0 / 0.1);`
      : ""
  },

  //text-shadow
  b => {
    const sh = b.match(/^text-shadow(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token === "none" || token === "inherit" || token === "transparent")
      return `text-shadow:${token};`
    if (token === "current") return `text-shadow:currentColor;`
    if (token.startsWith("("))
      return `text-shadow:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `text-shadow:${getArbitrary(b, "[")};`
    return `text-shadow:0 1px 3px ${colorValue(token)},0 1px 2px ${colorValue(
      token
    )};`
  },

  //TRANSITIONS & ANIMATION

  //property and behaviour
  b => {
    const sh = b.match(/^transition(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token === "normal") return `transition-behavior: normal;`
    if (token === "discrete") return `transition-behavior: discrete;`
    if (token === "colors")
      return `transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke;`
    if (token === "shadow") return `transition-property: box-shadow;`
    if (token === "transform")
      return `transition-property: transform, translate, scale, rotate;`
    if (token.startsWith("("))
      return `transition-property:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("["))
      return `transition-property:${getArbitrary(b, "[")};`
    return `transition-property:${token};`
  },

  //duration
  b => {
    const sh = b.match(/^duration(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token === "initial") return `transition-duration: initial;`
    if (token.startsWith("("))
      return `transition-duration:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("["))
      return `transition-duration:${getArbitrary(b, "[")};`
    return `transition-duration:${token}ms;`
  },

  //transition-timing-function
  b => {
    const sh = b.match(/^ease(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token.startsWith("("))
      return `transition-timing-function:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("["))
      return `transition-timing-function:${getArbitrary(b, "[")};`
    if (token === "initial" || token === "linear")
      return `transition-timing-function:${token};`
    return `transition-timing-function:${b};`
  },

  //transition-delay
  b => {
    const sh = b.match(/^delay(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token.startsWith("("))
      return `transition-delay:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("["))
      return `transition-delay:${getArbitrary(b, "[")};`
    return `transition-delay:${token}ms;`
  },

  // TRANSFORMS

  b => {
    // Backface visibility
    if (b === "backface-visible") return "backface-visibility:visible;"
    if (b === "backface-hidden") return "backface-visibility:hidden;"

    // Perspective
    let m = b.match(/^perspective-(.+)$/)
    if (m) {
      const prop = "perspective"
      const token = m[1]
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      return prop + `:${token};`
    }

    // Perspective origin
    m = b.match(/^perspective-origin-(.+)$/)
    if (m) {
      const map = {
        center: "center",
        top: "top",
        "top-left": "top left",
        "top-right": "top right",
        bottom: "bottom",
        "bottom-left": "bottom left",
        "bottom-right": "bottom right",
        left: "left",
        right: "right"
      }
      return `perspective-origin:${map[m[1]] || m[1]};`
    }

    // Rotate
    m = b.match(/^rotate-(-?.+)$/)
    if (m) {
      const prop = "transform"
      const token = m[1]
      let val
      if (token.startsWith("(")) val = toVarRef(getArbitrary(b, "("))
      else if (token.startsWith("[")) val = getArbitrary(b, "[")
      else val = token + "deg"
      return `-webkit-${prop}:rotate(${val});-ms-${prop}:rotate(${val});${prop}:rotate(${val});`
    }

    // Scale
    m = b.match(/^scale([xy]?)-(.+)$/)
    if (m) {
      const prop = "transform"
      const axis = m[1]
      const token = m[2]
      let val
      if (token.startsWith("(")) val = toVarRef(getArbitrary(b, "("))
      else if (token.startsWith("[")) val = getArbitrary(b, "[")
      else val = parseInt(token, 10) / 100 + "" // Tailwind uses percentages (50 → 0.5)
      if (axis === "x") return prop + `:scaleX(${val});`
      if (axis === "y") return prop + `:scaleY(${val});`
      return prop + `:scale(${val});`
    }

    // Skew
    m = b.match(/^skew-([xy])-(.+)$/)
    if (m) {
      const prop = "transform"
      const axis = m[1]
      const token = m[2]
      let val
      if (token.startsWith("(")) val = toVarRef(getArbitrary(b, "("))
      else if (token.startsWith("[")) val = getArbitrary(b, "[")
      else val = token + "deg"
      return axis === "x"
        ? `-webkit-${prop}:skewX(${val});-ms-${prop}:skewX(${val});${prop}:skewX(${val});`
        : `-webkit-${prop}:skewY(${val});-ms-${prop}:skewY(${val});${prop}:skewY(${val});`
    }

    // Translate
    m = b.match(/^translate-([xy])-(.+)$/)
    if (m) {
      const axis = m[1]
      const token = m[2]
      const prop = "transform"
      let val
      if (token.startsWith("(")) val = toVarRef(getArbitrary(b, "("))
      else if (token.startsWith("[")) val = getArbitrary(b, "[")
      else val = spacing[token] ?? token
      return axis === "x"
        ? `-webkit-${prop}:translateX(${val});-ms-${prop}:translateX(${val});${prop}:translateX(${val});`
        : `-webkit-${prop}:translateY(${val});-ms-${prop}:translateY(${val});${prop}:translateY(${val});`
    }

    // Transform origin
    m = b.match(/^origin-(.+)$/)
    if (m) {
      const map = {
        center: "center",
        top: "top",
        "top-left": "top left",
        "top-right": "top right",
        bottom: "bottom",
        "bottom-left": "bottom left",
        "bottom-right": "bottom right",
        left: "left",
        right: "right"
      }
      return `transform-origin:${map[m[1]] || m[1]};`
    }

    // Transform
    m = b.match(/^transform-(.+)$/)
    if (b === "transform-none") {
      const prop = "transform"
      return (
        "-webkit-" + prop + "none;" + "-ms-" + prop + "none;" + prop + "none;"
      )
    } else if (m) {
      const prop = "transform"
      const token = m[1]
      if (token.startsWith("("))
        return (
          "-webkit-" +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};` +
          "-ms-" +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};` +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};`
        )
      if (token.startsWith("["))
        return (
          "-webkit-" +
          prop +
          `:${getArbitrary(b, "[")};` +
          "-ms-" +
          prop +
          `:${getArbitrary(b, "[")};` +
          prop +
          `:${getArbitrary(b, "[")};`
        )
    } //gpu & cpu missing?

    // Transform style
    if (b === "transform-style-flat") return "transform-style:flat;"
    if (b === "transform-style-preserve-3d")
      return "transform-style:preserve-3d;"

    return ""
  },

  //INTERACTIVITY
  b =>
    ({
      "scroll-auto": "scroll-behavior: auto;",
      "scroll-smooth": "scroll-behavior: smooth;"
    }[b] || ""),

  b => {
    const m = b.match(/^cursor-(.+)$/)
    if (m) {
      const prop = "cursor"
      const token = m[1]
      if (token.startsWith("("))
        return prop + `:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return prop + `:${getArbitrary(b, "[")};`
      return prop + `:${token};`
    }
    return ""
  },

  //FILTERS

  b => {
    const m = b.match(/^filter-(.+)$/)
    if (m) {
      const prop = "filter"
      const token = m[1]
      if (token == "none") return "-webkit-" + prop + "none;" + prop + "none;"
      if (token.startsWith("("))
        return (
          "-webkit-" +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};` +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};`
        )
      if (token.startsWith("["))
        return (
          "-webkit-" +
          prop +
          `:${getArbitrary(b, "[")};` +
          prop +
          `:${getArbitrary(b, "[")};`
        )
    }
    return ""
  },

  b => {
    const m =
      b.match(/^blur(?:-(.+))?$/) ||
      b.match(/^brightness(?:-(.+))?$/) ||
      b.match(/^contrast(?:-(.+))?$/) ||
      b.match(/^drop-shadow(?:-(.+))?$/) ||
      b.match(/^grayscale(?:-(.+))?$/) ||
      b.match(/^hue-rotate(?:-(.+))?$/) ||
      b.match(/^invert(?:-(.+))?$/) ||
      b.match(/^saturate(?:-(.+))?$/) ||
      b.match(/^sepia(?:-(.+))?$/)
    if (m) {
      const prop = "filter"
      const token = m[1] ?? "100"
      const declaration = (m[0] == "drop" || b.startsWith("drop-shadow")
        ? "drop-shadow"
        : m[0] == "hue" || b.startsWith("hue-rotate")
        ? "hue-rotate"
        : m[0]
      )
        .replace(token, "")
        .replace("-", "")
      if (declaration) {
        if (token.startsWith("("))
          return (
            "-webkit-" +
            prop +
            ":" +
            declaration +
            `(${toVarRef(getArbitrary(b, "("))});` +
            prop +
            ":" +
            declaration +
            `(${toVarRef(getArbitrary(b, "("))});`
          )
        if (token.startsWith("["))
          return (
            "-webkit-" +
            prop +
            ":" +
            declaration +
            `(${getArbitrary(b, "[")});` +
            prop +
            ":" +
            declaration +
            `(${getArbitrary(b, "[")});`
          )
        if (
          token &&
          declaration != token &&
          declaration == "hue-rotate" &&
          !isNaN(parseFloat(token))
        )
          return (
            "-webkit-" +
            prop +
            ":" +
            declaration +
            `(${token}deg);` +
            prop +
            ":" +
            declaration +
            `(${token}deg);`
          )
        if (token && declaration != token && !isNaN(parseFloat(token)))
          return (
            "-webkit-" +
            prop +
            ":" +
            declaration +
            `(${token}%);` +
            prop +
            ":" +
            declaration +
            `(${token}%);`
          )
        if (token && declaration != token)
          return (
            "-webkit-" +
            prop +
            ":" +
            declaration +
            `(${token});` +
            prop +
            ":" +
            declaration +
            `(${token});`
          )
      }
      return ""
    }
    return ""
  },

  //TRANSFORMS

  b => {
    const m = b.match(/^transform-(.+)$/)
    if (m) {
      const prop = "transform"
      const token = m[1]
      if (token == "none")
        return (
          "-webkit-" + prop + "none;" + "-ms-" + prop + "none;" + prop + "none;"
        )
      if (token.startsWith("("))
        return (
          "-webkit-" +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};` +
          "-ms-" +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};` +
          prop +
          `:${toVarRef(getArbitrary(b, "("))};`
        )
      if (token.startsWith("["))
        return (
          "-webkit-" +
          prop +
          `:${getArbitrary(b, "[")};` +
          "-ms-" +
          prop +
          `:${getArbitrary(b, "[")};` +
          prop +
          `:${getArbitrary(b, "[")};`
        )
      //Missing transform-gpu and transform-cpu
    }
    return ""
  }
]

// ---- main ----
export default function Twout(classes) {
  let css = ""

  // Normalize classes: dedupe and reorder by breakpoint groups.
  // Groups order: none, sm, md, lg, xl, 2xl
  const bpOrder = ["", "sm:", "md:", "lg:", "xl:", "2xl:"]

  const seen = new Set()
  const groups = {
    "": [],
    "sm:": [],
    "md:": [],
    "lg:": [],
    "xl:": [],
    "2xl:": []
  }

  ;(classes || []).forEach(c => {
    if (!c) return
    const raw = String(c)
    // Identify breakpoint prefix (first part ending with ':') if it's one of our known bps
    const m = raw.match(/^([a-z0-9-]+:)/i)
    const prefix = m && bpOrder.includes(m[1]) ? m[1] : ""
    if (!seen.has(raw)) {
      seen.add(raw)
      groups[prefix].push(raw)
    }
  })

  const normalizedClasses = bpOrder.flatMap(bp => groups[bp] || [])

  normalizedClasses.forEach(raw => {
    let isImportant =
      raw.startsWith("!") || raw.startsWith("!-") || raw.startsWith("-!")
    let isNegative =
      raw.startsWith("-") || raw.startsWith("!-") || raw.startsWith("-!")
    const baseRaw =
      isImportant && isNegative
        ? raw.slice(2)
        : isImportant || isNegative
        ? raw.slice(1)
        : raw

    const parts = smartSplit(baseRaw) //Previous version: const parts = baseRaw.split(":");
    const base = parts.pop()
    const variants = parts

    const selector = escapeClass(raw) // keep '-' in class name

    let rule = ""
    for (const h of handlers) {
      rule = h(base)
      if (rule) break
    }

    if (rule) {
      rule = applyFlag(rule, isNegative, isImportant)
      css += wrapVariants(selector, rule, variants)
    }
  })
  return css
}