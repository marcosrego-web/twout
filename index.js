// Twout - Tailwind classes output

// Tailwind 4 derives every spacing step from a single multiplier instead of a
// fixed scale, so any number works. The inline fallback keeps the output
// self-contained when the page defines no --spacing of its own.
const spacingValue = token =>
  token === "px"
    ? "1px"
    : isNumeric(token)
    ? `calc(var(--spacing,0.25rem) * ${token})`
    : null

const radii = {
  none: "0",
  xs: "0.125rem",
  sm: "0.25rem",
  "": "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  "4xl": "2rem",
  full: "calc(infinity * 1px)"
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
  "3xl": { fs: "1.875rem", lh: "2.25rem" },
  "4xl": { fs: "2.25rem", lh: "2.5rem" },
  "5xl": { fs: "3rem", lh: "1" },
  "6xl": { fs: "3.75rem", lh: "1" },
  "7xl": { fs: "4.5rem", lh: "1" },
  "8xl": { fs: "6rem", lh: "1" },
  "9xl": { fs: "8rem", lh: "1" }
}

const lineHeights = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2"
}

// text-* utilities that are not colours; the colour handler must skip them.
const textNotColor = new Set([
  "text-left",
  "text-center",
  "text-right",
  "text-justify",
  "text-start",
  "text-end",
  "text-ellipsis",
  "text-clip",
  "text-wrap",
  "text-nowrap",
  "text-balance",
  "text-pretty"
])

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
  black: "#000000",
  white: "#ffffff",
  transparent: "transparent",
  current: "currentColor",

  "slate-50": "#f8fafc",
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "slate-600": "#475569",
  "slate-700": "#334155",
  "slate-800": "#1e293b",
  "slate-900": "#0f172a",
  "slate-950": "#020617",

  "gray-50": "#f9fafb",
  "gray-100": "#f3f4f6",
  "gray-200": "#e5e7eb",
  "gray-300": "#d1d5db",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "gray-600": "#4b5563",
  "gray-700": "#374151",
  "gray-800": "#1f2937",
  "gray-900": "#111827",
  "gray-950": "#030712",

  "zinc-50": "#fafafa",
  "zinc-100": "#f4f4f5",
  "zinc-200": "#e4e4e7",
  "zinc-300": "#d4d4d8",
  "zinc-400": "#a1a1aa",
  "zinc-500": "#71717a",
  "zinc-600": "#52525b",
  "zinc-700": "#3f3f46",
  "zinc-800": "#27272a",
  "zinc-900": "#18181b",
  "zinc-950": "#09090b",

  "neutral-50": "#fafafa",
  "neutral-100": "#f5f5f5",
  "neutral-200": "#e5e5e5",
  "neutral-300": "#d4d4d4",
  "neutral-400": "#a3a3a3",
  "neutral-500": "#737373",
  "neutral-600": "#525252",
  "neutral-700": "#404040",
  "neutral-800": "#262626",
  "neutral-900": "#171717",
  "neutral-950": "#0a0a0a",

  "stone-50": "#fafaf9",
  "stone-100": "#f5f5f4",
  "stone-200": "#e7e5e4",
  "stone-300": "#d6d3d1",
  "stone-400": "#a8a29e",
  "stone-500": "#78716c",
  "stone-600": "#57534e",
  "stone-700": "#44403c",
  "stone-800": "#292524",
  "stone-900": "#1c1917",
  "stone-950": "#0c0a09",

  "red-50": "#fef2f2",
  "red-100": "#fee2e2",
  "red-200": "#fecaca",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "red-700": "#b91c1c",
  "red-800": "#991b1b",
  "red-900": "#7f1d1d",
  "red-950": "#450a0a",

  "orange-50": "#fff7ed",
  "orange-100": "#ffedd5",
  "orange-200": "#fed7aa",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "orange-700": "#c2410c",
  "orange-800": "#9a3412",
  "orange-900": "#7c2d12",
  "orange-950": "#431407",

  "amber-50": "#fffbeb",
  "amber-100": "#fef3c7",
  "amber-200": "#fde68a",
  "amber-300": "#fcd34d",
  "amber-400": "#fbbf24",
  "amber-500": "#f59e0b",
  "amber-600": "#d97706",
  "amber-700": "#b45309",
  "amber-800": "#92400e",
  "amber-900": "#78350f",
  "amber-950": "#451a03",

  "yellow-50": "#fefce8",
  "yellow-100": "#fef9c3",
  "yellow-200": "#fef08a",
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "yellow-500": "#eab308",
  "yellow-600": "#ca8a04",
  "yellow-700": "#a16207",
  "yellow-800": "#854d0e",
  "yellow-900": "#713f12",
  "yellow-950": "#422006",

  "lime-50": "#f7fee7",
  "lime-100": "#ecfccb",
  "lime-200": "#d9f99d",
  "lime-300": "#bef264",
  "lime-400": "#a3e635",
  "lime-500": "#84cc16",
  "lime-600": "#65a30d",
  "lime-700": "#4d7c0f",
  "lime-800": "#3f6212",
  "lime-900": "#365314",
  "lime-950": "#1a2e05",

  "green-50": "#f0fdf4",
  "green-100": "#dcfce7",
  "green-200": "#bbf7d0",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "green-700": "#15803d",
  "green-800": "#166534",
  "green-900": "#14532d",
  "green-950": "#052e16",

  "emerald-50": "#ecfdf5",
  "emerald-100": "#d1fae5",
  "emerald-200": "#a7f3d0",
  "emerald-300": "#6ee7b7",
  "emerald-400": "#34d399",
  "emerald-500": "#10b981",
  "emerald-600": "#059669",
  "emerald-700": "#047857",
  "emerald-800": "#065f46",
  "emerald-900": "#064e3b",
  "emerald-950": "#022c22",

  "teal-50": "#f0fdfa",
  "teal-100": "#ccfbf1",
  "teal-200": "#99f6e4",
  "teal-300": "#5eead4",
  "teal-400": "#2dd4bf",
  "teal-500": "#14b8a6",
  "teal-600": "#0d9488",
  "teal-700": "#0f766e",
  "teal-800": "#115e59",
  "teal-900": "#134e4a",
  "teal-950": "#042f2e",

  "cyan-50": "#ecfeff",
  "cyan-100": "#cffafe",
  "cyan-200": "#a5f3fc",
  "cyan-300": "#67e8f9",
  "cyan-400": "#22d3ee",
  "cyan-500": "#06b6d4",
  "cyan-600": "#0891b2",
  "cyan-700": "#0e7490",
  "cyan-800": "#155e75",
  "cyan-900": "#164e63",
  "cyan-950": "#083344",

  "sky-50": "#f0f9ff",
  "sky-100": "#e0f2fe",
  "sky-200": "#bae6fd",
  "sky-300": "#7dd3fc",
  "sky-400": "#38bdf8",
  "sky-500": "#0ea5e9",
  "sky-600": "#0284c7",
  "sky-700": "#0369a1",
  "sky-800": "#075985",
  "sky-900": "#0c4a6e",
  "sky-950": "#082f49",

  "blue-50": "#eff6ff",
  "blue-100": "#dbeafe",
  "blue-200": "#bfdbfe",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",
  "blue-900": "#1e3a8a",
  "blue-950": "#172554",

  "indigo-50": "#eef2ff",
  "indigo-100": "#e0e7ff",
  "indigo-200": "#c7d2fe",
  "indigo-300": "#a5b4fc",
  "indigo-400": "#818cf8",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "indigo-700": "#4338ca",
  "indigo-800": "#3730a3",
  "indigo-900": "#312e81",
  "indigo-950": "#1e1b4b",

  "violet-50": "#f5f3ff",
  "violet-100": "#ede9fe",
  "violet-200": "#ddd6fe",
  "violet-300": "#c4b5fd",
  "violet-400": "#a78bfa",
  "violet-500": "#8b5cf6",
  "violet-600": "#7c3aed",
  "violet-700": "#6d28d9",
  "violet-800": "#5b21b6",
  "violet-900": "#4c1d95",
  "violet-950": "#2e1065",

  "purple-50": "#faf5ff",
  "purple-100": "#f3e8ff",
  "purple-200": "#e9d5ff",
  "purple-300": "#d8b4fe",
  "purple-400": "#c084fc",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "purple-700": "#7e22ce",
  "purple-800": "#6b21a8",
  "purple-900": "#581c87",
  "purple-950": "#3b0764",

  "fuchsia-50": "#fdf4ff",
  "fuchsia-100": "#fae8ff",
  "fuchsia-200": "#f5d0fe",
  "fuchsia-300": "#f0abfc",
  "fuchsia-400": "#e879f9",
  "fuchsia-500": "#d946ef",
  "fuchsia-600": "#c026d3",
  "fuchsia-700": "#a21caf",
  "fuchsia-800": "#86198f",
  "fuchsia-900": "#701a75",
  "fuchsia-950": "#4a044e",

  "pink-50": "#fdf2f8",
  "pink-100": "#fce7f3",
  "pink-200": "#fbcfe8",
  "pink-300": "#f9a8d4",
  "pink-400": "#f472b6",
  "pink-500": "#ec4899",
  "pink-600": "#db2777",
  "pink-700": "#be185d",
  "pink-800": "#9d174d",
  "pink-900": "#831843",
  "pink-950": "#500724",

  "rose-50": "#fff1f2",
  "rose-100": "#ffe4e6",
  "rose-200": "#fecdd3",
  "rose-300": "#fda4af",
  "rose-400": "#fb7185",
  "rose-500": "#f43f5e",
  "rose-600": "#e11d48",
  "rose-700": "#be123c",
  "rose-800": "#9f1239",
  "rose-900": "#881337",
  "rose-950": "#4c0519"
}

