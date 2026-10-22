---
name: Casa DaNa & CasAy
description: Booking site and back-office for two holiday villas in Los Alcázares
colors:
  primary: "oklch(23.6% 0.108 253)"
  primary-container: "oklch(32.8% 0.085 258)"
  on-primary: "oklch(97.8% 0.002 60)"
  on-primary-container: "oklch(55.2% 0.062 265)"
  secondary: "oklch(47.2% 0.123 62)"
  secondary-container: "oklch(81.2% 0.089 78)"
  on-secondary-container: "oklch(29% 0.085 68)"
  secondary-fixed: "oklch(81.2% 0.089 78)"
  tertiary: "oklch(12.9% 0.008 0)"
  error: "oklch(40.3% 0.211 29.2)"
  error-container: "oklch(88.2% 0.082 25)"
  on-error-container: "oklch(23.5% 0.145 18)"
  background: "oklch(97.8% 0.002 60)"
  surface: "oklch(97.8% 0.002 60)"
  surface-dim: "oklch(85.7% 0.003 60)"
  surface-container-low: "oklch(96.6% 0.002 60)"
  surface-container: "oklch(94.6% 0.002 60)"
  surface-container-high: "oklch(92.6% 0.002 60)"
  inverse-surface: "oklch(19% 0.008 60)"
  inverse-on-surface: "oklch(96% 0.002 60)"
  on-surface: "oklch(12.1% 0.012 60)"
  on-surface-variant: "oklch(48.8% 0.022 60)"
  outline: "oklch(55.5% 0.03 60)"
  outline-variant: "oklch(79.5% 0.02 60)"
typography:
  display:
    fontFamily: "Fraunces, Noto Serif, Georgia, serif"
    fontSize: "clamp(64px, 9vw, 156px)"
    fontWeight: 300
    lineHeight: 0.88
    letterSpacing: "-0.035em"
    fontVariation: '"SOFT" 40'
  headline:
    fontFamily: "Fraunces, Noto Serif, Georgia, serif"
    fontSize: "clamp(40px, 5.4vw, 72px)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Fraunces, Noto Serif, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.22em"
  admin-title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 600
  admin-body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
rounded:
  none: "0px"
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  gutter: "24px"
  gutter-md: "40px"
  container: "1440px"
  section: "80px"
  section-md: "140px"
  card: "20px"
components:
  button-editorial:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "18px 28px"
  button-editorial-hover:
    backgroundColor: "{colors.primary-container}"
  button-editorial-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: "16px 24px"
  button-editorial-outline-hover:
    backgroundColor: "{colors.surface-container-low}"
  button-nav-reserve:
    textColor: "{colors.on-primary}"
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "10px 16px"
  button-admin-default:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-admin-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  input-admin:
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "4px 10px"
  input-booking:
    backgroundColor: "#ffffff"
    textColor: "{colors.primary}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
  chip-category:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  badge-status-pending:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  badge-status-paid:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card-admin:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.card}"
  dialog:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "24px"
    width: "480px"
  toast:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
---

# Design System: Casa DaNa & CasAy

