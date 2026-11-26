import {
  Camera,
  Flower2,
  Gem,
  LayoutTemplate,
  Palette,
  PenLine,
  Store,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

/** Stock photo helper (Unsplash CDN). Width keeps the payload small per slot. */
export function photo(id: string, width: number): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;
}

export const IMAGES = {
  heroMain: "1583939003579-730e3918a45a",
  heroSide: "1537633552985-df8429e8048b",
  heroRings: "1465495976277-4387d4b0b4c6",
  story: "1522673607200-164d1b6ce486",
  ctaBackdrop: "1532712938310-34cb3982ef74",
  venue: "1469371670807-013ccf25f16a",
  tableDecor: "1519225421980-715cb0215aed",
  florals: "1529636798458-92182e662485",
  photography: "1606216794074-735e91aa2c92",
  reception: "1511795409834-ef04bbd61622",
  mood: "1460978812857-470ed1c77af0",
  chairs: "1522673607200-164d1b6ce486",
  bouquet: "1519741497674-611481863552",
  signage: "1507504031003-b417219a0fde",
} as const;

export const STATS = [
  { value: "100%", label: "Free to start" },
  { value: "12+", label: "Wedding site templates" },
  { value: "6", label: "Planning tools in one place" },
  { value: "KH · EN", label: "Khmer and English" },
] as const;

export const STEPS: { title: string; description: string }[] = [
  {
    title: "Create your space",
    description: "Sign up free, invite your partner, and set the date. Everything is shared from day one.",
  },
  {
    title: "Plan with confidence",
    description: "Track guests, budget and your checklist while a countdown keeps the big day in sight.",
  },
  {
    title: "Share your website",
    description: "Pick a template, make it yours, and send one link for the story, schedule and RSVP.",
  },
];

export const FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: PenLine,
    title: "Smart planning tools",
    description: "Guests, budget, checklist and countdown milestones, shared with your partner.",
  },
  {
    icon: Palette,
    title: "Digital wedding websites",
    description: "Pick a template, adjust the colours, and share your story with the people you love.",
  },
  {
    icon: Store,
    title: "Vendor marketplace",
    description: "Discover photographers, venues, salons and more from trusted local vendors.",
  },
  {
    icon: LayoutTemplate,
    title: "Flexible templates",
    description: "Every section can be changed, so your site looks exactly the way you imagine.",
  },
];

export const STORY_POINTS = [
  "Made for Cambodian weddings, with Khmer and English side by side",
  "Free for couples, simple for vendors to join",
  "One link for your guests: story, schedule, photos and RSVP",
] as const;

export const CATEGORIES: { icon: LucideIcon; label: string; image: string }[] = [
  { icon: Camera, label: "Photography", image: IMAGES.photography },
  { icon: Gem, label: "Venues", image: IMAGES.venue },
  { icon: Flower2, label: "Florals", image: IMAGES.florals },
  { icon: UtensilsCrossed, label: "Catering & decor", image: IMAGES.tableDecor },
];

export const SHOWCASE = [
  { id: IMAGES.bouquet, alt: "A bride holding a bouquet in warm light", span: "md:row-span-2" },
  { id: IMAGES.reception, alt: "A reception table with colourful flowers", span: "" },
  { id: IMAGES.mood, alt: "A couple's veil caught in the wind", span: "md:row-span-2" },
  { id: IMAGES.signage, alt: "A rustic Mr and Mrs wedding sign", span: "" },
  { id: IMAGES.venue, alt: "A garden wedding aisle lined with roses", span: "" },
  { id: IMAGES.tableDecor, alt: "A long wedding table with wildflower centrepieces", span: "" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "Planning felt overwhelming until we found Mongkolka. The checklist and budget tracker kept us on track from day one.",
    name: "Sophea & Dara",
    detail: "Phnom Penh",
    avatar: IMAGES.heroSide,
  },
  {
    quote:
      "Our wedding website was ready in an afternoon, and it looked exactly how we imagined. Guests loved the RSVP page.",
    name: "Chenda & Vibol",
    detail: "Siem Reap",
    avatar: IMAGES.heroMain,
  },
  {
    quote:
      "We found our photographer through the marketplace and booked within a week. So much easier than searching around.",
    name: "Srey Leak & Panha",
    detail: "Battambang",
    avatar: IMAGES.photography,
  },
] as const;

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Is Mongkolka really free for couples?",
    a: "Yes. You can start planning and build your wedding website for free.",
  },
  {
    q: "Can my guests read the website in Khmer?",
    a: "Yes. Templates support Khmer and English, so every guest can follow along.",
  },
  {
    q: "Can I plan together with my partner?",
    a: "Invite your partner and you both see the same guests, budget and checklist.",
  },
  {
    q: "I run a wedding business. How do I join?",
    a: "Use the “List your business” button to create a vendor profile that couples can find in the marketplace.",
  },
];

