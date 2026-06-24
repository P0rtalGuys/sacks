---
name: Sack
description: Personal finance tracker that makes money feel lighter
colors:
  primary: "oklch(0.56 0.23 285)"
  primary-light: "oklch(0.69 0.21 285)"
  accent: "oklch(0.68 0.18 163)"
  background: "oklch(0.985 0.003 260)"
  foreground: "oklch(0.15 0.015 260)"
  card: "oklch(1 0 0)"
  secondary: "oklch(0.94 0.015 285)"
  secondary-foreground: "oklch(0.28 0.05 285)"
  muted: "oklch(0.95 0.008 260)"
  muted-foreground: "oklch(0.52 0.015 260)"
  border: "oklch(0.9 0.01 260)"
  input: "oklch(0.92 0.008 260)"
  sidebar: "oklch(0.2 0.075 285)"
  sidebar-foreground: "oklch(0.93 0.01 260)"
  sidebar-accent: "oklch(0.27 0.065 285)"
  destructive: "oklch(0.6 0.24 25)"
typography:
  display:
    fontFamily: "'Fredoka', system-ui, sans-serif"
    fontWeight: 600
    fontSize: "clamp(1.75rem, 4vw, 2.5rem)"
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'Fredoka', system-ui, sans-serif"
    fontWeight: 600
    fontSize: "1.5rem"
    lineHeight: 1.25
  title:
    fontFamily: "'Fredoka', system-ui, sans-serif"
    fontWeight: 600
    fontSize: "1.125rem"
    lineHeight: 1.3
  body:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
    lineHeight: 1.6
  label:
    fontFamily: "'Nunito', system-ui, sans-serif"
    fontWeight: 600
    fontSize: "0.875rem"
    lineHeight: 1.4
    letterSpacing: "0.01em"
rounded:
  sm: "12px"
  md: "14px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "8px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "8px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "8px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Design System: Sack

## 1. Overview

**Creative North Star: "The Friendly Ledger"**

Sack is built for the moment a person opens their laptop at the kitchen table and decides to actually understand their money. It is not a tool for financial anxiety — it is the opposite: a place where numbers feel manageable, even satisfying to look at. The visual system takes that scene seriously. Deep indigo gives weight and structure (you are looking at real money here), while Fredoka's rounded geometry and emerald moments of confirmation make the whole thing feel like something you want to open, not something you have to.

This is not a spreadsheet. It is not a fintech product. The Friendly Ledger metaphor names what the system actually is: a ledger — precise, honest, structured — but one that belongs to a person, not a corporation. The indigo primary is a commitment (Deep Conviction), the emerald accent is a reward signal (confirmation, success, growth), and everything in between is quiet white space that gives the numbers room to breathe.

The system explicitly rejects the visual language of crypto dashboards and spreadsheet clones: no dark neon, no gradient-heavy hero sections, no dense row-and-column layouts. Personality lives in type, colour, and subtle spring-press interaction — not in decorative chrome, animated loaders, or growth metrics.

**Key Characteristics:**
- Deep indigo primary anchors trust and structure across all surfaces
- Rounded display type (Fredoka) brings personality without noise
- Cards topped with a 3px indigo→emerald gradient bar communicate warmth on high-value surfaces only
- 12–24px radius scale — nothing sharp, nothing excessive
- Press-scale buttons (`active:scale-95`) for tactile, kinaesthetic feedback
- Near-white tinted background with intentional pure-white card surfaces
- Sidebar lives in its own deep-indigo world, cleanly separated from content

## 2. Colors: The Deep Conviction Palette

A committed palette running on a single hue family (285° indigo-violet) with one earned accent (163° emerald).

### Primary
- **Deep Conviction Indigo** (`oklch(0.56 0.23 285)`): The structural anchor. Used on all primary actions (buttons, active nav items), focus rings, chart series 1, and the left half of the gradient card-border. Appears at medium-high saturation so it reads as intentional, not decorative. In dark mode, lifts to `oklch(0.69 0.21 285)` to maintain contrast.

### Secondary
- **Fresh Emerald** (`oklch(0.68 0.18 163)`): The confirmation colour. Used on success states, chart series 2, and the right half of the gradient card-border accent. Its appearance is earned — a budget met, a successful sync. It does not appear as a general background tint or decorative splash. Scarcity is the reward signal.

### Tertiary
- **Deep Indigo Sidebar** (`oklch(0.2 0.075 285)`): The navigation container lives in its own visual world. This near-black indigo background separates structure from content, conveying permanence and orientation.

### Neutral
- **Ghost White** (`oklch(0.985 0.003 260)`): Page background. Near-white with a trace of indigo hue so it never reads as clinical. Card surfaces are pure white on top of this.
- **Pure Card** (`oklch(1 0 0)`): Card background. The ground-figure relationship between Ghost White and Pure Card creates depth without shadows at the page level.
- **Ink** (`oklch(0.15 0.015 260)`): Body and heading text. Near-black with a trace of cool hue. Never pure black.
- **Dust** (`oklch(0.52 0.015 260)`): Supporting text, metadata, timestamps, placeholder labels. Contrasts at ≥4.5:1 against white card surfaces.
- **Cloud** (`oklch(0.94 0.015 285)`): Secondary container and hover background. Carries a whisper of indigo.
- **Hairline** (`oklch(0.9 0.01 260)`): Border and divider colour. Near-invisible; its job is separation, not decoration.
- **Danger** (`oklch(0.6 0.24 25)`): Destructive actions and over-budget states. Always paired with a text label or icon — never colour alone.