<!-- Captured from code in apps/web (src/globals.css, src/components/**, src/routes/**). PRODUCT.md does not exist yet; the qualitative language below (North Star, color names, philosophy) was inferred from the implementation rather than confirmed with the user. -->

## Overview

**Creative North Star: "The Villa Journal"**

The public site reads like a printed travel magazine laid over full-bleed photography of the two houses. Headlines are set in a light, soft-axis serif (Fraunces) with one word in each title switched to italic for emphasis; small print is set in tracked, uppercase monospace (JetBrains Mono) like captions and folios; body copy is a quiet sans (Inter). Color is restrained: a deep navy carries the brand, a warm sand/ochre is the single accent, and everything else sits on a nearly white, very slightly warm paper. The public pages are square-cornered and generous, with 140px vertical section rhythm on desktop and a 1440px editorial container.

The back-office (`/admin`) is a separate, denser register built on the shadcn/Base UI primitives in `components/ui`: Inter throughout, 13 to 14.5px text, 8px-rounded cards with hairline borders, a navy sidebar, and tonal status pills. It shares the palette with the public site but drops the editorial typography, except for the monospace used on numbers and small meta lines.

Depth is mostly flat. One navy-tinted, long-falloff shadow ("editorial shadow") lifts photographs, the booking panel, dialogs and the toast; everything else separates with hairline borders and tonal surface steps.

**Key Characteristics:**
- Light Fraunces display type with an italic word per title (`italic-display`, SOFT 60).
- Uppercase monospace labels tracked at 0.22em to 0.28em for eyebrows, meta, buttons and form labels.
- Navy primary, sand accent, warm off-white paper; color is used in large blocks (navy marquee, navy footer, sand CTA strip), not sprinkled.
- Square corners on the public site; pills only for chips, round icon buttons and the nav "Reserve" button.
- Admin is a compact shadcn-style tool UI on the same tokens, with 8px radii.
- No dark theme: a `dark` custom variant is declared and shadcn `dark:` classes exist, but no dark token values are defined.

## Colors

A Material 3 role palette expressed in OKLCH: one navy, one warm sand accent, and a warm-neutral surface ladder. shadcn names (`foreground`, `muted`, `border`, `ring`, `destructive`...) are aliased onto these roles in `globals.css` so the `components/ui` primitives resolve to the same palette.

### Primary
- **Harbour Navy** (primary): the brand color. Primary buttons, footer and admin sidebar backgrounds, the marquee ribbon, display headlines on paper, selected calendar days, focus ring (`ring`), and the tint of the hero gradient overlays and the editorial shadow.
- **Night Harbour** (primary-container): hover state of every navy button and of sidebar links; approved-status pill background.
- **Paper on Navy** (on-primary): text on navy.

### Secondary
- **Ochre** (secondary): the small accent for text and icons on paper: eyebrow labels before section headlines (with a 24px rule), feature icons on property cards, rating stars, "pending" calendar dates.
- **Sand** (secondary-container / secondary-fixed): chip backgrounds (villa category), the full-width CTA strip on the home page, the selected stay range in the booking calendar, and the "pending" status pill. A 55% mix of it marks pending nights in the availability calendar.
- **Burnt Sand** (on-secondary-container): text on Sand.

### Tertiary
- **Ink** (tertiary): declared but rarely used directly; part of the generated Material set.

### Neutral
- **Warm Paper** (background / surface): page and card background. Near-white with a slight warm hue (60).
- **Paper Low / Paper / Paper High** (surface-container-low, surface-container, surface-container-high): alternating section bands (the gallery and every other property card sit on Paper Low), hover fills for outline buttons and calendar days, table header rows, muted and accent aliases.
- **Booked Grey** (surface-dim): fill for booked nights in the availability calendar.
- **Ink Text** (on-surface): body and heading text in admin and forms.
- **Driftwood** (on-surface-variant): secondary text, captions, labels, table meta, price line items.
- **Hairline** (outline-variant): every border and divider: cards, tables, booking panel fields, FAQ rows, `border` and `input` aliases.
- **Inverse Ink** (inverse-surface): toast background; at 40% it is the dialog backdrop.
- **Pure white** (`#fff` / `white`): booking-panel field rows and the date-picker popover use white rather than Warm Paper, and hero/footer text uses white and `slate-300` from Tailwind's default palette rather than tokens.

### Error
- **Brick** (error / error-container / on-error-container): form error text and banners (`border-error/30 bg-error-container/20`), destructive buttons (`destructive` alias at 10% fill), rejected-status pill, hover of admin delete icons.

### Named Rules
**The One Accent Rule.** Sand/Ochre is the only accent. New emphasis uses navy weight or italic Fraunces before it reaches for another hue.

**The Navy Block Rule.** Navy appears in solid, full-width blocks (marquee, footer, admin sidebar, primary buttons) rather than as thin decorative strokes.

## Typography

**Display Font:** Fraunces (with Noto Serif, Georgia, serif), variable axes opsz, wght 300 to 700, SOFT, WONK, loaded from Google Fonts in `index.html`.
**Body Font:** Inter (with system-ui, sans-serif), wght 300 to 700.
**Label/Mono Font:** JetBrains Mono (with ui-monospace), wght 400 and 500.

**Character:** A soft, light, high-contrast serif for voice and a technical monospace for the small print; Inter stays out of the way between them.

Theme variables: `--font-display` and `--font-headline` are both Fraunces; `--font-body` and `--font-label` are both Inter; `--font-mono` is JetBrains Mono. Only `font-display`, `font-body` (set on `body`) and `font-mono` are used in components. A few price suffixes use `font-sans`, which is Tailwind's default system stack, not Inter. `@fontsource-variable/geist` is imported in `globals.css` and `--font-geist-sans` is set, but nothing consumes Geist.

### Hierarchy
- **Display** (300, clamp(64px, 9vw, 156px), 0.88, -0.035em, SOFT 40): hero titles on the home and villa pages, white over photography with a navy text-shadow, one italic word per line.
- **Headline** (300, clamp(40px, 5.4vw, 72px), 1.0, -0.025em): section titles (gallery, FAQ, reviews...). Property titles use clamp(36px, 4.4vw, 60px) at 1.02; the CTA strip uses clamp(36px, 4.6vw, 56px).
- **Title** (italic Fraunces, 17 to 28px): prices, stat values in hero bands, FAQ questions (20 to 22px), booking panel values (17px), brand wordmark (22px nav, 30px footer).
- **Lead** (300 Fraunces, 20px, -0.01em, max 34ch): the one-line tagline above property body copy.
- **Body** (Inter 400, 14.5 to 15.5px, leading-relaxed 1.625, max 44 to 60ch): paragraphs on paper, in Driftwood.
- **Label** (JetBrains Mono, 9.5 to 11px, uppercase, 0.12em to 0.32em): eyebrows, nav links (11px, 0.22em), button text (11px, 0.28em), form field labels (10px, 0.22em), stat labels, legend, footer column titles.
- **Admin** (Inter): card titles 14.5px/600, body 13 to 13.5px, field labels 12px/600 in Driftwood, table headers 10.5px/600 uppercase 0.08em, stat values in mono 24px/700.

### Named Rules
**The Italic Word Rule.** Each editorial headline sets exactly one word or name in italic (`italic-display`: italic with SOFT 60, WONK 0). The italic word carries the emphasis; weight stays light.

**The Mono Caption Rule.** Anything that labels rather than says (eyebrow, field label, button, meta, legend) is uppercase JetBrains Mono with wide tracking. Body sentences are never set in mono.

## Layout

- **Container:** `max-w-[1440px]`, centered, with 24px side padding below `md` and 40px from `md` (768px) up. Used by the navbar, every section and the footer.
- **Section rhythm:** 80px vertical padding on mobile; 140px on desktop for the main villa sections (gallery, FAQ...); property cards and the CTA strip use 80 to 96px. Sections alternate between Warm Paper and Paper Low to separate without rules.
- **Hero:** full viewport (`h-screen`, min 600 to 720px), photo with a navy vertical gradient (0.5 to 0.1 to 0.65 alpha), content pinned to the bottom in a three-row grid: title, a bordered stat band (2 columns mobile, 4 from `md`, white/25 hairlines), then copy and a scroll cue.
- **Asymmetric two-column splits:** property cards alternate `7fr/5fr` and `5fr/7fr`; FAQ uses `1fr/1.4fr`; section intros use `auto/1fr` with the description right-aligned on desktop. Gaps are 40 to 96px.
- **Gallery:** 12-column bento grid on desktop with 220px auto rows and 12px gaps; single column on mobile.
- **Navbar:** fixed, three-column grid (`1fr auto 1fr`) from `lg` (1024px); links hide below `lg`, the language selector below `md`.
- **Booking panel:** sticky at `top-28` (112px) from `md`.
- **Admin:** fixed `236px` sidebar plus main area with 40px x 32px padding; cards use 20px internal padding; forms are a 2-column grid from `sm` (640px) with 16px gaps; stat tiles auto-fit at min 150px.
- **Breakpoints:** Tailwind defaults (`sm` 640px, `md` 768px, `lg` 1024px).

## Elevation & Depth

Flat by default, with tonal layering (Paper, Paper Low, white field rows) and hairline borders doing most of the separation. A single bespoke shadow, tinted with the primary navy, lifts the few things that should feel like objects on the page.

### Shadow Vocabulary
- **Editorial shadow** (`--shadow-editorial` via `shadow-editorial` or the `.editorial-shadow` utility): property photographs and their badge, the booking panel and its date popover, dialogs, the admin login card, the toast.
- **Scrolled navbar** (a one-off 0 20px 40px -20px navy at 12%): appears when the page scrolls past 50px, with the navbar switching from a translucent dark-on-photo state to 95% Warm Paper.
- **shadcn defaults** (`shadow-md`, `shadow-lg`): select and dropdown popups only.

### Named Rules
**The Navy Shadow Rule.** Shadows are tinted with the primary navy, never neutral black, and are reserved for photographs and floating panels.

## Shapes

Two shape languages share the palette:

- **Public site: square.** Photographs, buttons, the booking panel, its field rows and the date popover all have 0 radius (`rounded-none` is set explicitly on Button and Input there to override the shadcn defaults). Round shapes are reserved for pills (category chip, nav "Reserve" button), 28px circular icon buttons (calendar arrows, guest steppers, FAQ plus), and the 42px circle that marks check-in and check-out dates.
- **Admin and shadcn primitives: softly rounded.** Buttons, inputs, cards, stat tiles and select popups are 8px (`rounded-lg`); sidebar links and small icon buttons are 6px (`rounded-md`); the dialog and login card are 12px (`rounded-xl`); status pills and the switch are fully round.
- **Hairlines over fills:** 1px `outline-variant` borders define cards, tables, FAQ rows and the stacked booking fields (rows share borders via `border-t-0`/`border-b-0`).
- **Diagonal split cells:** a calendar day half-filled on the diagonal (top-left = previous night, bottom-right = own night) marks changeover days; this is a signature shape of the booking calendar.

## Components

### Buttons
- **Editorial primary (public):** square, Harbour Navy fill, paper text, mono 11px uppercase at 0.28em, 18px x 28px padding, trailing 14px arrow icon. Hover fills Night Harbour (`transition-colors`). Used for "explore villa", CTA strip, booking submit (full width, disabled at 60% opacity).
- **Editorial outline (public):** square, hairline border, navy mono label, 16px x 24px; hover fills Paper Low.
- **Nav "Reserve":** pill, mono 10.5px at 0.22em, 1px `currentColor` border over the hero; switches to solid navy once the navbar is scrolled.
- **shadcn Button (admin):** 8px radius, 32px tall (`default`), 28px (`sm`), 36px (`lg`), 14px Inter medium. Variants: `default` (navy), `outline` (hairline on paper, hover Paper), `secondary` (ochre), `ghost`, `destructive` (Brick at 10% fill, Brick text), `link`. Focus: 3px ring in navy at 50%. Press: 1px downward nudge (`active:translate-y-px`). Disabled: 50% opacity.
- **Round icon button:** 28px circle, hairline border, navy icon (12px); hover Paper Low. In the FAQ it fills navy and rotates 45 degrees when open.

### Chips and Badges
- **Category chip:** pill, Sand background, Burnt Sand text, mono 11px uppercase 0.22em, 6px x 14px.
- **Photo badge:** square Warm Paper tag pinned 24px into the top-left of a property photo, navy mono label, editorial shadow.
- **Status pills (admin):** fully round, 11.5px/600 Inter, 4px x 10px. Pending: Sand on Burnt Sand; approved: Night Harbour container; paid: solid navy; rejected: Brick container; cancelled: Paper High on Driftwood.

### Cards / Containers
- **Property card:** not a boxed card but a full-width section: photo (16:10, editorial shadow, 1.04 scale on hover over 700ms) beside the text column; features in a 3-column row between hairlines; price in italic Fraunces 26px.
- **Admin card:** 8px radius, hairline border, Warm Paper fill, header row (title 14.5px/600, optional 12.5px sub, right-aligned action) separated by a hairline, 20px body padding or flush for tables.
- **Stat tile:** 8px radius, hairline, 11px uppercase label, 24px bold mono value.
- **Booking panel:** square, hairline, editorial shadow, 24px (32px from `md`) padding, sticky.

### Inputs / Fields
- **Admin input (shadcn):** 32px, 8px radius, hairline border, transparent fill, 14px from `md`; focus switches the border to navy with a 3px navy/50 ring; invalid shows a Brick border and ring; disabled at 50%.
- **Booking fields:** a stacked list of white rows separated by hairlines, each with a 10px mono uppercase label above a borderless 15px navy input (`rounded-none`, no ring, no shadow); placeholders in Driftwood at 50%. Errors appear in a Brick banner below the stack.
- **Toggle (admin):** 38px x 22px pill, navy when on, Hairline when off, 18px white knob sliding 16px.

### Navigation
- **Public navbar:** fixed and blurred (`backdrop-blur-md`). Over the hero: 18% paper wash, white text. After 50px of scroll: 95% Warm Paper, navy text, navy shadow, vertical padding 20px to 16px; all over 300ms. Links are mono 11px uppercase 0.22em at 90% opacity with a 1px underline that scales in from the left on hover (300ms). Brand is italic Fraunces 22px over a 9px mono subline.
- **Admin sidebar:** 236px navy column; links are 13.5px/500 at 75% opacity with a 16px icon, 6px radius; hover fills Night Harbour; the active link inverts to white with navy text.
- **Footer:** navy, 96px top padding, four columns from `lg` (1.6fr/1fr/1fr/1fr), mono column titles, `slate-300` links that turn Sand (`secondary-fixed`) on hover.

### Overlays
- **Dialog:** centered, max 480px, 12px radius, Warm Paper, 24px padding, editorial shadow, over a 40% Inverse Ink backdrop.
- **Select / dropdown menu:** shadcn popups on Warm Paper with a 10% ink ring, 8px radius and `shadow-md`.
- **Toast:** bottom-right, Inverse Ink pill-ish box (8px radius), 14px text, editorial shadow; shows for 1.8s.

### Marquee Ribbon (signature)
A navy band of italic light Fraunces phrases (20px, 26px from `md`) separated by Sand "✦" glyphs, scrolling left continuously over 60s.

### Availability Calendar (signature)
A 7-column grid of 42px cells inside the booking panel. Each free day shows its nightly price in 9px mono under the date. Booked nights are filled Booked Grey with struck-through dates; pending nights use a 55% Sand fill with an ochre dashed underline; changeover days split on the diagonal. Check-in and check-out are navy circles; the range between them is Sand (50% while previewing on hover).

### Motion

Motion is ambient on the public site and almost absent in the admin.

- **Hero photo drift** (`float-bg`): scale 1.05 to 1.14 over 22s, ease-in-out, infinite alternate.
- **Marquee** (`marquee`): translateX to -50% over 60s, linear, infinite.
- **Scroll cue** (`scroll-cue`): a 64px hairline that wipes in from the left and out to the right over 2.4s, ease-in-out, infinite.
- **Image hover:** photographs scale to 1.04 (property) or 1.06 (gallery, also on focus-visible) over 700ms ease-out.
- **State transitions:** navbar and nav underline 300ms; FAQ toggle rotate 300ms; buttons and links use Tailwind's default 150ms color transition; toast slides up 8px and fades over 200ms.
- **Overlays have no enter/exit motion today.** The dialog backdrop and the select and dropdown menu popups carry (the dialog popup itself has no motion classes at all) `data-open:animate-in`, `fade-in-0`, `zoom-in-95`, `slide-in-from-*` and their `animate-out` counterparts, but those utilities come from `tw-animate-css`, which is neither installed nor imported in `globals.css`. They currently generate no CSS, so these overlays appear and disappear instantly.
- **No reduced-motion handling.** No `motion-reduce:` variant or `prefers-reduced-motion` query exists; the infinite hero drift, marquee and scroll cue always run, and `html` has `scroll-behavior: smooth`.

## Do's and Don'ts

### Do:
- **Do** use the theme roles (`primary`, `secondary-container`, `on-surface-variant`, `outline-variant`...) rather than raw OKLCH or Tailwind palette colors; the shadcn aliases already map onto them.
- **Do** set public-site headlines in light Fraunces with one italic word (`italic-display`), and every label, eyebrow and button in uppercase JetBrains Mono with 0.22em to 0.28em tracking.
- **Do** keep public-site buttons, panels and photos square, and reserve full rounding for chips, round icon buttons and the nav reserve pill.
- **Do** keep admin screens on the `components/ui` primitives and `AdminCard` / `StatTile` / `AdminField`, with 8px radii and 13 to 14.5px Inter.
- **Do** use the editorial shadow (navy-tinted) for anything that floats; separate everything else with hairlines and surface steps.
- **Do** show ratings and review counts only from approved back-office reviews (`usePublishedRating`); with none, show nothing or 0, never a placeholder score.

### Don't:
- **Don't** introduce a second accent hue alongside Sand/Ochre.
- **Don't** use neutral black or Tailwind default shadows on the public site.
- **Don't** apply shadcn's rounded defaults to public-site buttons and inputs; override to `rounded-none` as the booking panel does.
- **Don't** rely on `animate-in` / `fade-in-*` / `zoom-in-*` classes for overlay motion until `tw-animate-css` (or equivalent keyframes) is actually loaded.
- **Don't** add `dark:` styling expecting it to work; there are no dark token values.
