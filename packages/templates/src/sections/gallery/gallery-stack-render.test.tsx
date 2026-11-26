import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToString } from "react-dom/server";
import { GalleryMasonry } from "./Masonry";
import { GalleryCarousel } from "./Carousel";
import { LanguageProvider } from "../../i18n";
import type { Theme } from "../../types";

const theme = { bg_color: "#fff", text_color: "#000", accent_color: "#c00", font_style: "serif" } as unknown as Theme;
const content = { photos: ["/a.jpg", "/b.jpg"] };

test("a stacked layout hides its heading; the first keeps it", () => {
  const html = renderToString(
    <LanguageProvider>
      <GalleryMasonry theme={theme} content={content} />
      <GalleryCarousel theme={theme} content={content} showHeading={false} />
    </LanguageProvider>,
  );
  assert.equal((html.match(/<h2/g) ?? []).length, 1);
  assert.ok(html.includes("/a.jpg"));
});
