# Web-khqr-gift

- **ID:** T-0048
- **Repo:** packages/templates, apps/api, apps/couple
- **Owner:** SNLRLONG
- **Tier:** T3 · payment/account data (gift bank account number) + new public render of user-supplied image URL (project signal: gift/payment tracking)
- **Claimed by:** none (released, in testing) · was Claude fork, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khqr-gift/` · **Branch:** `feat/khqr-gift` (merged into `feat/khmer-einvite-integration`, local only)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `Tasks/1-backlog/Web-khmer-templates-waves.md` (3b), `khmer-einvite-reference/README.md` (2B-10)
- **Depends on:** Web-khmer-section-keys (done, in integration branch)
- **Touches:** `packages/templates/src/sections/registry/{KhqrGift.tsx,khqr-gift-logic.ts,khqr-gift-strings.ts,khqr-gift.test.ts}`, `registry.ts` (only `registry_khqr`), `types.ts` (RegistryContent), `sample-content.ts`, `apps/api/src/utils/section-content.ts`, `apps/api/tests/khmer-section-content.test.ts`, `apps/api/seeds/section-components.ts`, `apps/couple/.../gift-content-fields.tsx`, `section-content-dialog.tsx`

## Goal
Gift (KHQR) block on the `registry` section: couple's own KHQR image, bank, account name, account number; gold-foil plate with a copy-number button. Display and copy only: no amounts, no collection.

## Contract
- `RegistryContent` gains optional `khqrImageUrl`, `bank`, `accountName`, `accountNumber` (digits, spaces, hyphens). `links` unchanged and still passed through.
- Component id `registry_khqr` (section `registry`), props `{ theme: Theme; content?: RegistryContent }`, returns `null` when there is no image, number or name. Strings are local (`khqr-gift-strings.ts`, EN + KH incl. ចុចដើម្បីចម្លងលេខកុង). Section anchor `id="gift"` (matches the chrome dock's Gift button). Copies digits only; success/failure announced in a polite `role="status"` toast (2.4 s).
- Server: `validateSectionContent("registry", ...)` trims, caps (bank 80, name 120, number 34), https-only image, number must match `^[0-9][0-9 -]*$`, unknown keys dropped. Exposed via the existing `CoupleWebsiteService.updateSection` 400 path.
- Seed row `registry_khqr`, **inactive** (activate with the Khmer templates launch task).

## Gates
- [x] G1 scope (only Touches; `registry.ts` edited for `registry_khqr` only)
- [x] G2 static: `tsc --noEmit` clean in templates, couple, api. ESLint on changed files: only the known missing `@next/next/no-img-element` rule definition (same as other files in the package)
- [x] G3 tests: templates 24/24 (6 new: view mapping, url safety, copy outcomes), api 132/132 (5 new registry validation tests)
- [x] G4 run it: rendered at 390px on a dark (emerald/gold) and a light (ivory) theme in Chrome; layout fits, real click copies and shows the toast and "Copied" state. Temporary harness page and font stub removed.
- [ ] G5 code review (separate agent, strict)
- [x] G6 security (below)  - [x] G7 docs (this file; backend-schema doc unchanged: content is JSON in `website_sections`)
- [ ] G8 commit message ok  - [ ] G9 human review (required, T3)  - [x] G10 plan drafted (below)  - [ ] G11 changelog

## Security review (OWASP Top 10 2021 + diff review)
- A01 Access control: write path is the existing couple-scoped `PATCH /couple/api/website/sections/:id`; no new route. N/A beyond that.
- A02 Crypto/data exposure: the account number is shown publicly by the couple's own choice (it is the point of the feature). Not logged anywhere (no console/log calls in the new code; verified by grep). No secrets in code; the sample number `000 123 456` and sample QR are placeholders (the sample QR is not scannable).
- A03 Injection / XSS: all values render as React text (no `dangerouslySetInnerHTML`). Image goes into `<img src>` only: server accepts https only; the component additionally accepts only https, site-relative `/` and `data:image/*` (never `javascript:`, `//host`, `http:`); tested. SVG inside `<img>` cannot run script.
- A04 Insecure design: no amounts, no payment processing, no money movement. Display and clipboard only.
- A05 Misconfiguration: none touched.
- A06 Components: no new dependency.
- A07 Auth: not touched.
- A08 Integrity: n/a.
- A09 Logging: nothing logged; the validator's error messages never echo the submitted value.
- A10 SSRF: server never fetches the image URL.
- **Findings / residual risk (not fixed here):** (1) any https host is accepted for the QR image, so a couple could point it at a third-party host (visitor IP leak to that host). Library uploads are same-origin storage; recommend restricting to the asset host once its production domain is fixed (needs config; follow-up). (2) A QR that does not match the typed account number cannot be detected server-side; this is the couple's data, show it as theirs. (3) Phishing-style abuse (a couple publishing someone else's account) is a platform-policy matter, not solvable in code here.

## G10 release plan
- **Rollback:** the seed row is inactive and no template uses `registry_khqr` yet, so nothing is visible to guests; revert = remove the registry entry or deactivate the row. API change is additive and only affects registry saves that include the new keys; legacy `links` content passes unchanged.
- **Order:** deploy API first (validation), then couple + web, then seed `registry_khqr` (`lsdb seed seeds/section-components.ts --upsert`) while still inactive. Activation is part of the Khmer templates launch task.
- **Flags/deps:** no new `lsdb sync` columns (content is JSON). Needs the integration branch (section keys + chrome) for the dock's Gift button to point at `#gift`.
- **Monitor:** 400s on `PATCH .../website/sections/:id` after deploy (a spike means the editor and server limits disagree). Owner approves before activation.

## Not verified
Khmer rendering (fonts were stubbed offline; wording needs a native speaker), real-device Safari/iOS clipboard (legacy fallback is untested on iOS), screen-reader pass, couple editor form in a browser (type-checked only; picker reuses the existing `AssetPicker`), tablet/desktop widths, a real scannable KHQR.

## Done when
- [x] Component, validation, editor form, seed row, sample content, tests
- [ ] G5 review and G9 human review
- [ ] Root `CHANGELOG.md` entry (at merge to main); worktree and branch removed after merge

## G10 release order (added by Web-khmer-review-fixes)
- [ ] `lsdb sync --dry-run`, `lsdb sync`, then `lsdb sync --all-users` BEFORE deploying the API (unknown columns are silently dropped)
- [ ] Deploy, then seed with `--upsert`
- [ ] Read back the first saved value of each new column (a 200 does not prove it was stored)
See `docs/backend-schema.md`, "Release order for schema changes".
