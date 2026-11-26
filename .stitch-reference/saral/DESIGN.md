# SARAL: design system extracted from Stitch

Source: Stitch project "SARAL Civic Platform Redesign" (571215184961173982), design system
"Dignified Civic Editorial", plus the 9 desktop screens in `screenshots/` and `html/`.
Everything below comes from those files. Where screens disagree, the note says which one is followed.

## Reference quality

| # | Screen | File | Render |
|---|---|---|---|
| 1 | Home & RTI Drafting Hero | 01-home-rti-drafting-hero | Fully styled |
| 2 | Citizen Dashboard | 02-citizen-dashboard | Fully styled |
| 3 | Why Every Citizen Needs RTI | 03-why-every-citizen-needs-rti | Fully styled |
| 4 | Statutory Inquiry & Support | 04-statutory-inquiry-support | Fully styled (Inter body) |
| 5 | Track RTI Application Lifecycle | 05-track-rti-application-lifecycle | Fully styled (warm-paper variant) |
| 6 | Know Your Rights & Laws | 06-know-your-rights-laws | Fully styled (Inter body) |
| 7 | How It Works | 07-how-it-works | Partly unstyled in Stitch's own render |
| 8 | About SARAL & Comparative Analysis | 08-about-saral-comparative-analysis | Partly unstyled |
| 9 | Rights, Laws & PIO Directory | 09-rights-laws-pio-directory | Partly unstyled |

Screens 7 to 9 contribute content and structure only. Their visual treatment follows screens 1 to 6.

## Colour

Petrol slate `#1e3a42` is the one colour present in all 9 screens.

| Role | Value | Where it is used |
|---|---|---|
| Primary (ink and anchor) | `#05242c` | Logo tile, primary button, active filter, headings |
| Primary container | `#1e3a42` | Dark bands (dashboard header, quote panel, hero card footer), active nav on screens 4–9 |
| Primary hover | `#162e35` | Hover on the primary button |
| Surface tint | `#47636b` | Italic second line of the hero h1, secondary text on dark |
| Secondary (terracotta) | `#9d4413`, accent `#c86432` | Urgent CTA ("Draft New RTI Online"), section markers, Hindi motto line, stat accent (94.8%) |
| Secondary fixed | `#ffdbcc` | "RTI ACT 2005" and "DigiLocker" chip fills |
| Tertiary (forest) | `#2a473e` / `#1e3b32`, fixed `#c9eadd` | Verified, paid and complete states |
| Error | `#ba1a1a` | Notification count |

Surfaces (screens 1 to 3; screens 4 and 6 are the same cool family):

| Token | Value |
|---|---|
| background / surface | `#f5faff` |
| surface-container-lowest (cards) | `#ffffff` |
| surface-container-low | `#eaf5fd` |
| surface-container | `#e5eff8` |
| surface-container-high | `#dfeaf2` |
| surface-container-highest | `#d9e4ec` |
| on-surface (text) | `#131d23` |
| on-surface-variant (secondary text) | `#42484a` |
| outline / outline-variant | `#72787a` / `#c1c7ca` (often at 40% opacity) |

Screen 5 uses a warm-paper variant instead (`#fbfbfa`, `#f1eee4`, `#e5e2d8` borders). The design-system prose also
describes parchment (`#F7F4EE`, `#FBF9F5`, `#EFECE3`, `#DCD6C8`). The implementation follows the cool surfaces that
six of the nine screens render.

Status chips (from the design system):

| Chip | Background | Text | Border |
|---|---|---|---|
| Verified / DigiLocker | `#EAEFEA` | `#2A473E` | `#C2D6C5` |
| Pending / time clock | `#F8EDE6` | `#B35424` | `#EACBB8` |
| Info / Act section | `#EBEFF0` | `#1E3A42` | `#CBD7DA` |

## Typography

- **Headings:** Source Serif 4 at 600. Used in every screen.
- **Body and UI:** Plus Jakarta Sans 400, 500, 600 and 700. This is the design system's font, used on screens 1, 2, 3 and 5. Screens 4 and 6 to 9 use Inter instead.
- **Icons:** Material Symbols Outlined in the HTML. The app keeps lucide-react, which has the same outlined line style.

