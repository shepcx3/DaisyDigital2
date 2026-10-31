# daisy digital ✿ v2

*creative by nature.* The website for Daisy Digital (social media, content, strategy and consulting), rebuilt around one visual system:

**daisy ✿ + browser window ▭ + sparkle ✦**, linked by dashed "scroll" lines.

It's a static site (HTML, CSS and JS, no build step).

| File | What it is |
|---|---|
| `index.html` | the website: about (scrapbook collage), our work, the girls, contact, we're growing, DMs footer |
| `brand.html` | brand guide: logo suite, colours, type, icons, sticker sheet, cursors, characters, voice, screens, email signature |
| `404.html` / `thanks.html` | "lost in the scroll" error page and the thank-you page after a form is sent |
| `styles.css` | the whole design system (colours, fonts and cursors are set at the top) |
| `script.js` | glitter, motion toggle, pixel characters, bee, garden, forms, easter eggs |
| `assets/` | `daisy.svg`, `favicon.svg`, `monogram.svg`, `icons.svg` (the icon set) |

## Run locally

```bash
python3 -m http.server 5174
```

Then open http://localhost:5174.

## Before launch

1. **Email:** set `CONTACT_EMAIL` in `script.js` to the real inbox.
2. **Forms:** create a form at [formspree.io](https://formspree.io) and paste its URL into `FORM_ENDPOINT` in `script.js`.
   Resume uploads need a Formspree plan that supports files. Until this is set, the contact form opens the visitor's
   email app, and the join form asks people to email their resume.
3. **Hosting:** in GitHub go to Settings → Pages → Deploy from branch → `main` / root.
   `404.html` assumes the site lives at `/DaisyDigital2/`. If you add a custom domain, change those paths to `/`.
4. **Photos:** the polaroids are placeholders. Swap in real photos as `<img class="photo-fx">` inside `.photo`
   to get the flash-photo treatment.

## Easter eggs

- Type ↑ ↑ ↓ ↓ ← → ← → B A for sparkle mode.
- There are three hidden daisies to find (in our work, the girls, and the footer).
- Hover the DD logo for a hint.
