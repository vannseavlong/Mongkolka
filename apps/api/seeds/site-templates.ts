const defaultComponents = {
  hero: "hero_classic",
  story: "story_classic",
  gallery: "gallery_grid",
  details: "details_classic",
  rsvp: "rsvp_classic",
  registry: "registry_classic",
  timeline: "timeline_classic",
  music: "music_classic",
};

export default {
  site_templates: [
    {
      template_id: "botanical_romance",
      name: "Botanical Romance",
      default_theme: {
        bg_color: "#fff8f5",
        text_color: "#3a2e2e",
        accent_color: "#c9a35c",
        font_style: "serif",
      },
      default_components: { opening: "opening_envelope", ...defaultComponents },
      status: "active",
    },
    {
      template_id: "modern_minimal",
      name: "Modern Minimal",
      default_theme: {
        bg_color: "#ffffff",
        text_color: "#111111",
        accent_color: "#111111",
        font_style: "sans",
      },
      default_components: { opening: "opening_curtain", ...defaultComponents },
      status: "active",
    },
  ],
};