| Token | Size / line height | Weight | Tracking |
|---|---|---|---|
| display-lg | 44 / 54 | 600 serif | −0.02em |
| display-lg-mobile | 32 / 40 | 600 serif | −0.01em |
| headline-lg | 30 / 38 | 600 serif | −0.01em |
| headline-md | 24 / 32 | 600 serif | |
| headline-sm | 20 / 28 | 600 serif | |
| stat-counter | 36 / 40 | 700 serif | tabular figures |
| title-md | 16 / 24 | 600 sans | 0.01em |
| body-lg | 17 / 28 | 400 sans | |
| body-md | 15 / 24 | 400 sans | |
| body-sm | 13 / 20 | 400 sans | |
| label-caps | 11 / 16 | 700 sans | 0.06em, uppercase |

- **Hero h1:** the second line is italic serif in `#47636b` ("Track it until you get a reply").
- **Hindi lines:** sit beside or under English titles at the same optical size.

## Spacing and layout

- **Container and margins:** max width 1280px (`max-w-7xl`); page margin 1rem on mobile and 2rem on desktop.
- **Gutters:** 1.5rem, or 1rem on mobile.
- **Spacing scale:** 4, 8, 16, 24 and 40px (`space-xs` to `space-xl`).
- **Header:** 80px tall (`h-20`) on `surface/95`, with a faint `0 1px 8px rgba(0,0,0,.04)` shadow.

## Shape and elevation

- **Radius:**
  - 4px on badges, nav items and icon tiles
  - 6 to 8px on cards, inputs and buttons
  - full pills only on status dots, step numbers and filter tabs
- **Borders:** 1px hairlines in `outline-variant` at about 40% opacity.
- **Shadow:** `shadow-sm` on cards. Floating panels (the hero gazette card) use a soft neutral shadow, never coloured.

## Reusable patterns

1. **Header.** A square logo tile in primary, then "SARAL" in serif with a boxed "RTI 2005" label tag and the "Simplifying Right to Information" subline.
   - Nav links are `body-sm` in on-surface-variant.
   - The active link is either a `surface-container` fill with primary semibold text (screens 1–3) or a solid `#1e3a42` fill with white text (screens 4–9).
2. **Buttons.**
   - Primary: `#05242c` fill, white text, trailing arrow, 6px radius.
   - Secondary: `surface-container` fill, primary text, leading icon.
   - Urgent: terracotta `#9d4413` fill.
   - White on dark: white fill with primary text, used on dark bands.
3. **Chips.** `label-caps` with a leading icon and a 4px radius, in the three status tones above.
4. **Gazette card** (hero). A white sheet with a 4px top rule shading from primary to terracotta.
   - Tracked "OFFICIAL GAZETTE FORMAT" label and a mono reference ID chip.
   - "To PIO" block on `surface-container-low`, then numbered items with round number badges.
   - Footer row: fee chip and an hourglass deadline. A dark `#1e3a42` caption bar closes the card.
5. **Feature card.** White on `surface-container-low`, with a 48px square icon tile in primary, primary-container or secondary, a serif `headline-sm` title and `body-sm` copy.
6. **Stat strip.** A `surface-container` band: an icon tile with title and caption on the left, and serif `stat-counter` figures with `label-caps` captions on the right, separated by hairlines.
7. **Dark band.** A `#1e3a42` panel with a white serif headline, `#87a4ad`-ish body text and a large monument icon watermarked at about 8% opacity.
8. **Stat card** (dashboard). A white card with a label, a 32px icon tile at top right on `surface-container`, a serif number and a `body-sm` caption.
9. **Ledger table.** A `label-caps` header row on `surface-container-low`, white rows and a footer strip on `surface-container-low`.
10. **Quote panel** (screen 3). A dark `#1e3a42` card with a serif quote, a terracotta short rule and label-caps citation lines.
11. **Domain card** (screen 3). An icon tile, a coloured department chip at top right, a sans title with a Hindi subtitle, body text, and a label-caps footer link with an arrow.
12. **Footer.** Two lines (Act name; DoPT line) on the left and quiet links with a "Helpdesk 1800-RTI-SARAL" end item on the right, on `surface-container-low` with a top hairline.
