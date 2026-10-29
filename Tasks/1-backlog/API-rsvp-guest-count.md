# API-rsvp-guest-count

- **Repo:** apps/api (+ packages/templates, apps/web, apps/couple)
- **Owner:** SNLRLONG
- **Tier:** T2 · new field on a public endpoint and the guests table (auto picker, see `PIPELINE.md`; T3 if it changes the guests schema or personal-data export)
- **Claimed by:** none
- **Depends on:** Web-grace-rsvp-guestbook (merged)
- **Touches:** apps/api public-site RSVP controller/service, schemas/couple/guests.ts, packages/templates RSVP components, apps/web RSVP submit, apps/couple guest list

## Goal
RSVP currently accepts only `{name, attending, plusOne, message}`. The Grace RSVP stepper (1-10 guests) sends `plusOne = guests > 1` and appends a fixed `Guests: N` line to the message. Add an optional structured `guests` integer (1-10) end to end (API validation, guests table column, couple guest list display, templates send it) and stop appending text.

## Done when
- [ ] Endpoint validates `guests` (integer 1-10, optional); older clients keep working
- [ ] Guest list shows the count; totals use it
- [ ] Grace RSVP sends `guests`; the `Guests: N` message line is removed
- [ ] Root `CHANGELOG.md` entry added