const animationValues = {
  spin: "spin 1s linear infinite",
  ping: "ping 1s cubic-bezier(0,0,0.2,1) infinite",
  pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
  bounce: "bounce 1s infinite"
}

const animationKeyframes = {
  spin: "@keyframes spin{to{transform:rotate(360deg);}}",
  ping: "@keyframes ping{75%,100%{transform:scale(2);opacity:0;}}",
  pulse: "@keyframes pulse{50%{opacity:.5;}}",
  bounce:
    "@keyframes bounce{0%,100%{transform:translateY(-25%);animation-timing-function:cubic-bezier(0.8,0,1,1);}50%{transform:none;animation-timing-function:cubic-bezier(0,0,0.2,1);}}"
}

let usedKeyframes = new Set()

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

const blurScale = {
  none: "0",
  xs: "4px",
  sm: "8px",
  "": "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "40px",
  "3xl": "64px"
}

const dropShadows = {
  none: "drop-shadow(0 0 #0000)",
  xs: "drop-shadow(0 1px 1px rgb(0 0 0/0.05))",
  sm:
    "drop-shadow(0 1px 2px rgb(0 0 0/0.1)) drop-shadow(0 1px 1px rgb(0 0 0/0.06))",
  "":
    "drop-shadow(0 1px 2px rgb(0 0 0/0.1)) drop-shadow(0 1px 1px rgb(0 0 0/0.06))",
  md:
    "drop-shadow(0 4px 3px rgb(0 0 0/0.07)) drop-shadow(0 2px 2px rgb(0 0 0/0.06))",
  lg:
    "drop-shadow(0 10px 8px rgb(0 0 0/0.04)) drop-shadow(0 4px 3px rgb(0 0 0/0.1))",
  xl:
    "drop-shadow(0 20px 13px rgb(0 0 0/0.03)) drop-shadow(0 8px 5px rgb(0 0 0/0.08))",
  "2xl": "drop-shadow(0 25px 25px rgb(0 0 0/0.15))"
}

// Several Tailwind utilities share a single CSS property. Each one sets its own
// custom property and then re-declares the whole composed value, so sibling
// classes stack instead of the later rule overwriting the earlier one. Empty
// var() fallbacks keep the unused slots out of the value without needing a
// global defaults rule.
const composeVars = names => names.map(n => `var(${n},)`).join(" ")

// drop-shadow goes last so it applies after the colour filters; backdrop has no
// drop-shadow but does have opacity.
const filterFunctions = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "saturate",
  "sepia",
  "drop-shadow"
]

const backdropFunctions = [
  "blur",
  "brightness",
  "contrast",
  "grayscale",
  "hue-rotate",
  "invert",
  "opacity",
  "saturate",
  "sepia"
]

const filterValue = composeVars(filterFunctions.map(fn => `--tw-${fn}`))

const backdropFilterValue = composeVars(
  backdropFunctions.map(fn => `--tw-backdrop-${fn}`)
)

const touchActionValue = composeVars([
  "--tw-pan-x",
  "--tw-pan-y",
  "--tw-pinch-zoom"
])

// Tailwind 4 keeps translate, scale and 2D rotate on their own CSS properties
// and composes only the 3D rotations and the skews into `transform`. The
// translate/scale fallbacks are identity values; the trailing z slot stays
// empty so the shorthand falls back to its two-value form when unused.
const transformValue = composeVars([
  "--tw-rotate-x",
  "--tw-rotate-y",
  "--tw-rotate-z",
  "--tw-skew-x",
  "--tw-skew-y"
])

const translateValue =
  "var(--tw-translate-x,0) var(--tw-translate-y,0) var(--tw-translate-z,)"

const scaleValue = "var(--tw-scale-x,1) var(--tw-scale-y,1) var(--tw-scale-z,)"

const transitionProperties =
  "color, background-color, border-color, outline-color," +
  " text-decoration-color, fill, stroke, --tw-gradient-from," +
  " --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform," +
  " translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter"

const perspectives = {
  dramatic: "100px",
  near: "300px",
  normal: "500px",
  midrange: "800px",
  distant: "1200px",
  none: "none"
}

const fontVariantNumericValue = composeVars([
  "--tw-ordinal",
  "--tw-slashed-zero",
  "--tw-numeric-figure",
  "--tw-numeric-spacing",
  "--tw-numeric-fraction"
])

const numericSlots = {
  ordinal: ["ordinal", "ordinal"],
  "slashed-zero": ["slashed-zero", "slashed-zero"],
  "lining-nums": ["numeric-figure", "lining-nums"],
  "oldstyle-nums": ["numeric-figure", "oldstyle-nums"],
  "proportional-nums": ["numeric-spacing", "proportional-nums"],
  "tabular-nums": ["numeric-spacing", "tabular-nums"],
  "diagonal-fractions": ["numeric-fraction", "diagonal-fractions"],
  "stacked-fractions": ["numeric-fraction", "stacked-fractions"]
}

// box-shadow layers are comma separated, so an unused slot needs a real
// transparent shadow rather than the empty fallback the others use.
const boxShadowValue = [
  "--tw-inset-shadow",
  "--tw-inset-ring-shadow",
  "--tw-ring-offset-shadow",
  "--tw-ring-shadow",
  "--tw-shadow"
]
  .map(n => `var(${n},0 0 #0000)`)
  .join(",")

// Each layer of the scale carries a colour slot so that "shadow-lg
// shadow-red-500" tints the shadow instead of replacing it.
const shadowColor = alpha => `var(--tw-shadow-color,rgb(0 0 0/${alpha}))`

const shadows = {
  "2xs": `0 1px ${shadowColor("0.05")}`,
  xs: `0 1px 2px 0 ${shadowColor("0.05")}`,
  sm: `0 1px 3px 0 ${shadowColor("0.1")},0 1px 2px -1px ${shadowColor("0.1")}`,
  "": `0 1px 3px 0 ${shadowColor("0.1")},0 1px 2px -1px ${shadowColor("0.1")}`,
  md: `0 4px 6px -1px ${shadowColor("0.1")},0 2px 4px -2px ${shadowColor(
    "0.1"
  )}`,
  lg: `0 10px 15px -3px ${shadowColor("0.1")},0 4px 6px -4px ${shadowColor(
    "0.1"
  )}`,
  xl: `0 20px 25px -5px ${shadowColor("0.1")},0 8px 10px -6px ${shadowColor(
    "0.1"
  )}`,
  "2xl": `0 25px 50px -12px ${shadowColor("0.25")}`,
  none: "0 0 #0000"
}

const insetShadowColor = alpha =>
  `var(--tw-inset-shadow-color,rgb(0 0 0/${alpha}))`

const insetShadows = {
  "2xs": `inset 0 1px ${insetShadowColor("0.05")}`,
  xs: `inset 0 1px 1px ${insetShadowColor("0.05")}`,
  sm: `inset 0 2px 4px ${insetShadowColor("0.05")}`,
  "": `inset 0 2px 4px ${insetShadowColor("0.05")}`,
  none: "0 0 #0000"
}

const ringShadow = width =>
  "var(--tw-ring-inset,) 0 0 0 " +
  `calc(${width} + var(--tw-ring-offset-width,0px)) ` +
  "var(--tw-ring-color,currentColor)"

const touchAction = (slot, value) =>
  `--tw-${slot}:${value};touch-action:${touchActionValue};`

const ringOffsetShadow =
  "var(--tw-ring-inset,) 0 0 0 var(--tw-ring-offset-width,0px)" +
  " var(--tw-ring-offset-color,#fff)"

