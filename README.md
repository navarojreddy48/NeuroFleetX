# TASK: Remove Numbered Section Labels Throughout the Portfolio

I want to remove all small numbered section labels displayed above section headings across my entire portfolio.

Examples of labels to remove:

- 01 / HOME
- 02 / ABOUT
- 03 / TOOLKIT
- 04 / EXPERIENCE
- 05 / EDUCATION
- 06 / PROJECTS
- 07 / CONTACT

These are examples. Find and remove all similar numbered section labels throughout the website.

## Requirements

1. Completely remove the numbered section labels.
2. Remove the associated slash separators and section numbers.
3. Do not replace them with other labels or numbers.
4. Preserve all actual section headings.
5. Preserve all section descriptions and content.
6. Maintain the existing spacing and alignment after removing the labels.
7. Adjust unnecessary top margins or gaps left behind.
8. Apply this consistently across desktop, tablet and mobile layouts.

## Important

Do not remove:
- Main section headings.
- Hero taglines.
- Project numbers used for actual project identification.
- Navigation links.
- Important technical information.
- Project descriptions.
- Other meaningful content.

Only remove the small decorative numbered labels such as `02 / ABOUT`.

## Implementation

- Inspect all relevant React components and section components.
- Search for hardcoded labels and reusable section-label components.
- Remove the labels at their source rather than hiding them with CSS.
- Check all sections for consistency.
- Preserve the existing dark theme, PNR branding, typography, animations and layout.
- Run the production build and fix any errors.

Do not redesign the website. This is a targeted cleanup task.
