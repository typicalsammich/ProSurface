# ProSurface Performance Courts

A premium React 19, Next.js 16, TypeScript and Three.js website, ready for a GitHub repository and Vercel deployment.

## Start locally

Use Node.js 22 (22.13 or newer) and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production check:

```sh
npm run typecheck
npm run build
npm start
```

## Put it on GitHub

1. Extract the ZIP.
2. Create a GitHub repository.
3. Upload the **contents** of the extracted `prosurface` folder so `package.json`, `app`, and `public` are at the repository root. Include `.gitignore`, `.env.example`, and `.github` if your file browser hides dotfiles.
4. Do not upload the ZIP itself as the website source, `node_modules`, or `.next`.

Alternatively, open a terminal inside the extracted folder, initialize Git, commit the source, add your GitHub repository as the origin, and push. The included GitHub Actions workflow checks TypeScript and builds pull requests and pushes to main.

## Deploy on Vercel

1. In Vercel, choose Add New > Project and import the GitHub repository.
2. Framework preset: **Next.js**. Root directory: the folder containing `package.json` (normally `./`).
3. Use the included configuration: install `npm ci`, build `npm run build`, default Next.js output settings, Node.js 22.
4. Deploy. No API key, database, or paid asset service is required by the website.
5. When your final domain is connected, add `SITE_URL` with the full HTTPS origin to the **Production** environment, then redeploy. Leave it unset for previews.

This ZIP is deployment-ready source; it does not create a GitHub repository or publish a Vercel project by itself. Official guides: https://vercel.com/docs/git/vercel-for-github and https://vercel.com/docs/frameworks/full-stack/nextjs.

## What is included

- A transparent center-court logo reveal; the camera rises and rotates into the orientation of the real overhead project photograph, which settles into the hero before the copy appears.
- An interactive court studio with daylight sky, textured lawn, pathways, landscape planting, photographic oak foliage, fences, hoops, nets, seating and lighting.
- Click to enter at player height, drag or use arrow keys to look, and Escape or Aerial view to return.
- Four preset palettes and custom surface/accent/surround color controls.
- An editorial five-project gallery with thumbnails, keyboard navigation, swipe support and an expanded photograph view.
- Draggable before/after comparison: Before left, After right, plus keyboard and separate slider controls.
- Refined project inquiry, controlled anchor scrolling, reading progress, pointer styling, animated FAQs and reduced-motion support.
- Responsive phone/tablet/desktop layouts, semantic content, metadata, Open Graph, Organization/Service structured data, robots.txt and sitemap.xml.

## Business content and inquiries

Verified details supplied for the project: ProSurface Performance Courts; (903) 732-7124; Dallas–Fort Worth and beyond; athletic court construction and resurfacing; specialty epoxy coatings; stained and sealed concrete; Certified SportMaster installer.

The inquiry opens an SMS **draft** containing the selected sport, palette and project details. Visitors review and send in their own messaging app. Direct calling and copying the brief are also available. No email, CRM, payment, or automatic form-submission backend is connected.

## SEO launch settings

Until `SITE_URL` contains the final public HTTPS origin, pages have `noindex` and the sitemap stays empty. Setting it and rebuilding enables a canonical URL, absolute social images, organization/logo URLs and the sitemap. Vercel Preview deployments remain noindex even if the variable is inherited.

Add the confirmed Google Business Profile URL and other official profiles to Organization `sameAs` in `lib/site-config.ts` when available. Add a public physical address or business hours only when verified and appropriate for the business. No address, reviews, ratings, invented project locations or unsupported promises are included.

After launch, verify the property in Google Search Console, submit `/sitemap.xml`, test the live URL's structured data, and link the website from the verified business profile. Source guidance: https://developers.google.com/search/docs/appearance/structured-data/organization. Search rankings are not guaranteed.

## Where to edit

- `app/page.tsx`: main page and section content.
- `app/globals.css`: visual system and responsive styling.
- `components/prosurface/project-gallery.tsx`: gallery collection and interactions.
- `components/prosurface/court-experience.tsx`: 3D environment and court camera.
- `components/prosurface/opening-film.tsx`: introduction and photograph handoff.
- `components/prosurface/project-inquiry.tsx`: inquiry interface and SMS brief.
- `components/prosurface/local-details.tsx`: DFW section and FAQ copy.
- `lib/site-config.ts`: metadata and structured business details.
- `public/images`: supplied photos and project assets.

The court studio is an illustrative design experience, not a construction drawing. Trees use camera-facing photographic cutouts for efficient mobile rendering, rather than scanned volumetric trees. Supplied project photos are relatively low resolution; high-resolution originals would improve large-screen detail. Asset provenance and generation prompts are in `ASSET_NOTES.md`.

## Validation and portability

The project passed a standard Next.js production build and TypeScript check. Browser checks cover desktop/mobile gallery layouts, the logo introduction, player-height scene, comparison interaction, FAQ animation, color controls, inquiry and overflow. Real phone hardware and a live Vercel deployment still need launch checks.

The export excludes local preview tooling, hosting registration, caches, installed dependencies, build output and local secrets. The original editing workspace also supports a legacy local studio preview, but this release uses standard Next.js commands for Vercel.
