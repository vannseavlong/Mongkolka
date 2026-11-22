# 02 — Fairytale Storybook — 3D VIDEO INVITATION

![cover](../images/templates/02-fairytale-storybook-3d-chhary-chantha.jpg)
![palette](../images/palettes/02-fairytale-storybook-palette.png)

- **Source reel:** https://www.instagram.com/reel/C3t8hmHvJ46/ (Chhary & Chantha)
- **Performance:** ~37.4K plays, 1.2K likes (highest likes on the profile, pinned)
- **Type:** 3D animated video invitation, 82s
- **Event:** Wedding — Saturday 02 March 2024, 4:00 PM at the bride's house, Prey Veng Province

> This is a video product, but every scene can be translated into a web section with CSS/JS animation (see notes at the bottom).

---

## Scene-by-scene

### Scene 1 — Enchanted pop-up storybook (0:00–0:10)
- Magical forest with greenery, baby's breath, blue flowers.
- Center: open ornate pop-up storybook on a wooden stand.
  - Left page: blue filigree monogram crest, two framed pre-wedding prints (Western + traditional Khmer attire).
  - Right page: 3D miniature white fairytale castle with flower bushes, topiary, a realistic blue-and-white butterfly on the page edge.
- Camera: slow zoom-in.
- Text: white calligraphy fades in — *"Save The Date"* → couple names.

### Scene 2 — Zoom into the palace (0:10–0:19)
- Camera moves into the pop-up castle world: white neo-classical/baroque architecture, arched columns, floral balconies (pink & blue), blue grand doors, blue butterflies, white doves, clear sky.
- Camera: forward push-in to the entrance arch.
- Text: formal Khmer invitation + English *"You Are Invited"*.

### Scene 3 — Couple & parents reveal (0:19–0:35)
- Palace doors open → grand staircase aisle framed by floral arches + floating butterflies.
- Couple cut-out photo at center (tuxedo + beaded lace gown with white tulips).
- Camera pans to bride: **កូនស្រីនាម** + Khmer name + Latin name + her parents' names.
- Camera pans to groom: **កូនប្រុសនាម** + Khmer name + Latin name + his parents' names.

### Scene 4 — Date, time & venue (0:36–0:50)
- Classical stone altar/shrine with ice-blue florals and floating light motes.
- Couple cut-outs on either side in traditional golden-yellow Khmer attire.
- Khmer: ថ្ងៃទី០២ ខែមីនា ឆ្នាំ២០២៤, វេលាម៉ោង ៤ រសៀល, នៅគេហដ្ឋានខាងស្រី ខេត្តព្រៃវែង.
- English: `Saturday 02 March 2024` / `04:00 PM at the Bride House` / `Prey Veng Province`.

### Scene 5 — Photo gallery (0:51–1:00)
- Polaroid-style framed photos float in one by one, decorated with pink peonies/roses, palace in background.
- Mix of studio (gown/tux) and traditional Khmer silk costumes.

### Scene 6 — Blessing message & return to book (1:00–1:15)
- Wide palace staircase, couple in Western attire, swarming blue butterflies + doves.
- English serif message: *"It would be a pleasure if you could give your prayers and blessing by coming to the wedding day"*.
- Camera zooms back out into the storybook → closing date + names. (Loop structure: starts and ends in the book.)

### Scene 7 — End slate (1:15–1:21)
- Clean white background, vendor logo, tagline, phone.

---

## Design summary
- **Palette:** baby blue, royal blue, pure white, pastel pink; accents soft gold + garden green.
- **Typography:** traditional round Khmer calligraphic font for titles/parents/venue; Latin = high-contrast serif (dates, venue, message) + flowing brush script (names, "Save The Date").
- **Motifs:** 3D pop-up book, fantasy palace, giant blue morpho + white butterflies, white doves, hydrangeas, roses, baby's breath, cherry branches.
- **VFX:** floating petals, sun rays & lens flares, glowing bokeh orbs, animated wing-flaps, depth-of-field.
- **Audio:** gentle romantic orchestral piano + strings.

## Translating to web
- Cover = book closed → tap → CSS 3D `rotateY` page-turn → hero.
- Butterfly layer = sprite/Lottie animation in a fixed canvas.
- Parents reveal = two cards sliding in from left/right on scroll.
- Gallery = polaroid cards with slight random rotation + flower stickers.
