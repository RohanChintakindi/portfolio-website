# Design QA

## Comparison target

- Rajan home: `/Users/rohanchintakindi/portfolio-reference-captures/rajan-home-measured.png`
- Rajan writing: `/Users/rohanchintakindi/portfolio-reference-captures/rajan-writing-measured.png`
- Rajan work: `/Users/rohanchintakindi/portfolio-reference-captures/rajan-work-measured.png`
- Implementation home: `/Users/rohanchintakindi/portfolio-reference-captures/qa-home-light-final.png`
- Implementation writing: `/Users/rohanchintakindi/portfolio-reference-captures/qa-writing-empty-final.png`
- Implementation work: `/Users/rohanchintakindi/portfolio-reference-captures/qa-work-compact-final.png`
- Implementation experience: `/Users/rohanchintakindi/portfolio-reference-captures/qa-experience-final.png`
- Implementation background: `/Users/rohanchintakindi/portfolio-reference-captures/qa-background-final.png`
- Combined home comparison: `/Users/rohanchintakindi/portfolio-reference-captures/qa-home-comparison-final.png`
- Combined writing comparison: `/Users/rohanchintakindi/portfolio-reference-captures/qa-writing-comparison-final.png`
- Combined work comparison: `/Users/rohanchintakindi/portfolio-reference-captures/qa-work-comparison-final.png`
- Desktop viewport: approximately 1440 × 900 CSS pixels

## Findings

- No actionable P0, P1, or P2 visual differences remain.
- The home page follows the source's 624px reading column, compact opening, underlined link row, small section labels, and dense linked entries. It intentionally replaces Rajan's notable-work-only home with Rohan's existing experience first, then three existing projects, because professional signal matters most for this portfolio.
- The writing page matches the source's wide minimal header and narrow editorial column. It remains empty because no posts exist; no sample titles or invented writing were added.
- The work page follows the source's four-column desktop grid and restrained text treatment. Its intentional difference is real Devpost media: two working YouTube demos and three Devpost covers for the five projects already present in the portfolio.
- Experience uses separate Current and Earlier groups, stronger role/company hierarchy, and expandable detail panels instead of a flat table. The home page previews four roles and links directly to the dedicated page.
- Background has its own quiet page for education, interests, and skills, keeping it distinct from professional experience.
- Geist Variable, light/dark themes, gray-blue link tones, and slightly stronger heading weight distinguish the implementation without adding decorative UI.
- All professional claims, project descriptions, roles, dates, education, skills, and interests come from the repository's existing portfolio data.

## Interaction evidence

- Home, Writing, Work, Experience, GitHub, and theme controls are keyboard-focusable and visible in Aside's accessibility snapshot.
- Theme control changed `data-theme` from dark to light and updated its accessible label.
- Writing rendered zero post rows when Sanity was unconfigured, as intended.
- The private `/admin` route loaded the authenticated rich-text Studio, exposed only the Post collection, and showed no existing documents.
- The connected public dataset returned an empty post result, so no placeholder article appears on the site.
- Work rendered a four-column grid at desktop width, with two video iframes and three linked images.
- The first experience row uses native `details`/`summary`; its View details label changes to Close when expanded. All ten existing roles are grouped into seven Current and three Earlier entries.
- Aside reported no application errors during the checked home, writing, work, and theme states.

## Responsive review

- The grid collapses from four columns to two below 980px and one below 640px.
- Experience metadata stacks below 980px and becomes left-aligned on small screens.
- The home and article columns retain 20px side gutters on narrow screens.
- Reduced-motion preferences disable nonessential transitions.

## Final checklist

- [x] Reference and implementation reviewed together at the same desktop state.
- [x] Compact homepage includes Experience and Notable Work.
- [x] Work, Experience, and Background are separate destinations.
- [x] Devpost project media uses real source assets.
- [x] Writing remains empty until the owner publishes.
- [x] Private on-site editor supports drafts, rich text, cover images, inline images, and publishing.
- [x] Light and dark themes work.
- [x] Production build passes.
- [x] Active source files pass ESLint.

final result: passed
