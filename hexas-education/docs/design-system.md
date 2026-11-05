# Design direction and reference audit

Reference: https://u-next.com/ inspected 4 November 2026 through live browser desktop and narrow viewport, plus public document structure. No UNext imagery, copy or source was copied.

Observed reference patterns: dark cinematic full-width hero; floating charcoal pill navigation; italic serif alongside modern sans serif; awards following hero; wide recognition carousel; program categories and disclosure rows; career/learning pathways; relationship strip; media spotlight; news; spacious footer. Mobile switches imagery and text proportions, while some reference navigation overflow was observed in this browser session.

HEXA’S adaptation follows the same overall sequence and visual cadence: authentic ceremony hero → legacy strip → achievement carousel → program tabs/disclosures → learning experience → documented relationships → branch explorer → journey → reported results → news → admissions invitation → footer.

## Tokens
- Canvas #08090b; panels #111318; white #f4f2ed; muted #a9abb4.
- HEXA’S blue #2e3192 for selected states and location emphasis; red #ed1c24 for small identity/section markers.
- Sans: Arial/Helvetica system stack. Editorial accent: Georgia italic. Bengali fallback includes Noto Sans Bengali, with Unicode content and language tags.
- Maximum content width 1280px. Desktop horizontal margin 50px; tablet 30px; mobile 20px.
- Section spacing 110 / 80 / 65px; deliberate asymmetry in recognition, programs and story sections.
- Floating navigation radius only, with pill actions and circular arrow controls; content panels otherwise square.

## Motion and accessibility
Motion for React provides brief section entrance and award text transitions; CSS provides image scale, state changes and hover treatments. No autoplay carousel or scroll-jacking. Prefers-reduced-motion disables CSS movement; reveal components avoid forced initial invisibility and respect reduced motion. Essential content is server-rendered. Program tabs have arrow-key navigation. Native details/summary and dialog provide keyboard behavior; lightbox closes with Escape. Click controls replace hover-only menus on touch.

## Content and imagery decisions
All shipped photography comes from the supplied files/ZIP. Ceremony photos are labelled as ceremonies, not classrooms. The trophy is shown in the recognition carousel, with an uncropped version on its detail page. No fabricated facility image, partner logo wall or stock student portrait is used. The diagram in the network section is an abstract connection graphic, not a geographic map. Actual directions link to map searches using sourced addresses.

## Known content gaps
A verified vector logo, contemporary classroom/lab media, leadership biographies, consented student stories/videos, full branch registry, exact five consecutive award years, and approved Bengali translations remain institutional inputs. The bilingual entry route is a concise Bengali introduction; it is not a claimed complete translation.
