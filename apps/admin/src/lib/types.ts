export interface User {
  user_id: string;
  role: "admin" | "couple" | "vendor";
  email: string;
  actor_sheet_id: string | null;
  status: "pending" | "active" | "inactive";
  _created_at: string;
}

export interface Couple {
  couple_id: string;
  actor_sheet_id: string | null;
  partner1_name: string | null;
  partner1_email: string;
  partner2_name: string | null;
  partner2_email: string | null;
  slug: string;
  custom_domain: string | null;
  wedding_date: string | null;
  status: "pending" | "active" | "suspended" | "rejected";
  website_status: "draft" | "published";
}

export interface Vendor {
  vendor_id: string;
  actor_sheet_id: string | null;
  business_name: string | null;
  owner_email: string;
  category_id: string | null;
  location: string | null;
  description: string | null;
  status: "pending" | "active" | "inactive" | "rejected";
}

export interface VendorCategory {
  category_id: string;
  key: string;
  label_en: string;
  label_kh: string | null;
  icon: string | null;
  active: boolean;
}

export const WEBSITE_SECTIONS = [
  "hero",
  "story",
  "gallery",
  "details",
  "rsvp",
  "registry",
  "timeline",
  "music",
] as const;

export type WebsiteSection = (typeof WEBSITE_SECTIONS)[number];

export interface WebsiteTemplate {
  template_id: string;
  section: WebsiteSection;
  name: string;
  preview_bg_color: string | null;
  preview_text_color: string | null;
  preview_accent_color: string | null;
  font_style: string | null;
  status: "active" | "inactive";
}

export interface OverviewStats {
  totalCouples: number;
  totalVendors: number;
  pendingCouples: number;
  pendingVendors: number;
  activeTemplates: number;
}
