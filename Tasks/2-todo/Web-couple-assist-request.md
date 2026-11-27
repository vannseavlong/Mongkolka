# Web-couple-assist-request

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new card on the profile screen, calls new API (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/assist-request/` · **Branch:** `feat/assist-request`
- **Started / updated:** - / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** Web-profile-enhance (profile layout slot); API-assist-requests (use typed mock `// MOCK: API-assist-requests` until merged)
- **Touches:** apps/couple/src/features/assist/ (new: data/assist-api.ts, lib/assist-state.ts, components/assist-card.tsx), one line in features/profile/index.tsx

## Goal
Profile has an 'Ask Mongkolka to help' card: send a request with a note, see its state (pending, approved until <date>, declined with reason, ended), cancel while pending, revoke while approved, and see recent help activity.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [ ] States: none, pending, approved (expiry + Revoke), declined (reason), revoked/expired; loading, error
- [ ] Note field 5-500 chars with counter; double submit prevented
- [ ] Revoke asks for confirmation and says access ends at once
- [ ] Activity list shows last 20 entries (time, what, 'Mongkolka admin')
- [ ] State derivation is a pure function with tests
- [ ] 360px check; mock removed before merge
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
