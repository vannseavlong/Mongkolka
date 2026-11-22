# Khmer E-Invitation — Design Reference

Reference pack built from studying **@sambot.online** (36.1K followers, INVITIKA Group), one of Cambodia's leading e-invitation studios. Use it as a spec for upgrading our templates.

> ⚠️ Use as **inspiration only**. Don't copy their illustrations, crests, mascots or branding. Copy the *structure, techniques and quality bar*.

![profile](images/00-sambot-instagram-profile.png)

## Folder map
```
README.md                     ← this file: master checklist, design system, prompts
templates/01..06-*.md         ← full scene-by-scene breakdown of each studied template
images/00-all-templates-contact-sheet.jpg   ← all 6 covers in one image
images/templates/*.jpg        ← cover frame captured from each reel
images/palettes/*.png         ← color swatches per theme + gold gradient
```

![all templates](images/00-all-templates-contact-sheet.jpg)

## Templates studied
| # | Theme | Format | Reel | Plays | Detail |
|---|---|---|---|---|---|
| 01 | Royal Garden (#LilyOfTheValley) | Web | [DFPWxEny8DQ](https://www.instagram.com/reel/DFPWxEny8DQ/) | 246.9K | [md](templates/01-royal-garden-lily-of-the-valley.md) |
| 02 | Fairytale Storybook | 3D video | [C3t8hmHvJ46](https://www.instagram.com/reel/C3t8hmHvJ46/) | 37.4K | [md](templates/02-fairytale-storybook-3d-video.md) |
| 03 | Sakura Romance | 2D video | [C4YEczLvcJO](https://www.instagram.com/reel/C4YEczLvcJO/) | 38.9K | [md](templates/03-sakura-romance-2d-video.md) |
| 04 | Royal Cream & Gold | Web | [DdWbeqrB_oZ](https://www.instagram.com/reel/DdWbeqrB_oZ/) | 1.3K | [md](templates/04-royal-cream-web-heng-theary.md) |
| 05 | Emerald & Gold Kbach Premium | Web | [Df44NmNBwoe](https://www.instagram.com/reel/Df44NmNBwoe/) | 391 (new) | [md](templates/05-emerald-kbach-premium.md) |
| 06 | Kids Dragon Birthday | Web | [Dcv6gmDBqJq](https://www.instagram.com/reel/Dcv6gmDBqJq/) | 931 | [md](templates/06-kids-dragon-birthday.md) |

Other recent reels on the profile (same web format, not analyzed in depth): Lyhour & Daneth, ShuMeng birthday, Sodavith & Socheata, Panha & Raksmey, Kimheang & Phounear, Menghour & Sokchheng.

---

## 1. Key insight
All their templates share **one skeleton**; the theme is a skin. Their premium feel comes from 3 things:
1. **A ceremonial opening** (gate / doors / envelope / book) that the guest taps, which also starts the music.
2. **Constant ambient motion** (petals, butterflies, gold dust, bokeh, rotating emblem).
3. **Full Khmer formality** (both parents' lineage, lunar date, traditional ritual agenda, gratitude + apology letters) combined with modern utility (KHQR, maps, live guestbook).

---

## 2. Master element checklist

### A. Cover / opening
- [ ] Gold monogram crest with couple initials (or Khmer emblem for ceremonies)
- [ ] Khmer greeting line (e.g. សូមគោរពអញ្ជើញ / សូមអញ្ជើញចូលរួមពិធីមង្គលការ)
- [ ] **Personalized guest name** (ភ្ញៀវកិត្តិយស) from URL, e.g. `?to=Mr.%20Dara`
- [ ] Pill CTA: **សូមចុចបើកសំបុត្រ** (or សូមចុចទីនេះដើម្បីចូល / CLICK HERE TO OPEN)
- [ ] Opening animation: gate opens / 3D doors / envelope unfolds / book opens / light-burst
- [ ] Music starts on that tap (mobile browsers block autoplay)

### B. Content sections (in order)
1. [ ] Hero: couple photo in arched/oval floral frame, names in script, date
2. [ ] Formal Khmer invitation — groom's parents LEFT, bride's parents RIGHT, crest center, កូនប្រុសនាម / កូនស្រីនាម
3. [ ] English version of the formal invitation (`Mr. … & Mrs. …`)
4. [ ] Date block: **Khmer lunar** (ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស. ២៥៦៨) + solar date
5. [ ] Countdown: days / hours / min / sec → becomes "Wedding Day" / "Event Started"
6. [ ] Featured video or moving portrait (traditional attire)
7. [ ] Agenda — កម្មវិធីបុណ្យ / EVENT AGENDA — vertical timeline, gold line icon per ritual, grouped by day:
   - ពិធីហែជំនូន (procession / gifts)
   - ពិធីកាត់សក់បង្កក់សិរី (hair-cutting)
   - ពិធីសែនចងដៃ (wrist-tying blessing)
   - ring / tea ceremony, monk blessing
   - ពិធីជប់លៀងពិសាភោជនាហារ (reception)
8. [ ] Location — ទីតាំងកម្មវិធី — illustrated map or venue photo, button ចុចមើលទីតាំង / ភ្ជាប់ទៅទីតាំង, Google Maps QR
9. [ ] Gallery — កម្រងរូបភាព — masonry grid + fullscreen lightbox with swipe
10. [ ] Wedding gift — អំណោយចំណងដៃ — KHQR / ABA / Bakong in gold frame + "copy account number" button (ចុចដើម្បីចម្លងលេខកុង)
11. [ ] Gratitude & apology — សេចក្តីថ្លែងអំណរគុណ និងសូមអភ័យទោស (KH + EN)
12. [ ] Guestbook — សៀវភៅជូនពរ — name + message, button ផ្ញើសារជូនពរ, live feed with timestamps
13. [ ] Footer / credits / socials

### C. Persistent UI
- [ ] Top-right music toggle (spinning vinyl or pulsing sound-wave icon, gold)
- [ ] Bottom glassmorphism dock with gold icons → smooth-scroll to: Invitation, Agenda, Map, Gallery, Gift, Wishes
- [ ] Optional: add-to-calendar, share buttons

### D. Visual system
- [ ] Text on cream "parchment" cards floating over a rich illustrated background
- [ ] Gold Kbach (ក្បាច់) ornaments: corners, dividers, crest
- [ ] Watercolor florals (peony, rose, sakura, hydrangea), doves, butterflies
- [ ] Gold as a gradient + subtle bevel, never one flat color
- [ ] Framing on 4 sides (e.g. blossoms top, flower bed bottom), clean center for text

### E. Motion
- [ ] Ambient particle layer (petals / butterflies / gold dust / bokeh)
- [ ] Section fade + rise on scroll (IntersectionObserver)
- [ ] Light parallax background
- [ ] Rotating 3D emblem / pulsing monogram
- [ ] Lightbox zoom transitions

### F. Audio
- Romantic piano + strings, or a Khmer acoustic love ballad; lullaby for kids; traditional pinpeat-style for ceremonies.

---

## 3. Design system

### Fonts (all on Google Fonts)
| Use | Font |
|---|---|
| Khmer ceremonial headings | **Moul** (or Moulpali) |
| Khmer body | **Battambang** / **Kantumruy Pro** / Siemreap |
| Khmer bold display alt | Koulen |
| Latin names | **Great Vibes** / Pinyon Script / Parisienne |
| Latin labels & dates | **Cinzel** / Cormorant Garamond (caps, letter-spacing) |
| Kids titles | a rounded bubbly display (e.g. Fredoka / Baloo) |

### Gold
![gold](images/palettes/gold-gradient.png)
```css
--gold-grad: linear-gradient(135deg,#F3E5AB 0%,#D4AF37 50%,#A67C2E 100%);
.gold-text{background:var(--gold-grad);-webkit-background-clip:text;color:transparent;
  filter:drop-shadow(0 1px 0 rgba(255,255,255,.4)) drop-shadow(0 2px 2px rgba(80,50,0,.35));}
```

### Theme palettes
| Theme | Swatch |
|---|---|
| Royal Garden | ![](images/palettes/01-royal-garden-palette.png) |
| Fairytale Storybook | ![](images/palettes/02-fairytale-storybook-palette.png) |
| Sakura Romance | ![](images/palettes/03-sakura-romance-palette.png) |
| Royal Cream & Gold | ![](images/palettes/04-royal-cream-web-palette.png) |
| Emerald Kbach Premium | ![](images/palettes/05-emerald-kbach-premium-palette.png) |
| Kids Dragon Birthday | ![](images/palettes/06-kids-dragon-birthday-palette.png) |

---

## 4. Suggested config (JSON) — one skeleton, many skins
```json
{
  "theme": "emerald-kbach",
  "eventType": "wedding",
  "music": "/audio/theme.mp3",
  "guestParam": "to",
  "couple": {
    "groom": {"kh": "ស៊ុន ចន្ថា", "en": "Sun Chantha", "parents": {"father": {"kh":"","en":""}, "mother": {"kh":"","en":""}}},
    "bride": {"kh": "ឆាំ ឆារី", "en": "Chham Chhary", "parents": {"father": {"kh":"","en":""}, "mother": {"kh":"","en":""}}},
    "monogram": "C&C"
  },
  "date": {"iso": "2026-05-29T17:00:00+07:00", "lunarKh": "ថ្ងៃសុក្រ ...", "solarKh": "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦"},
  "venue": {"kh": "", "en": "", "mapUrl": "", "image": ""},
  "agenda": [
    {"day": "2026-05-28", "items": [{"time": "15:00", "kh": "ពិធីសូត្រមន្ត", "en": "Monk blessing", "icon": "monk"}]},
    {"day": "2026-05-29", "items": [
      {"time": "07:00", "kh": "ពិធីហែជំនូន", "en": "Procession", "icon": "procession"},
      {"time": "09:00", "kh": "ពិធីកាត់សក់បង្កក់សិរី", "en": "Hair-cutting", "icon": "scissors"},
      {"time": "11:00", "kh": "ពិធីសែនចងដៃ", "en": "Wrist-tying", "icon": "thread"},
      {"time": "17:00", "kh": "ពិធីជប់លៀង", "en": "Reception", "icon": "dinner"}]}
  ],
  "gallery": ["/img/1.jpg"],
  "video": "",
  "gift": {"khqr": "/img/khqr.png", "accountName": "", "accountNumber": ""},
  "messages": {"gratitudeKh": "", "gratitudeEn": "", "apologyKh": "", "apologyEn": ""}
}
```

---

## 5. Build prompts

### Base prompt (always use, then append ONE theme block)
```
Build a mobile-first (390px) single-page Khmer e-invitation web template in HTML/CSS/JS.
Bilingual Khmer + English. Fonts: Moul (Khmer headings), Battambang (Khmer body),
Great Vibes (Latin names), Cinzel (Latin labels). All content driven by a JSON config.

FLOW:
1. Cover gate: monogram crest with initials, Khmer greeting, personalized guest name from
   URL param ?to=, pill button "សូមចុចបើកសំបុត្រ". On tap: [THEME OPENING ANIMATION],
   then start background music.
2. Hero: couple photo in arched floral frame, names in script, date.
3. Formal Khmer invitation: groom's parents left, bride's parents right, crest center,
   កូនប្រុសនាម / កូនស្រីនាម with names; then English version.
4. Date block with Khmer lunar date line + solar date.
5. Live countdown (days/hours/min/sec) that switches to "Wedding Day" on the day.
6. Vertical agenda timeline grouped by day, gold line icon per ceremony
   (ហែជំនូន, កាត់សក់, សែនចងដៃ, reception).
7. Location: venue image/illustrated map, "ចុចមើលទីតាំង" button to Google Maps, QR.
8. Masonry gallery with fullscreen lightbox + swipe.
9. Gift: KHQR image in gold frame + copy-account-number button with toast.
10. Gratitude & apology note (KH/EN).
11. Guestbook: name + message form, live wishes feed with timestamps.
12. Footer.

PERSISTENT UI: top-right music toggle (spinning disc), bottom glassmorphism nav dock
with gold icons that smooth-scrolls to sections.

MOTION: ambient particle layer (canvas), sections fade+rise on scroll
(IntersectionObserver), subtle background parallax, ornament dividers between sections.
Text sits on cream parchment cards over a rich background. Must feel like luxury foil
stationery. Gold always as gradient #F3E5AB → #D4AF37 → #A67C2E with soft bevel shadow.
```

### Theme blocks
**1. Royal Garden**
```
Palette ivory #FDFBF7, champagne gold #C9A96E, dusty pink #D8A7A7, sage #9CAF88.
Background: illustrated European palace garden with fountain and climbing roses.
Opening: ornate gold wrought-iron gate splits and swings open (CSS 3D) revealing the
fountain court and "Join Us Together Till Eternity". Particles: drifting white petals + doves.
Gold arch-shaped card frames.
```
**2. Fairytale Storybook**
```
Palette baby blue #BFD7EA, royal blue #2F4B8A, white, pastel pink #F4C2C9.
Opening: a storybook cover opens (rotateY page-turn), zooms into a white fairytale castle.
Particles: blue morpho butterflies with flapping wings, light motes, sun rays.
Cards framed with hydrangeas & baby's breath. Gallery as polaroids with flower stickers.
```
**3. Sakura Romance**
```
Palette blush #F7D6E0, lavender #C8B6E2, magenta #C2185B, gold foil.
Opening: gold monogram pulses with a light burst → white flash → misty blossom hallway.
Hanging cherry branches across top, flower bed along bottom. Particles: falling sakura
petals, white butterflies, doves. Khmer headings in gold gradient with bevel.
```
**4. Royal Cream & Gold**
```
Palette cream parchment #F8F1E4, royal gold #C9A04E, champagne #E8D3A2, blush #F2C4C4.
Cover: gold shield monogram, guest-name slot, gold floral border at bottom of card.
Opening: envelope flap unfolds → hero photo in floral oval arch with butterflies.
Spinning vinyl music icon. Watercolor peonies & roses on dividers.
```
**5. Emerald Kbach Premium**
```
Dark theme: emerald #0D2B1D / #081C13 with metallic gold gradient.
Cover: double doors with gold Kbach paneling and Art-Deco pin-stripes.
Opening: doors swing open in 3D perspective, a gold Khmer medallion rotates in with gold
dust. Gold pin-stripe border on every card, Kbach corner ornaments, Moul gold headings.
Lunar date shown prominently. Suits weddings, house blessings, ordinations.
```
**6. Kids Fantasy Birthday**
```
Palette rose #FF6584, berry #C82A62, cream #FFF8F0, mint #BDEBDD, lavender #D9C8F0.
ORIGINAL cute chibi mascots (no licensed characters), pastel castle, clouds, stars.
Bubbly rounded title font. CTA "សូមចុចទីនេះដើម្បីចូល". Countdown + framed baby portrait.
Party timeline instead of ritual agenda. Pink buttons, frosted-white cards.
```

### Background art prompt (Midjourney / Flux / etc.)
```
Vertical 9:16 dreamy illustrated [palace garden with fountain | misty cherry blossom
corridor | dark emerald Khmer temple door with gold kbach carving | pastel fairytale castle],
soft cinematic light, bokeh, watercolor + 3D render blend, empty center space for text,
luxury wedding stationery, no text
```

### Ornament prompt
```
Gold Khmer kbach ornament corner piece, flame and lotus leaf filigree, metallic gold foil,
isolated on transparent background, symmetrical, high detail, vector-like
```

---

## 6. Gap check — why a template feels "not satisfying"
| Symptom | Fix |
|---|---|
| Feels like a plain website | Add ceremonial opening + music on tap |
| Feels static / cheap | Ambient particle layer + scroll reveals |
| Khmer text looks flat | Moul for headings, Battambang body, gold gradient |
| Background boring | Rich illustrated scene, text on parchment cards |
| Not "Khmer" enough | Guest name, lunar date, ritual icons, gratitude + apology letters, Kbach |
| Hard to navigate long page | Bottom glass dock with gold icons |
| Gold looks muddy | Gradient + bevel shadow, never flat #D4AF37 |

---

## 7. Notes on images
- Cover frames in `images/templates/` are the reel thumbnails returned by the analysis tool (180×320, low-res). They show composition and color only.
- For high-res references, screen-record the reels on your phone and export frames.
