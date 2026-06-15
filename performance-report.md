# Website Performance Optimization Report

Date: 2026-06-15

## Summary

The site was optimized by converting heavy referenced media to WebP, removing unused media assets, switching pages to minified CSS/JS, enabling native lazy image loading, and removing unused external image preconnect/background references.

## Overall Size

| Area | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| Full project folder | 91,380 KB | 4,672 KB | 94.9% |
| Assets folder | 91,020 KB | 4,156 KB | 95.4% |
| CSS served | 167,999 bytes | 137,489 bytes | 18.2% |
| JS served | 27,255 bytes | 24,221 bytes | 11.1% |

## Biggest Image Wins

| Asset | Before | After |
| --- | ---: | ---: |
| what-i-do-strategy | 14,483,299 bytes | 30,816 bytes |
| what-i-do-masterclass | 13,168,121 bytes | 163,238 bytes |
| what-i-do-community | 12,400,371 bytes | 180,656 bytes |
| person-runner | 12,208,355 bytes | 156,968 bytes |
| person-photography | 5,902,629 bytes | 173,682 bytes |
| blog-seo-geo-aeo | 4,905,952 bytes | 81,020 bytes |
| person-animal-lover | 3,768,049 bytes | 212,862 bytes |
| blog-collaborative-content | 2,984,216 bytes | 196,258 bytes |
| blog-cmo-blind-spot | 2,845,525 bytes | 127,202 bytes |
| blog-job-market-bookshop | 2,838,341 bytes | 282,298 bytes |

## Changes Made

- Converted referenced JPG/PNG images to WebP where WebP was smaller.
- Kept small PNG/WebP originals when they were smaller than generated WebP.
- Removed unreferenced media assets and old replaced originals.
- Added `loading="lazy"` and `decoding="async"` to image elements.
- Created and served `styles.min.css?v=perf-2`.
- Created and served `script.min.js?v=perf-2`.
- Removed unused external Unsplash background references from CSS.
- Removed unused external preconnect from the home page.
- Confirmed no custom web-font payload is being loaded; the site uses local system font stacks.

## Verification

Checked these routes on localhost:

- `/index.html`
- `/blogs.html?category=marketing`
- `/about/`
- `/strategy/`
- `/masterclasses/`
- `/admin.html`

Result:

- No broken images found.
- No console errors found.
- Optimized CSS/JS files load on all checked routes.
- Blog category filtering still works with the minified script.
