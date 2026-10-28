# Plan: Website builder redesign (templates, section variants, assets, theme)

Written by the task-planner skill, 2026-10-28. Nothing built yet.

## Goal
Make the couple's website builder useful and friendly:
1. **Section variants with live preview.** Each section shows how it looks with the couple's own data, and the couple browses and switches between its variants visually.
2. **Templates as named bundles.** A template is a named group of sections (default variants + theme) the couple can apply, then override section by section. Every template has a public live preview at `<template-slug>.<root-domain>` (e.g. `green-blue-sky.mongkolka.com`).
3. **Per-section assets and theme.** The couple uploads and deletes images in an asset library, assigns them to sections, picks a color theme for the whole site, and can override the colors of a single section.

## Flow (exists / change / new)

| # | Step | State |
|---|---|---|
| 1 | Visitor browses `/templates`, opens a template preview at `/templates/[id]` with sample data | exists (`apps/web/src/app/templates`) |
| 2 | Visitor opens `green-blue-sky.<root>` and sees the same template as a real site, with sample data | **new** (proxy + preview route) |
| 3 | Couple opens Website builder, sees template gallery with name, palette, preview link | change (`template-picker.tsx` is a color-swatch card only) |
| 4 | Couple applies a template; chooses what happens to their existing overrides | **new** (today `selectTemplate` keeps all overrides and only adds missing sections) |
| 5 | Couple edits one section: list on the left, live canvas of the real site, section panel | change (today: flat list, 128px thumbnail, `Select`) |
| 6 | In the section panel the couple opens "Change style" and sees every variant of that section rendered with their data, picks one | **new** (variants exist in `registry.ts`, just not browsable) |
| 7 | Couple uploads images to the asset library, picks them for gallery/hero/etc., deletes unused ones | **new** (today photos are typed as raw URLs; no couple upload endpoint) |
| 8 | Couple picks a site-wide palette (presets + custom) and optionally overrides one section's colors | change (`theme-editor.tsx` has 3 color inputs + font select; `section-color-popover.tsx` exists) |
| 9 | Couple publishes; public site renders via the same `SiteRenderer` | exists |

## Screens and states
- **Template gallery** (couple + public): card with live thumbnail, name, palette, "Preview" (opens subdomain), "Use this template". States: loading, empty, inactive hidden, currently selected, applying.
- **Apply dialog**: choose "Keep my text and photos, reset styles" (default) or "Start fresh from the template". Shows what will change.
- **Builder workspace**: section rail (reorder, enable switch), live canvas (desktop / mobile toggle, scrolls to selected section), section panel with tabs **Style** (variant browser), **Content**, **Assets**, **Colors**.
- **Variant browser**: grid of live previews for one section, current one marked, "Template default" marked, one-click apply, optimistic update. States: loading catalog, one variant only, inactive hidden.
- **Asset library**: grid, drag-drop / multi-select upload with progress, delete with "in use by X" warning, empty, error, over-quota.
- **Theme panel**: preset palettes, custom colors, font; "reset to template"; per-section override with "use site theme" reset.

## Data and API
- **Assets (new, couple sheet):** `website_assets` table (`asset_id`, `url`, `storage_key`, `mime`, `size_bytes`, `width`, `height`, `created_at`). Endpoints under `/couple/api/website/assets`: `GET` list, `POST` upload (multipart, reuse `ALLOWED_MIME` and the `photoStorage()` driver), `DELETE /:id`, `GET /:id/usage`. Sections reference assets by URL inside `website_sections.content` (no content shape change, so renderers are untouched).
- **Template catalog (change, admin sheet):** `site_templates` gains `slug` (unique, URL-safe, e.g. `green-blue-sky`), `description`, `status` stays. Public `GET /public/api/site-templates/by-slug/:slug`. Template slugs are **reserved**: couple slug validation rejects them, and template slugs must not collide with existing couple slugs.
- **Apply modes (change):** `POST /couple/api/website/template` accepts `mode: "keep_content" | "reset_all"`. `keep_content` clears `component_id` and `color_override` on all sections and `theme_override`, keeps `content`. `reset_all` also clears `content`.
- **Theme presets:** constant list in `packages/templates` (no API). Whole-site choice still stored in `couple_profile.theme_override`; per-section in `website_sections.color_override`. Cascade code `resolveTheme()` unchanged.
- **Docs to update:** `Docs/backend-schema.md` (`website_assets`, `site_templates.slug/description`), `Docs/tasks/template.md`. Admin app needs a slug/description field (own task). No other team is blocked, so no `Docs/backend-request/` entry.