### Named Rules
**The Emerald Economy Rule.** Fresh Emerald appears in exactly two contexts: the right half of the gradient card-border accent bar, and success/confirmation states. It is not a background, a button colour, or a decorative tint anywhere else in the system.

**The One Voice Rule.** Deep Conviction Indigo and the sidebar's Deep Indigo are the same hue family (285°), different lightness. The system runs on one hue. No blue, no purple, no teal introduced as additional primaries.

## 3. Typography

**Display Font:** Fredoka (with system-ui, sans-serif fallback)
**Body Font:** Nunito (with system-ui, sans-serif fallback)

**Character:** Fredoka's rounded, softly geometric letterforms bring warmth to headings without sacrificing legibility — confident and approachable rather than childish. Nunito pairs on a weight-and-expression axis: both are friendly sans-serifs, but Fredoka's display personality contrasts Nunito's humanist neutrality at body sizes. The pairing feels considered, not decorative.

### Hierarchy
- **Display** (Fredoka, 600, `clamp(1.75rem, 4vw, 2.5rem)`, line-height 1.2, letter-spacing -0.01em): Page titles, modal headings. Optical tightening at larger sizes.
- **Headline** (Fredoka, 600, 1.5rem / 24px, line-height 1.25): Section headings, card titles, stat labels.
- **Title** (Fredoka, 600, 1.125rem / 18px, line-height 1.3): Subsection headers, dialog headings, sidebar brand mark.
- **Body** (Nunito, 400, 1rem / 16px, line-height 1.6): All running text, form descriptions, empty state copy. Cap at 65–75ch on wide containers.
- **Label** (Nunito, 600, 0.875rem / 14px, line-height 1.4, letter-spacing 0.01em): Button text, navigation labels, form field labels, small metadata.

### Named Rules
**The Fredoka Ceiling Rule.** Fredoka is for h1–h6 only. Body copy, labels, and button text use Nunito. Mixing the display font into body-weight text makes the system feel like a children's product, not a personal finance tool.

**The Weight Balance Rule.** Nunito 600 is the label weight. Nunito 400 is body. No 700 or 800 weight is in use. Heavy weights conflict with Fredoka's rounded geometry and push the system toward aggression.

## 4. Elevation

Sack uses a **flat-by-default** elevation model. Depth is communicated through background colour contrast — pure white cards on a near-white tinted page — not stacking shadows.

The one exception is the card ambient shadow: a low-opacity diffuse `box-shadow` (`shadow-sm shadow-black/8` in light, `shadow-black/30` in dark) that grounds cards without lifting them aggressively. It reads as belonging, not floating.

Primary buttons receive a tinted indigo shadow at rest (`shadow-md shadow-primary/30`) to signal pressability. On active, buttons compress (`scale-95`) rather than deepening their shadow — feedback is kinaesthetic, not visual.

The sidebar has no shadow. Depth is established by the colour break alone.

### Shadow Vocabulary
- **Card ambient** (`0 1px 3px oklch(0 0 0 / 0.08)` light / `oklch(0 0 0 / 0.30)` dark): Diffuse, full-surround grounding.
- **Button glow** (`0 4px 12px oklch(0.56 0.23 285 / 0.30)`): Tinted indigo glow under primary buttons at rest. Communicates pressability.

### Named Rules
**The Flat-By-Default Rule.** Shadows appear only on cards (ambient grounding) and primary buttons (pressability signal). No surface gains a shadow from hover or elevation alone. Hover does not deepen the card shadow — that is the wrong signal for a data surface.

## 5. Components

### Buttons
Tactile and confident. Every button has a press spring (`active:scale-95`, `transition-all duration-150`) so the interface feels alive, not inert.

- **Shape:** Rounded-xl (20px radius) for default and large sizes; rounded-lg (16px) for small.
- **Primary:** Indigo→violet gradient (`linear-gradient(135deg, oklch(0.56 0.23 285), oklch(0.55 0.22 305))`), white Nunito 600 label, 8px 20px padding, 40px height. Tinted indigo glow shadow. Hover: `opacity-90`. Active: `scale-95`.
- **Outline:** Ghost White background, Ink text, Hairline border. Hover: Cloud background tint. For secondary actions needing visible affordance.
- **Ghost:** Transparent background, Ink text. Hover: Cloud tint. For tertiary actions where an outline would over-weight the hierarchy.
- **Destructive:** Danger colour background, white text. Confirmation required before irreversible execution.
- **Focus:** `ring-2 ring-ring ring-offset-2` (indigo ring, 2px, 2px offset). Keyboard-accessible on all variants.

### Cards / Containers
White surfaces on a near-white page. The contrast is subtle but intentional — depth without shadows at the page level.

