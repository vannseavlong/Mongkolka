"use client";

import type { CoupleInfo, DetailsContent, Theme } from "../../types";
import { DetailsKhmer } from "../khmer/Details";

export interface DetailsSkinProps {
  couple: CoupleInfo;
  theme: Theme;
  content?: DetailsContent;
}

/**
 * Ceremony, reception, venue photo, dress code and a map button on the active skin's card, headed
 * "Event Details". It is the shared location block with the standard heading; the skin's ornaments
 * do the rest, so every template looks like itself.
 */
export function DetailsSkin(props: DetailsSkinProps) {
  return <DetailsKhmer {...props} headingKey="section.details.heading" />;
}