## Gaps and decisions
| Gap | Decision |
|---|---|
| Applying a template does not reset overrides | Add explicit apply modes; default keeps content, resets styles. |
| Template preview needs its own hostname but `proxy.ts` treats every subdomain as a couple slug | Proxy checks reserved template slugs first (via cached public lookup), rewrites to `/templates/preview/[slug]`. Template slugs are reserved in couple slug validation. |
| Sample data for previews | Reuse `SAMPLE_CONTENT` from `apps/web/.../template-preview.tsx`; move to a shared export so builder and web agree. Never real couple data on public subdomains. |
| Only `opening` has real variety; other sections have 3-5 variants, `gallery` has none for kbach | Not blocking. Browser shows what exists. New variants stay in `Web-more-section-variants` backlog. |
| Gallery content is raw URL strings | Keep the stored shape (`photos: string[]`); the asset picker writes URLs. No migration. |
| S3 driver unverified | Assets task works on `local` driver; `API-s3-storage-verify` must pass before production use of uploads. Noted as release dependency. |
| `ROOT_DOMAIN` is `mongkolka.app` in proxy comments, you wrote `mongkolka.com` | Domain stays an env value (`ROOT_DOMAIN`); no hardcoding. See open questions. |

## Open questions (planning continues; recommended answer used)
1. **Root domain: `mongkolka.com` or `.app`?** Recommend: env-driven; use whatever production DNS has. Needs a wildcard DNS + TLS record for template subdomains (already needed for couple subdomains).
2. **Who names template slugs?** Recommend: admin sets them, color-descriptive like `green-blue-sky`; unique and reserved.
3. **Default apply mode?** Recommend keep content, reset styles, with a confirm dialog.
4. **Asset limits?** Recommend 100 assets per couple, 8 MB each (reuse `PHOTO_DEFAULTS`), jpeg/png/webp/gif only.
5. **Deleting an asset still in use?** Recommend: warn and list sections; if confirmed, remove the URL from those sections' content.

## Task breakdown

| Order | Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|---|
| 1a | `API-website-assets` | apps/api | none | T3 | M |
| 1b | `API-template-catalog-apply` | apps/api | none | T3 | M |
| 1c | `Web-builder-workspace-variants` | apps/couple (+packages/templates) | none | T2 | L |
| 2a | `Admin-template-slug-field` | apps/admin | 1b | T2 | S |
| 2b | `Web-template-preview-subdomain` | apps/web | 1b | T2 | M |
| 3a | `Web-builder-assets` | apps/couple | 1a, 1c | T2 | M |
| 3b | `Web-builder-site-theme` | apps/couple + packages/templates | 1c | T2 | M |
| 3c | `Web-builder-template-apply` | apps/couple | 1b, 1c | T2 | M |
| later | `Web-builder-polish` (backlog) | apps/couple | all | T1 | - |

**Parallel groups:** wave 1 (1a, 1b, 1c) run in parallel, they touch different folders. Wave 2 (2a, 2b) after 1b. Wave 3 (3a, 3b, 3c) after 1c; they all touch `apps/couple/src/features/website`, so 1c must expose a panel/tab slot first and each task adds only its own files, otherwise sequence them.

## Out of scope
Custom domains (`Web-custom-domain-routing`), new section variants (`Web-more-section-variants`), invitation customizer, payments, free-form drag-and-drop layout, per-element text styling.