const insetRingShadow = width =>
  `inset 0 0 0 ${width} var(--tw-inset-ring-color,currentColor)`

// Gradient stops. "via-*" swaps in the three-colour list by setting
// --tw-gradient-via-stops; every other stop utility leaves the two-colour
// fallback in place. --tw-gradient-position is always written by the
// bg-linear/radial/conic utility, so a stop on its own renders nothing.
const gradientStopList = withVia =>
  [
    "var(--tw-gradient-position)",
    "var(--tw-gradient-from,#0000) var(--tw-gradient-from-position,0%)",
    withVia
      ? "var(--tw-gradient-via,#0000) var(--tw-gradient-via-position,50%)"
      : null,
    "var(--tw-gradient-to,#0000) var(--tw-gradient-to-position,100%)"
  ]
    .filter(Boolean)
    .join(",")

const gradientStopsWithVia = gradientStopList(true)

const gradientStops = `var(--tw-gradient-via-stops,${gradientStopList(false)})`

const gradientDirections = {
  t: "to top",
  tr: "to top right",
  r: "to right",
  br: "to bottom right",
  b: "to bottom",
  bl: "to bottom left",
  l: "to left",
  tl: "to top left"
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

// parseFloat("3d") is 3, which is not what a bare numeric token means here.
const isNumeric = token => /^-?(\d+(\.\d+)?|\.\d+)$/.test(token)

const opacityToDec = n => {
  const v = Number(n)
  if (!isFinite(v)) return null
  return Math.max(0, Math.min(100, v)) / 100 + ""
}

function decodeArbitraryValue(value) {
  let out = ""
  let i = 0
  while (i < value.length) {
    if (value.startsWith("url(", i)) {
      const start = i
      let depth = 0
      let j = i
      for (; j < value.length; j++) {
        if (value[j] === "(") depth++
        else if (value[j] === ")") {
          depth--
          if (depth === 0) {
            j++
            break
          }
        }
      }
      out += value.slice(start, j)
      i = j
      continue
    }
    if (value[i] === "\\" && value[i + 1] === "_") {
      out += "_"
      i += 2
      continue
    }
    if (value[i] === "_") {
      out += " "
      i += 1
      continue
    }
    out += value[i]
    i += 1
  }
  return out
}

const getArbitrary = (cls, bracket) => {
  const re = bracket === "[" ? /\[(.*?)\]/ : /\((.*?)\)/
  const m = cls.match(re)
  if (m?.[1] == null) return null
  return bracket === "[" ? decodeArbitraryValue(m[1]) : m[1]
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

const isColorToken = token =>
  !!namedColors[token] ||
  /^#([0-9a-f]{3,8})$/i.test(token) ||
  /^(rgb|hsl|lab|lch|oklab|oklch|color|color-mix)a?\(/i.test(token) ||
  token.startsWith("var(") ||
  token.startsWith("--")

const colorProperties = new Set([
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "border-inline-start-color",
  "border-inline-end-color",
  "outline-color",
  "text-decoration-color",
  "accent-color",
  "caret-color",
  "column-rule-color",
  "fill",
  "stroke",
  "--tw-shadow-color",
  "--tw-inset-shadow-color",
  "--tw-ring-color",
  "--tw-inset-ring-color",
  "--tw-ring-offset-color",
  "--tw-gradient-from",
  "--tw-gradient-via",
  "--tw-gradient-to"
])

function splitOpacityModifier(base) {
  let square = 0
  let round = 0
  let idx = -1
  for (let i = 0; i < base.length; i++) {
    const ch = base[i]
    if (ch === "[") square++
    else if (ch === "]") square--
    else if (ch === "(") round++
    else if (ch === ")") round--
    else if (ch === "/" && square === 0 && round === 0) idx = i
  }
  if (idx <= 0 || idx === base.length - 1) return null
  return { base: base.slice(0, idx), modifier: base.slice(idx + 1) }
}

const alphaToPercent = token => {
  if (token.startsWith("(") && token.endsWith(")"))
    return `calc(${toVarRef(token.slice(1, -1))} * 100%)`
  if (token.startsWith("[") && token.endsWith("]")) {
    const inner = decodeArbitraryValue(token.slice(1, -1))
    if (!inner) return null
    return inner.endsWith("%") ? inner : `calc(${inner} * 100%)`
  }
  if (/^\d+(\.\d+)?$/.test(token)) return `${Number(token)}%`
  return null
}

function applyOpacityModifier(rule, percent) {
  let touched = false
  const out = rule
    .split(";")
    .map(decl => {
      const i = decl.indexOf(":")
      if (i === -1) return decl
      const prop = decl.slice(0, i).trim()
      if (!colorProperties.has(prop.toLowerCase())) return decl
      touched = true
      const value = decl.slice(i + 1).trim()
      // A full-strength mix is just the colour itself.
      if (percent === "100%") return `${prop}:${value}`
      return `${prop}:color-mix(in oklab, ${value} ${percent}, transparent)`
    })
    .join(";")
  return touched ? out : null
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
  "**": " *"
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

function resolveRelativeAmpersand(inner) {
  if (!inner.includes("&")) return inner
  return inner.replace(/&/g, (_, offset, str) => {
    const next = str[offset + 1]
    return next && /[.:#\[a-zA-Z_-]/.test(next) ? "" : "*"
  })
}

function bracketVariantFragment(v) {
  if (v.startsWith("has-[")) {
    const inner = decodeArbitraryValue(v.substring(v.indexOf("[") + 1, v.lastIndexOf("]")))
    return `:has(${resolveRelativeAmpersand(inner)})`
  }
  if (v.startsWith("is-[")) {
    const inner = decodeArbitraryValue(v.substring(v.indexOf("[") + 1, v.lastIndexOf("]")))
    return `:is(${resolveRelativeAmpersand(inner)})`
  }
  if (v.startsWith("not-[")) {
    const inner = decodeArbitraryValue(v.substring(v.indexOf("[") + 1, v.lastIndexOf("]")))
    return `:not(${resolveRelativeAmpersand(inner)})`
  }
  return null
}

// group-* / peer-* variants: styles driven by an ancestor (.group) or a
// preceding sibling (.peer). Supports named groups ("group-hover/sidebar"),
// pseudo-class states, has-[]/is-[]/not-[] and arbitrary "[&...]" selectors.
function relativeVariantSelector(v) {
  const m = v.match(/^(group|peer)-(.+)$/)
  if (!m) return null
  const [, kind, rest] = m

  // A "/name" suffix outside brackets marks a named group/peer.
  let state = rest
  let name = ""
  const slash = rest.lastIndexOf("/")
  if (
    slash > 0 &&
    !rest.slice(slash).includes("]") &&
    !rest.slice(slash).includes(")")
  ) {
    state = rest.slice(0, slash)
    name = rest.slice(slash + 1)
  }

  // :where() keeps the parent class out of the specificity budget, so
  // group-*/peer-* rules stay as specific as their plain counterparts.
  const parent = `:where(.${kind}${name ? `\\/${name}` : ""})`
  const combinator = kind === "group" ? " " : " ~ "
  const wrap = state => `:is(${state}${combinator}*)`

  const fragment = bracketVariantFragment(state)
  if (fragment) return wrap(parent + fragment)

  if (state.startsWith("[") && state.endsWith("]")) {
    const inner = decodeArbitraryValue(state.slice(1, -1))
    if (!inner) return null
    return wrap(inner.includes("&") ? inner.replaceAll("&", parent) : parent + inner)
  }

  if (state.startsWith("not-")) {
    const inner = state.slice(4)
    const negated = bracketVariantFragment(inner) || pseudoMap[inner]
    if (negated && negated.startsWith(":") && !negated.startsWith("::"))
      return wrap(`${parent}:not(${negated})`)
    return null
  }

  const pseudo = pseudoMap[state]
  // Only real pseudo-classes qualify - "::before" and the "*"/"**" child
  // shorthands describe the element itself, not an ancestor/sibling state.
  if (pseudo && pseudo.startsWith(":") && !pseudo.startsWith("::"))
    return wrap(parent + pseudo)

  return null
}

const wrapVariants = (selector, rule, variants, suffix = "") => {
  const media = []
  let sel = selector

  variants.forEach(v => {
    const fragment = bracketVariantFragment(v)
    const notPseudo = pseudoMap[v.slice(4)]
    const notFragment =
      !fragment && v.startsWith("not-")
        ? bracketVariantFragment(v.slice(4)) ||
          (notPseudo && notPseudo.startsWith(":") && !notPseudo.startsWith("::")
            ? notPseudo
            : null)
        : null

    if (v in breakpoints || v === "dark") {
      media.push(v)
    } else if (pseudoMap[v]) {
      sel += pseudoMap[v]
    } else if (/^nth-(\d+)$/.test(v)) {
      const n = v.match(/^nth-(\d+)$/)[1]
      sel += `:nth-child(${n})`
    } else if (/^nth-last-(\d+)$/.test(v)) {
      const n = v.match(/^nth-last-(\d+)$/)[1]
      sel += `:nth-last-child(${n})`
    } else if (fragment) {
      sel += fragment
    } else if (notFragment) {
      sel += `:not(${notFragment})`
    } else if (v.startsWith("[") && v.includes("&")) {
      const inner = decodeArbitraryValue(v.substring(v.indexOf("[") + 1, v.lastIndexOf("]")))
      sel = inner.replaceAll("&", sel)
    } else if (relativeVariantSelector(v)) {
      sel += relativeVariantSelector(v)
    } else {
      sel += `:${v}` // fallback (keeps original behavior)
    }
  })

  let css = `${sel}${suffix}{${rule}}`
  media.reverse().forEach(v => {
    if (v === "dark") {
      css = `@media (prefers-color-scheme:dark){${css}}`
    } else {
      css = `@media (min-width:${breakpoints[v]}){${css}}`
    }
  })
  return css
}

// Splits on a separator that sits outside any bracket.
const splitTopLevel = (value, sep) => {
  const out = []
  let depth = 0
  let cur = ""
  for (const ch of value) {
    if (ch === "(" || ch === "[") depth++
    else if (ch === ")" || ch === "]") depth--
    if (ch === sep && depth === 0) {
      out.push(cur)
      cur = ""
    } else cur += ch
  }
  out.push(cur)
  return out
}

// True when a value has more than one top-level part, e.g. the "10px 20px" of
// an arbitrary shorthand. Such a value is the whole shorthand, not one axis.
const isMultiPart = value => /[\s,]/.test(stripGroups(value).trim())

// Removes bracketed groups so only the top level of a value is left.
const stripGroups = value => {
  let out = value
  let prev
  do {
    prev = out
    out = out.replace(/\([^()]*\)/g, "")
  } while (out !== prev)
  return out
}

function negateValue(value) {
  value = value.trim()

  // If already negative, leave it
  if (value.startsWith("-")) return value

  // Several space-separated parts (e.g. the composed backdrop-filter list)
  // have nothing meaningful to negate.
  if (/\s/.test(stripGroups(value))) return value

  // calc() can hold commas inside var() fallbacks, so multiply the whole
  // expression rather than trying to negate its arguments.
  if (value.startsWith("calc(")) return `calc(${value} * -1)`

  // If var() → wrap in calc()
  if (value.startsWith("var(")) return `calc(${value} * -1)`

  // If numeric/length → prefix minus
  if (/^\d*\.?\d+(px|rem|em|%|vh|vw|deg)?$/.test(value)) {
    return `-${value}`
  }

  // Function call (e.g. rotate(45deg), translateX(1rem)) → negate the args
  const fn = value.match(/^([a-zA-Z][\w-]*)\((.*)\)$/)
  if (fn) {
    const [, name, inner] = fn
    const args = splitTopLevel(inner, ",")
      .map(a => negateValue(a.trim()))
      .join(",")
    return `${name}(${args})`
  }

  return value // fallback
}

// Resolves a length token the way the sizing, inset and spacing utilities do.
function lengthToken(cls, token) {
  if (token.startsWith("(")) return toVarRef(getArbitrary(cls, "("))
  if (token.startsWith("[")) return getArbitrary(cls, "[")
  if (token === "full") return "100%"
  if (token === "auto") return "auto"
  if (token === "min") return "min-content"
  if (token === "max") return "max-content"
  if (token === "fit") return "fit-content"
  return fracToPercent(token) ?? spacingValue(token)
}

// Ring and shadow utilities accept either a width or a colour in the same
// slot, so each token is offered to both readers in turn.
function utilityWidth(cls, token) {
  if (token.startsWith("(")) return null
  const value = token.startsWith("[") ? getArbitrary(cls, "[") : token
  if (/^\d+(\.\d+)?$/.test(value)) return `${value}px`
  return /^\d+(\.\d+)?(px|em|rem)$/.test(value) ? value : null
}

function utilityColor(cls, token) {
  if (token.startsWith("(")) return toVarRef(getArbitrary(cls, "("))
  if (token.startsWith("[")) return colorValue(getArbitrary(cls, "["))
  return isColorToken(token) ? colorValue(token) : null
}

// Builds the CSS function call behind one filter/backdrop-filter utility, e.g.
// ("blur-sm", "blur", "sm") -> "blur(4px)". Returns null for tokens Tailwind
// has no value for, so the caller emits nothing rather than invalid CSS.
function filterFunctionValue(cls, fn, token) {
  if (token.startsWith("(")) return `${fn}(${toVarRef(getArbitrary(cls, "("))})`
  if (token.startsWith("[")) return `${fn}(${getArbitrary(cls, "[")})`

  // blur and drop-shadow read from a named scale; the rest take a percentage
  // (or degrees for hue-rotate).
  if (fn == "blur")
    return Object.hasOwn(blurScale, token) ? `blur(${blurScale[token]})` : null
  if (fn == "drop-shadow")
    return Object.hasOwn(dropShadows, token) ? dropShadows[token] : null

  if (token == "") return `${fn}(${fn == "hue-rotate" ? "0deg" : "100%"})`
  if (!isNumeric(token)) return null
  return `${fn}(${token}${fn == "hue-rotate" ? "deg" : "%"})`
}

function applyFlag(rule, isNegative, isImportant) {
  let out = rule

  // Handle negative values
  if (isNegative) {
    out = out.replace(/:(.*?);/g, (_, value) => `:${negateValue(value)};`)
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

  // visibility
  b =>
    ({
      visible: "visibility:visible;",
      invisible: "visibility:hidden;",
      collapse: "visibility:collapse;"
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
    return `${side}:${spacingValue(token) ?? token};`
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
    else v = spacingValue(token) ?? token
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
      if (/^\d+$/.test(token)) return `${prop}:repeat(${token},minmax(0,1fr));`
      return `${prop}:${token};`
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
    else v = spacingValue(token) ?? token
    const atomic = side => set(`${propBase}-${side}`, v)
    if (!axis) return set(propBase, v)
    if (axis === "x") return set(`${propBase}-inline`, v)
    if (axis === "y") return set(`${propBase}-block`, v)
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
      if (token === "min" || token === "max" || token === "fit") return token+'-content'
      if (token === "screen") return b.includes("w-") ? "100vw" : "100vh"
      if (token === "vw") return "100vw"
      if (token === "dvw") return "100dvw"
      if (token === "dvh") return "100dvh"
      if (token === "lvw") return "100lvw"
      if (token === "lvh") return "100lvh"
      if (token === "svw") return "100svw"
      if (token.startsWith("(")) return toVarRef(getArbitrary(b, "("))
      if (token.startsWith("[")) return getArbitrary(b, "[")
      const frac = fracToPercent(token)
      if (frac) return frac
      const sp = spacingValue(token)
      if (sp) return sp
      return token
    }
    const m = b.match(/^(min-w|min-h|max-w|max-h|inline|block|w|h)-(.*)$/)
    if (!m) return ""
    const [, prop, token] = m
    const cssProp = prop
      .replace(/^w$/, "width")
      .replace(/^h$/, "height")
      .replace(/^min-w$/, "min-width")
      .replace(/^min-h$/, "min-height")
      .replace(/^max-w$/, "max-width")
      .replace(/^max-h$/, "max-height")
      .replace(/^inline$/, "inline-size")
      .replace(/^block$/, "block-size")
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
      } else if (token.startsWith("(") && hasNumValue(getArbitrary(b, "("))) {
        return `font-size:${toVarRef(getArbitrary(b, "("))};`
      } else if (token.startsWith("[") && hasNumValue(getArbitrary(b, "["))) {
        return `font-size:${getArbitrary(b, "[")};`
      } else if (Object.hasOwn(textSizes, token)) {
        const entry = textSizes[token]
        return `font-size:${entry.fs};line-height:${entry.lh};`
      } else if (hasNumValue(token)) {
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
      if (Object.hasOwn(lineHeights, token))
        return prop + `:${lineHeights[token]};`
      const sp = spacingValue(token)
      return sp ? prop + `:${sp};` : ""
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
    if (b === "no-underline") return "text-decoration-line:none;"
    if (b === "underline" || b === "overline" || b === "line-through")
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

  b =>
    ({
      "break-normal": "word-break:normal;",
      "break-all": "word-break:break-all;",
      "break-keep": "word-break:keep-all;",
      "wrap-break-word": "overflow-wrap:break-word;",
      "wrap-anywhere": "overflow-wrap:anywhere;",
      "wrap-normal": "overflow-wrap:normal;",
    }[b] || ""),

  // size / inset / flex-basis / aspect / columns / space-between
  b => {
    let m = b.match(/^size-(.+)$/)
    if (m) {
      const v = lengthToken(b, m[1])
      return v && !isMultiPart(v) ? `width:${v};height:${v};` : ""
    }

    m = b.match(/^inset-([xy])-(.+)$/)
    if (m) {
      const v = lengthToken(b, m[2])
      if (!v) return ""
      return m[1] === "x" ? `inset-inline:${v};` : `inset-block:${v};`
    }

    // inset-ring-* and inset-shadow-* belong to the box-shadow family
    m = b.match(/^inset-(.+)$/)
    if (m && !/^(ring|shadow)/.test(m[1])) {
      const v = lengthToken(b, m[1])
      if (v) return `inset:${v};`
    }

    m = b.match(/^(start|end)-(.+)$/)
    if (m) {
      const v = lengthToken(b, m[2])
      if (v) return `inset-inline-${m[1]}:${v};`
    }

    m = b.match(/^basis-(.+)$/)
    if (m) {
      const v = lengthToken(b, m[1])
      return v ? `flex-basis:${v};` : ""
    }

    m = b.match(/^aspect-(.+)$/)
    if (m) {
      const t = m[1]
      if (t === "square") return "aspect-ratio:1/1;"
      if (t === "video") return "aspect-ratio:16/9;"
      if (t === "auto") return "aspect-ratio:auto;"
      if (t.startsWith("("))
        return `aspect-ratio:${toVarRef(getArbitrary(b, "("))};`
      if (t.startsWith("[")) return `aspect-ratio:${getArbitrary(b, "[")};`
      return /^\d+\/\d+$/.test(t) ? `aspect-ratio:${t};` : ""
    }

    m = b.match(/^columns-(.+)$/)
    if (m) {
      const t = m[1]
      if (t === "auto") return "columns:auto;"
      if (t.startsWith("(")) return `columns:${toVarRef(getArbitrary(b, "("))};`
      if (t.startsWith("[")) return `columns:${getArbitrary(b, "[")};`
      return isNumeric(t) ? `columns:${t};` : ""
    }

    // space-x-* / space-y-* style the children, so they carry a selector
    // suffix instead of applying to the element itself.
    m = b.match(/^space-([xy])-(.+)$/)
    if (m) {
      const axis = m[1]
      const suffix = " > :not(:last-child)"
      if (m[2] === "reverse")
        return { suffix, rule: `--tw-space-${axis}-reverse:1;` }
      const v = lengthToken(b, m[2])
      if (!v || isMultiPart(v)) return ""
      const rev = `var(--tw-space-${axis}-reverse,0)`
      const [from, to] =
        axis === "x"
          ? ["margin-inline-start", "margin-inline-end"]
          : ["margin-block-start", "margin-block-end"]
      return {
        suffix,
        rule:
          `${from}:calc(${v} * ${rev});` +
          `${to}:calc(${v} * calc(1 - ${rev}));`
      }
    }

    return ""
  },

  // outline
  b => {
    if (b === "outline-none") return "outline-style:none;"
    if (b === "outline-hidden")
      return "outline:2px solid transparent;outline-offset:2px;"
    if (b === "outline")
      return "outline-style:var(--tw-outline-style,solid);outline-width:1px;"

    let m = b.match(/^outline-offset-(.+)$/)
    if (m) {
      const t = m[1]
      if (t.startsWith("("))
        return `outline-offset:${toVarRef(getArbitrary(b, "("))};`
      if (t.startsWith("[")) return `outline-offset:${getArbitrary(b, "[")};`
      return isNumeric(t) ? `outline-offset:${t}px;` : ""
    }

    m = b.match(/^outline-(.+)$/)
    if (!m) return ""
    const t = m[1]
    if (["solid", "dashed", "dotted", "double"].includes(t))
      return `--tw-outline-style:${t};outline-style:${t};`
    const width = utilityWidth(b, t)
    if (width)
      return (
        "outline-style:var(--tw-outline-style,solid);" +
        `outline-width:${width};`
      )
    const color = utilityColor(b, t)
    return color ? `outline-color:${color};` : ""
  },

  b =>
    ({
      truncate: "overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
      "text-ellipsis": "text-overflow:ellipsis;",
      "text-clip": "text-overflow:clip;",
      "text-wrap": "text-wrap:wrap;",
      "text-nowrap": "text-wrap:nowrap;",
      "text-balance": "text-wrap:balance;",
      "text-pretty": "text-wrap:pretty;",

      "whitespace-normal": "white-space:normal;",
      "whitespace-nowrap": "white-space:nowrap;",
      "whitespace-pre": "white-space:pre;",
      "whitespace-pre-line": "white-space:pre-line;",
      "whitespace-pre-wrap": "white-space:pre-wrap;",
      "whitespace-break-spaces": "white-space:break-spaces;",

      "break-normal": "overflow-wrap:normal;word-break:normal;",
      "break-words": "overflow-wrap:break-word;",
      "break-all": "word-break:break-all;",
      "break-keep": "word-break:keep-all;",

      "break-inside-auto": "break-inside:auto;",
      "break-inside-avoid": "break-inside:avoid;",
      "break-inside-avoid-page": "break-inside:avoid-page;",
      "break-inside-avoid-column": "break-inside:avoid-column;",

      "list-inside": "list-style-position:inside;",
      "list-outside": "list-style-position:outside;",

      "table-auto": "table-layout:auto;",
      "table-fixed": "table-layout:fixed;",
      "border-collapse": "border-collapse:collapse;",
      "border-separate": "border-collapse:separate;",
      "caption-top": "caption-side:top;",
      "caption-bottom": "caption-side:bottom;",

      "place-items-start": "place-items:start;",
      "place-items-end": "place-items:end;",
      "place-items-center": "place-items:center;",
      "place-items-baseline": "place-items:baseline;",
      "place-items-stretch": "place-items:stretch;",
      "place-content-center": "place-content:center;",
      "place-content-start": "place-content:start;",
      "place-content-end": "place-content:end;",
      "place-content-between": "place-content:space-between;",
      "place-content-around": "place-content:space-around;",
      "place-content-evenly": "place-content:space-evenly;",
      "place-content-stretch": "place-content:stretch;",
      "place-self-auto": "place-self:auto;",
      "place-self-start": "place-self:start;",
      "place-self-end": "place-self:end;",
      "place-self-center": "place-self:center;",
      "place-self-stretch": "place-self:stretch;",

      "auto-cols-auto": "grid-auto-columns:auto;",
      "auto-cols-min": "grid-auto-columns:min-content;",
      "auto-cols-max": "grid-auto-columns:max-content;",
      "auto-cols-fr": "grid-auto-columns:minmax(0,1fr);",
      "auto-rows-auto": "grid-auto-rows:auto;",
      "auto-rows-min": "grid-auto-rows:min-content;",
      "auto-rows-max": "grid-auto-rows:max-content;",
      "auto-rows-fr": "grid-auto-rows:minmax(0,1fr);",

      "flex-initial": "flex:0 1 auto;",
      "fill-none": "fill:none;",
      "fill-current": "fill:currentColor;",
      "stroke-none": "stroke:none;",
      "stroke-current": "stroke:currentColor;"
    }[b] || ""),

  // font-variant-numeric (each utility owns one slot of the composed value)
  b => {
    if (b === "normal-nums") return "font-variant-numeric:normal;"
    if (!Object.hasOwn(numericSlots, b)) return ""
    const [slot, value] = numericSlots[b]
    return (
      `--tw-${slot}:${value};` +
      `font-variant-numeric:${fontVariantNumericValue};`
    )
  },

  // COLORS

  b =>
    ({
      "bg-cover": "background-size:cover;",
      "bg-contain": "background-size:contain;",
      "bg-no-repeat": "background-repeat:no-repeat;",
      "bg-repeat": "background-repeat:repeat;",
      "bg-fixed": "background-attachment:fixed;",
      "bg-local": "background-attachment:local;",
      "bg-scroll": "background-attachment:scroll;",
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

  // GRADIENTS - direction/angle utilities set the position slot, the colour
  // stops fill their own slots, and every rule re-declares the stop list.
  b => {
    const linear = position =>
      `--tw-gradient-position:${position};` +
      `background-image:linear-gradient(${gradientStops});`

    let m = b.match(/^bg-(?:linear|gradient)-to-([a-z]{1,2})$/)
    if (m)
      return Object.hasOwn(gradientDirections, m[1])
        ? linear(gradientDirections[m[1]])
        : ""

    m = b.match(/^bg-(?:linear|gradient)-(\d+)$/)
    if (m) return linear(`${m[1]}deg`)

    if (b === "bg-radial")
      return (
        "--tw-gradient-position:ellipse;" +
        `background-image:radial-gradient(${gradientStops});`
      )

    m = b.match(/^bg-conic(?:-(\d+))?$/)
    if (m)
      return (
        `--tw-gradient-position:from ${m[1] ?? 0}deg;` +
        `background-image:conic-gradient(${gradientStops});`
      )

    // Colour stops and their positions
    m = b.match(/^(from|via|to)-(.+)$/)
    if (m) {
      const [, stop, token] = m
      if (/^\d+(\.\d+)?%$/.test(token))
        return `--tw-gradient-${stop}-position:${token};`
      const color = utilityColor(b, token)
      if (!color) return ""
      return stop === "via"
        ? `--tw-gradient-via:${color};` +
            `--tw-gradient-via-stops:${gradientStopsWithVia};`
        : `--tw-gradient-${stop}:${color};`
    }

    return ""
  },

  b => {
    const sq = getArbitrary(b, "[")
    const pa = getArbitrary(b, "(")

    if (b.startsWith("bg-position")) {
      if (sq) return `background-position:${colorValue(sq)};`
      if (pa) return `background-position:${toVarRef(pa)};`
    } else if (b.startsWith("bg-size")) {
      if (sq) return `background-size:${colorValue(sq)};`
      if (pa) return `background-size:${toVarRef(pa)};`
    } else if (b.startsWith("bg-linear")) {
      if (sq)
        return `background-image:linear-gradient(${getArbitrary(b, "[")});`
      if (pa)
        return `background-image:linear-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
    } else if (b.startsWith("bg-radial")) {
      if (sq)
        return `background-image:radial-gradient(${getArbitrary(b, "[")});`
      if (pa)
        return `background-image:radial-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
    } else if (b.startsWith("bg-conic")) {
      if (sq) return `background-image:conic-gradient(${getArbitrary(b, "[")});`
      if (pa)
        return `background-image:conic-gradient(${toVarRef(
          pa.replace("image:", "")
        )});`
      // <angle>, "from" and "to" are missing
    } else if (b.startsWith("bg-")) {
      //Images
      if (b === "bg-none") return "background:none;background-image:none;"
      if (sq && b.includes("url("))
        return `background-image:${getArbitrary(b, "[")};`
      if (pa && b.includes("image:"))
        return `background-image:${toVarRef(pa.replace("image:", ""))};`
      //Colors
      if (sq) return `background-color:${colorValue(sq)};`
      if (pa) return `background-color:${toVarRef(pa)};`
      return `background-color:${colorValue(b.slice(3))};`
    }

    //Text color
    if (
      b.startsWith("text-") &&
      !b.startsWith("text-shadow") &&
      !textNotColor.has(b) &&
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
      if (sq && !hasNumValue(sq)) return `color:${colorValue(sq)};`
      if (pa && !hasNumValue(pa)) return `color:${toVarRef(pa)};`
      if (!hasNumValue(b.slice(5))) return `color:${colorValue(b.slice(5))};`
    }
    return ""
  },

  // BORDERS

  b =>
    ({
      "border-solid": "--tw-border-style:solid;border-style:solid;",
      "border-dashed": "--tw-border-style:dashed;border-style:dashed;",
      "border-dotted": "--tw-border-style:dotted;border-style:dotted;",
      "border-double": "--tw-border-style:double;border-style:double;",
      "border-hidden": "--tw-border-style:hidden;border-style:hidden;",
      "border-none": "--tw-border-style:none;border-style:none;"
    }[b] || ""),

  b => {
    // Twout emits no preflight, so a width utility has to carry a style or
    // the border never renders. Tailwind 4 routes it through
    // --tw-border-style so border-dashed still wins whatever the class order.
    // The style is scoped to the same edges as the width, otherwise the
    // untouched edges would pick up the default "medium" width.
    const sized = (base, value) =>
      `${base}-style:var(--tw-border-style,solid);${base}-width:${value};`

    if (b === "border") return sized("border", "1px")

    // Border with sides. Tailwind 4 uses the logical shorthands for the x/y
    // axes, which also accept a two-value arbitrary shorthand.
    let m = b.match(/^border-(t|r|b|l|x|y|s|e)(?:-(.+))?$/)
    if (m) {
      const side = m[1]
      const axis = { x: "inline", y: "block" }[side]
      const edge = {
        t: "top",
        r: "right",
        b: "bottom",
        l: "left",
        s: "inline-start",
        e: "inline-end"
      }[side]
      const base = `border-${axis ?? edge}`
      const val = m[2]

      if (!val) return sized(base, "1px")
      if (val.startsWith("("))
        return `${base}-color:${toVarRef(getArbitrary(b, "("))};`
      // An arbitrary value has to be read decoded before deciding whether it
      // is a width or a colour, and "1px 2px" is still a width.
      if (val.startsWith("[")) {
        const inner = getArbitrary(b, "[")
        return inner.split(/\s+/).every(hasNumValue)
          ? sized(base, inner)
          : `${base}-color:${inner};`
      }
      if (/^\d+$/.test(val)) return sized(base, `${val}px`)
      if (isColorToken(val)) return `${base}-color:${colorValue(val)};`
      return ""
    }

    //Border all sides
    m = b.match(/^border-(.+)$/)
    if (m) {
      const val = m[1]
      if (val.startsWith("("))
        return `border-color:${toVarRef(getArbitrary(b, "("))};`
      if (val.startsWith("[")) {
        const inner = getArbitrary(b, "[")
        return inner.split(/\s+/).every(hasNumValue)
          ? sized("border", inner)
          : `border-color:${inner};`
      }
      if (/^\d+$/.test(val)) return sized("border", `${val}px`)
      if (isColorToken(val)) return `border-color:${colorValue(val)};`
    }

    return ""
  },

  // border-radius: every side, logical side and single corner
  b => {
    const corners = {
      "": ["border-radius"],
      t: ["border-top-left-radius", "border-top-right-radius"],
      r: ["border-top-right-radius", "border-bottom-right-radius"],
      b: ["border-bottom-right-radius", "border-bottom-left-radius"],
      l: ["border-top-left-radius", "border-bottom-left-radius"],
      s: ["border-start-start-radius", "border-end-start-radius"],
      e: ["border-start-end-radius", "border-end-end-radius"],
      tl: ["border-top-left-radius"],
      tr: ["border-top-right-radius"],
      br: ["border-bottom-right-radius"],
      bl: ["border-bottom-left-radius"],
      ss: ["border-start-start-radius"],
      se: ["border-start-end-radius"],
      ee: ["border-end-end-radius"],
      es: ["border-end-start-radius"]
    }
    const m = b.match(
      /^rounded(?:-(tl|tr|br|bl|ss|se|ee|es|t|r|b|l|s|e))?(?:-(.+))?$/
    )
    if (!m) return ""
    const token = m[2] ?? ""
    let value
    if (token.startsWith("(")) value = toVarRef(getArbitrary(b, "("))
    else if (token.startsWith("[")) value = getArbitrary(b, "[")
    else if (Object.hasOwn(radii, token)) value = radii[token]
    else if (/^\d+$/.test(token)) value = `${token}px`
    else return ""
    return corners[m[1] ?? ""].map(p => `${p}:${value};`).join("")
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

  // box-shadow. shadow, inset-shadow, ring, inset-ring and ring-offset each
  // write one layer of the composed value, so they stack like Tailwind's.
  b => {
    const layer = (name, value) =>
      `--tw-${name}:${value};box-shadow:${boxShadowValue};`

    // ring-offset-<width> | ring-offset-<color>
    let m = b.match(/^ring-offset-(.+)$/)
    if (m) {
      const width = utilityWidth(b, m[1])
      if (width)
        return (
          `--tw-ring-offset-width:${width};` +
          `--tw-ring-offset-shadow:${ringOffsetShadow};` +
          `box-shadow:${boxShadowValue};`
        )
      const color = utilityColor(b, m[1])
      return color ? `--tw-ring-offset-color:${color};` : ""
    }

    // ring-inset | ring | ring-<width> | ring-<color>
    if (b === "ring-inset") return "--tw-ring-inset:inset;"
    m = b.match(/^ring(?:-(.+))?$/)
    if (m) {
      const token = m[1] ?? "1"
      const width = utilityWidth(b, token)
      if (width) return layer("ring-shadow", ringShadow(width))
      const color = utilityColor(b, token)
      return color ? `--tw-ring-color:${color};` : ""
    }

    // inset-ring | inset-ring-<width> | inset-ring-<color>
    m = b.match(/^inset-ring(?:-(.+))?$/)
    if (m) {
      const token = m[1] ?? "1"
      const width = utilityWidth(b, token)
      if (width) return layer("inset-ring-shadow", insetRingShadow(width))
      const color = utilityColor(b, token)
      return color ? `--tw-inset-ring-color:${color};` : ""
    }

    // inset-shadow | inset-shadow-<scale> | inset-shadow-<color>
    m = b.match(/^inset-shadow(?:-(.+))?$/)
    if (m) {
      const token = m[1] ?? ""
      if (token.startsWith("("))
        return layer("inset-shadow", toVarRef(getArbitrary(b, "(")))
      if (token.startsWith("["))
        return layer("inset-shadow", `inset ${getArbitrary(b, "[")}`)
      if (Object.hasOwn(insetShadows, token))
        return layer("inset-shadow", insetShadows[token])
      const color = utilityColor(b, token)
      return color ? `--tw-inset-shadow-color:${color};` : ""
    }

    // shadow | shadow-<scale> | shadow-<color>
    m = b.match(/^shadow(?:-(.+))?$/)
    if (m) {
      const token = m[1] ?? ""
      if (token.startsWith("("))
        return layer("shadow", toVarRef(getArbitrary(b, "(")))
      if (token.startsWith("[")) return layer("shadow", getArbitrary(b, "["))
      if (Object.hasOwn(shadows, token)) return layer("shadow", shadows[token])
      const color = utilityColor(b, token)
      return color ? `--tw-shadow-color:${color};` : ""
    }

    return ""
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

  // mix-blend-mode
  b => {
    const m = b.match(/^mix-blend-(.+)$/)
    if (!m) return ""
    const values = [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
      "plus-darker",
      "plus-lighter"
    ]
    return values.includes(m[1]) ? `mix-blend-mode:${m[1]};` : ""
  },

  //TRANSITIONS & ANIMATION

  //property and behaviour
  b => {
    const sh = b.match(/^transition(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token === "normal") return `transition-behavior:normal;`
    if (token === "discrete") return `transition-behavior:discrete;`

    // Tailwind pairs every transition-property utility with a default
    // duration and easing, both overridable by duration-*/ease-*.
    const defaults =
      "transition-timing-function:var(--tw-ease,cubic-bezier(0.4,0,0.2,1));" +
      "transition-duration:var(--tw-duration,150ms);"
    const set = value => `transition-property:${value};${defaults}`

    if (token === "") return set(transitionProperties)
    if (token === "none") return `transition-property:none;`
    if (token === "all") return set("all")
    if (token === "colors")
      return set(
        "color, background-color, border-color, outline-color," +
          " text-decoration-color, fill, stroke"
      )
    if (token === "opacity") return set("opacity")
    if (token === "shadow") return set("box-shadow")
    if (token === "transform")
      return set("transform, translate, scale, rotate")
    if (token.startsWith("("))
      return set(toVarRef(getArbitrary(b, "(")))
    if (token.startsWith("[")) return set(getArbitrary(b, "["))
    return ""
  },

  //duration
  b => {
    const sh = b.match(/^duration(?:-(.+))?$/)
    if (!sh) return ""
    const token = sh[1] ?? ""
    if (token === "initial") return `transition-duration: initial;`
    if (token.startsWith("("))
      return `transition-duration:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) {
      const v = getArbitrary(b, "[")
      return `--tw-duration:${v};transition-duration:${v};`
    }
    return isNumeric(token)
      ? `--tw-duration:${token}ms;transition-duration:${token}ms;`
      : ""
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
      return `--tw-ease:${token};transition-timing-function:${token};`
    return ["in", "out", "in-out"].includes(token)
      ? `--tw-ease:${b};transition-timing-function:${b};`
      : ""
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

  //animation
  b => {
    const m = b.match(/^animate-(.+)$/)
    if (!m) return ""
    const token = m[1]
    if (token === "none") return "animation:none;"
    if (animationValues[token]) {
      usedKeyframes.add(token)
      return `animation:var(--animate-${token},${animationValues[token]});`
    }
    if (token.startsWith("("))
      return `animation:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `animation:${getArbitrary(b, "[")};`
    return ""
  },

  // TRANSFORMS

  b => {
    // Backface visibility
    if (b === "backface-visible") return "backface-visibility:visible;"
    if (b === "backface-hidden") return "backface-visibility:hidden;"

    // Transform style
    if (b === "transform-style-flat") return "transform-style:flat;"
    if (b === "transform-style-preserve-3d")
      return "transform-style:preserve-3d;"

    const origins = {
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

    // Perspective origin, matched before perspective so that
    // "perspective-origin-top" isn't read as a perspective length.
    let m = b.match(/^perspective-origin-(.+)$/)
    if (m) return `perspective-origin:${origins[m[1]] || m[1]};`

    // Transform origin
    m = b.match(/^origin-(.+)$/)
    if (m) return `transform-origin:${origins[m[1]] || m[1]};`

    // Perspective
    m = b.match(/^perspective-(.+)$/)
    if (m) {
      const token = m[1]
      if (token.startsWith("("))
        return `perspective:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return `perspective:${getArbitrary(b, "[")};`
      return Object.hasOwn(perspectives, token)
        ? `perspective:${perspectives[token]};`
        : ""
    }

    // Angle or factor token: bare numbers take a unit, anything else has to be
    // an arbitrary value or a custom property.
    const angle = (token, unit) => {
      if (token.startsWith("(")) return toVarRef(getArbitrary(b, "("))
      if (token.startsWith("[")) return getArbitrary(b, "[")
      return isNumeric(token) ? token + unit : null
    }

    // Length token: spacing scale, fraction, "full", or an arbitrary value.
    const length = token => {
      if (token.startsWith("(")) return toVarRef(getArbitrary(b, "("))
      if (token.startsWith("[")) return getArbitrary(b, "[")
      if (token === "full") return "100%"
      const sp = spacingValue(token)
      if (sp) return sp
      return fracToPercent(token) ?? (hasNumValue(token) ? token : null)
    }

    // Rotate
    m = b.match(/^rotate-([xyz])-(.+)$/)
    if (m) {
      const v = angle(m[2], "deg")
      if (!v) return ""
      const fn = "rotate" + m[1].toUpperCase()
      return `--tw-rotate-${m[1]}:${fn}(${v});transform:${transformValue};`
    }
    if (b === "rotate-none") return "rotate:none;"
    m = b.match(/^rotate-(.+)$/)
    if (m) {
      const v = angle(m[1], "deg")
      return v ? `rotate:${v};` : ""
    }

    // Skew
    m = b.match(/^skew-([xy])-(.+)$/)
    if (m) {
      const v = angle(m[2], "deg")
      if (!v) return ""
      const fn = "skew" + m[1].toUpperCase()
      return `--tw-skew-${m[1]}:${fn}(${v});transform:${transformValue};`
    }
    m = b.match(/^skew-(.+)$/)
    if (m) {
      const v = angle(m[1], "deg")
      if (!v || isMultiPart(v)) return ""
      return (
        `--tw-skew-x:skewX(${v});--tw-skew-y:skewY(${v});` +
        `transform:${transformValue};`
      )
    }

    // Scale
    if (b === "scale-none") return "scale:none;"
    if (b === "scale-3d") return `scale:${scaleValue};`
    m = b.match(/^scale-([xyz])-(.+)$/)
    if (m) {
      const v = angle(m[2], "%")
      return v ? `--tw-scale-${m[1]}:${v};scale:${scaleValue};` : ""
    }
    m = b.match(/^scale-(.+)$/)
    if (m) {
      const v = angle(m[1], "%")
      if (!v) return ""
      // "scale-[1.5_2]" is the shorthand, not one axis repeated twice.
      if (isMultiPart(v)) return `scale:${v};`
      return `--tw-scale-x:${v};--tw-scale-y:${v};scale:${scaleValue};`
    }

    // Translate
    if (b === "translate-none") return "translate:none;"
    m = b.match(/^translate-([xyz])-(.+)$/)
    if (m) {
      const v = length(m[2])
      return v ? `--tw-translate-${m[1]}:${v};translate:${translateValue};` : ""
    }
    m = b.match(/^translate-(.+)$/)
    if (m) {
      const v = length(m[1])
      if (!v) return ""
      // "translate-[100%_-100%]" is the shorthand, not one axis repeated twice.
      if (isMultiPart(v)) return `translate:${v};`
      return (
        `--tw-translate-x:${v};--tw-translate-y:${v};` +
        `translate:${translateValue};`
      )
    }

    // Transform
    if (b === "transform-none") return "transform:none;"
    if (b === "transform-cpu") return `transform:${transformValue};`
    if (b === "transform-gpu")
      return `transform:translateZ(0) ${transformValue};`
    m = b.match(/^transform-(.+)$/)
    if (m) {
      const token = m[1]
      if (token.startsWith("("))
        return `transform:${toVarRef(getArbitrary(b, "("))};`
      if (token.startsWith("[")) return `transform:${getArbitrary(b, "[")};`
    }

    return ""
  },

  //INTERACTIVITY
  b =>
    ({
      "scroll-auto": "scroll-behavior: auto;",
      "scroll-smooth": "scroll-behavior: smooth;",

      "pointer-events-auto": "pointer-events:auto;",
      "pointer-events-none": "pointer-events:none;",

      "appearance-none": "-webkit-appearance:none;appearance:none;",
      "appearance-auto": "-webkit-appearance:auto;appearance:auto;",

      "scheme-normal": "color-scheme:normal;",
      "scheme-dark": "color-scheme:dark;",
      "scheme-light": "color-scheme:light;",
      "scheme-light-dark": "color-scheme:light dark;",
      "scheme-only-dark": "color-scheme:only dark;",
      "scheme-only-light": "color-scheme:only light;",

      "field-sizing-fixed": "field-sizing:fixed;",
      "field-sizing-content": "field-sizing:content;",

      resize: "resize:both;",
      "resize-none": "resize:none;",
      "resize-x": "resize:horizontal;",
      "resize-y": "resize:vertical;",

      "select-none": "-webkit-user-select:none;user-select:none;",
      "select-text": "-webkit-user-select:text;user-select:text;",
      "select-all": "-webkit-user-select:all;user-select:all;",
      "select-auto": "-webkit-user-select:auto;user-select:auto;",

      // touch-action (the pan-*/pinch-zoom utilities compose; auto, none and
      // manipulation are standalone values that replace the whole property)
      "touch-auto": "touch-action:auto;",
      "touch-none": "touch-action:none;",
      "touch-manipulation": "touch-action:manipulation;",
      "touch-pan-x": touchAction("pan-x", "pan-x"),
      "touch-pan-left": touchAction("pan-x", "pan-left"),
      "touch-pan-right": touchAction("pan-x", "pan-right"),
      "touch-pan-y": touchAction("pan-y", "pan-y"),
      "touch-pan-up": touchAction("pan-y", "pan-up"),
      "touch-pan-down": touchAction("pan-y", "pan-down"),
      "touch-pinch-zoom": touchAction("pinch-zoom", "pinch-zoom"),

      "will-change-auto": "will-change:auto;",
      "will-change-scroll": "will-change:scroll-position;",
      "will-change-contents": "will-change:contents;",
      "will-change-transform": "will-change:transform;",

      // scroll-snap-align
      "snap-start": "scroll-snap-align:start;",
      "snap-end": "scroll-snap-align:end;",
      "snap-center": "scroll-snap-align:center;",
      "snap-align-none": "scroll-snap-align:none;",

      // scroll-snap-stop
      "snap-normal": "scroll-snap-stop:normal;",
      "snap-always": "scroll-snap-stop:always;",

      // scroll-snap-type (strictness is set by snap-mandatory/snap-proximity,
      // with "proximity" as the fallback when neither is present)
      "snap-none": "scroll-snap-type:none;",
      "snap-x": "scroll-snap-type:x var(--tw-scroll-snap-strictness,proximity);",
      "snap-y": "scroll-snap-type:y var(--tw-scroll-snap-strictness,proximity);",
      "snap-both":
        "scroll-snap-type:both var(--tw-scroll-snap-strictness,proximity);",
      "snap-mandatory": "--tw-scroll-snap-strictness:mandatory;",
      "snap-proximity": "--tw-scroll-snap-strictness:proximity;"
    }[b] || ""),

  // scroll-margin & scroll-padding
  b => {
    const m = b.match(/^scroll-(m|p)([trblxyse]?)-(.+)$/)
    if (!m) return ""
    const [, type, axis, token] = m
    const propBase = type === "p" ? "scroll-padding" : "scroll-margin"
    let v
    if (token.startsWith("(")) v = toVarRef(getArbitrary(b, "("))
    else if (token.startsWith("[")) v = getArbitrary(b, "[")
    else v = spacingValue(token) ?? token
    const set = side => `${propBase}-${side}:${v};`
    if (!axis) return `${propBase}:${v};`
    if (axis === "x") return `${propBase}-inline:${v};`
    if (axis === "y") return `${propBase}-block:${v};`
    const map = {
      t: "top",
      r: "right",
      b: "bottom",
      l: "left",
      s: "inline-start",
      e: "inline-end"
    }
    return set(map[axis])
  },

  // will-change (arbitrary values)
  b => {
    const m = b.match(/^will-change-(.+)$/)
    if (!m) return ""
    const token = m[1]
    if (token.startsWith("("))
      return `will-change:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("[")) return `will-change:${getArbitrary(b, "[")};`
    return ""
  },

  // accent-color & caret-color
  b => {
    const m = b.match(/^(accent|caret)-(.+)$/)
    if (!m) return ""
    const prop = m[1] === "accent" ? "accent-color" : "caret-color"
    const token = m[2]
    if (token.startsWith("("))
      return `${prop}:${toVarRef(getArbitrary(b, "("))};`
    if (token.startsWith("["))
      return `${prop}:${colorValue(getArbitrary(b, "["))};`
    return `${prop}:${colorValue(token)};`
  },

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
    const m = b.match(/^filter(?:-(.+))?$/)
    if (!m) return ""
    const token = m[1] ?? ""
    const emit = value => `-webkit-filter:${value};filter:${value};`
    if (token == "") return emit(filterValue)
    if (token == "none") return emit("none")
    if (token.startsWith("(")) return emit(toVarRef(getArbitrary(b, "(")))
    if (token.startsWith("[")) return emit(getArbitrary(b, "["))
    return ""
  },

  b => {
    const m = b.match(
      /^(blur|brightness|contrast|drop-shadow|grayscale|hue-rotate|invert|saturate|sepia)(?:-(.+))?$/
    )
    if (!m) return ""
    const value = filterFunctionValue(b, m[1], m[2] ?? "")
    if (!value) return ""
    return (
      `--tw-${m[1]}:${value};` +
      `-webkit-filter:${filterValue};` +
      `filter:${filterValue};`
    )
  },

  //BACKDROP FILTERS

  b => {
    const m = b.match(/^backdrop-filter(?:-(.+))?$/)
    if (!m) return ""
    const token = m[1] ?? ""
    const emit = value =>
      `-webkit-backdrop-filter:${value};backdrop-filter:${value};`
    if (token == "") return emit(backdropFilterValue)
    if (token == "none") return emit("none")
    if (token.startsWith("(")) return emit(toVarRef(getArbitrary(b, "(")))
    if (token.startsWith("[")) return emit(getArbitrary(b, "["))
    return ""
  },

  b => {
    const m = b.match(
      /^backdrop-(blur|brightness|contrast|grayscale|hue-rotate|invert|opacity|saturate|sepia)(?:-(.+))?$/
    )
    if (!m) return ""
    const value = filterFunctionValue(b, m[1], m[2] ?? "")
    if (!value) return ""
    return (
      `--tw-backdrop-${m[1]}:${value};` +
      `-webkit-backdrop-filter:${backdropFilterValue};` +
      `backdrop-filter:${backdropFilterValue};`
    )
  }
]

// ---- main ----
export default function Twout(classes) {
  let css = ""
  usedKeyframes = new Set()

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

    // A handler returns declarations, or { suffix, rule } when the utility
    // styles the element's children (space-x-*) rather than the element.
    const resolve = b => {
      for (const h of handlers) {
        const r = h(b)
        if (r) return typeof r === "string" ? { suffix: "", rule: r } : r
      }
      return null
    }

    let rule = ""
    let suffix = ""

    const mod = splitOpacityModifier(base)
    if (mod) {
      const percent = alphaToPercent(mod.modifier)
      if (percent) {
        const candidate = resolve(mod.base)
        const applied =
          candidate && applyOpacityModifier(candidate.rule, percent)
        if (applied) {
          rule = applied
          suffix = candidate.suffix
        }
      }
    }

    if (!rule) {
      const resolved = resolve(base)
      if (resolved) {
        rule = resolved.rule
        suffix = resolved.suffix
      }
    }

    if (rule) {
      rule = applyFlag(rule, isNegative, isImportant)
      css += wrapVariants(selector, rule, variants, suffix)
    }
  })

  usedKeyframes.forEach(name => {
    css += animationKeyframes[name]
  })

  return css
}