- **Corner Style:** Gently rounded (24px / rounded-2xl).
- **Background:** Pure Card (`oklch(1 0 0)`)
- **Border:** Hairline (`1px solid oklch(0.9 0.01 260)`)
- **Shadow:** Light ambient — grounding, not lifting.
- **Gradient Bar:** Stat and overview cards only. A 3px top-edge accent, `linear-gradient(90deg, oklch(0.56 0.23 285), oklch(0.68 0.18 163))`. Reserved for the highest-value data surfaces on the dashboard. Not applied to every card.
- **Internal Padding:** 24px (CardHeader + CardContent).

### Inputs / Fields
Stroke inputs with a soft Cloud-grey fill. Distinct from the pure-white card background so fields read clearly even without a border at rest.

- **Style:** Cloud background (`oklch(0.92 0.008 260)`), Hairline border, rounded-md (14px).
- **Focus:** `box-shadow: 0 0 0 2px oklch(0.56 0.23 285)`, border transparent. The ring replaces the border on focus.
- **Error:** Danger border + text label directly below the field. Never colour-only.
- **Disabled:** `opacity-50`, `pointer-events-none`.
- **Label:** Always visible above the field (Nunito 600, 14px, Ink). Placeholder provides supplementary context only.

### Navigation
The sidebar is its own visual territory — deep indigo, always present, cleanly separated from content.

- **Default item:** Sidebar-foreground text (`oklch(0.93 0.01 260)`), transparent background. Hover: sidebar-accent tint at 50% opacity.
- **Active item:** Indigo→violet gradient fill, white text, light tinted shadow. Same gradient-primary treatment as primary buttons — active state and primary actions share visual language deliberately.
- **Mobile bottom nav:** Glassmorphic bar (backdrop-blur, `bg-background/80`), icon + label, up to 4 items. Active item uses Deep Conviction Indigo text colour.
- **Brand mark:** Fredoka "Sack" with `linear-gradient(135deg, #a5b4fc, #6ee7b7)` applied to text fill. Light indigo to light emerald — visible on the dark sidebar background.

### Avatar Initials (Signature Component)
Subscriptions and upcoming renewals display a coloured avatar showing the first 1–2 initials of the service name. Colour is deterministically seeded from the service name's character codes, so the same service always produces the same colour across sessions. Rounded-xl (12px) for subscription cards; rounded-full for compact renewal rows. Text always white, Nunito 700.

**Palette:** `#3b82f6` (blue), `#8b5cf6` (violet), `#ec4899` (pink), `#f97316` (orange), `#14b8a6` (teal), `#06b6d4` (cyan), `#ef4444` (red), `#a855f7` (purple).

## 6. Do's and Don'ts

### Do:
- **Do** use Deep Conviction Indigo for all primary CTAs, active navigation, chart series 1, and focus rings.
- **Do** use Fresh Emerald exclusively for success states and the right half of the gradient card-border.
- **Do** use Fredoka at 600 weight for all h1–h6; use Nunito for all labels, body, and button text.
- **Do** keep card shadows diffuse and low-opacity (8% black light / 30% dark). Shadows ground; they do not lift.
- **Do** apply the gradient card-border to dashboard stat cards and high-priority summary surfaces only. It is a brand moment, not a card style.
- **Do** include both icon and text label on all navigation items. Icon-only nav reduces discoverability and fails keyboard users.
- **Do** add `active:scale-95` to all clickable surfaces — buttons, nav items, tappable cards — to maintain tactile consistency.
- **Do** target WCAG AAA (7:1) for body text; WCAG AA (4.5:1) minimum for all other text including muted foreground and placeholder text.
- **Do** include `@media (prefers-reduced-motion: reduce)` alternatives for all animations (accordion, press scale, page transitions).
- **Do** pair all colour-only status signals (red for over-budget, green for under) with a text label or icon.

### Don't:
- **Don't** use spreadsheet-style dense tables or row-heavy layouts. Data belongs in cards with breathing room, not tight grids.
- **Don't** use crypto or fintech visual language: no dark neon palettes, no rocket emojis as status indicators, no growth-chart hero metrics with aggressive upward-trending gradients, no urgency-copy CTA stacks.
- **Don't** add more than one primary CTA per screen. Secondary actions use outline or ghost variants.
- **Don't** apply shadows to surfaces beyond cards and primary buttons. The flat-by-default rule is not a suggestion.
- **Don't** use Fresh Emerald as a background tint, button colour, or general decorative accent. Rarity is the reward.
- **Don't** use red and green alone to convey financial status. Always pair colour with icon or text label.
- **Don't** use `border-left` or `border-right` coloured stripes as card accents. The 3px top gradient bar is the brand pattern; side stripes are a different and lesser design language.
- **Don't** use placeholder text as the only label for a form field. Every input has a visible label above it.
- **Don't** apply Fredoka to body copy, descriptions, or text below title-level. It reads as infantilising at small sizes.
- **Don't** introduce a third colour family. Deep Conviction Indigo and Fresh Emerald are the two intentional chromatic voices. A third colour dilutes the conviction.
