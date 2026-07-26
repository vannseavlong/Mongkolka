export interface VendorProfile {
  vendor_id: string;
  business_name: string | null;
  owner_email: string;
  category_id: string | null;
  location: string | null;
  description: string | null;
  status: "pending" | "active" | "inactive" | "rejected";
  bio: string | null;
  service_area: string | null;
}

export interface VendorCategory {
  category_id: string;
  key: string;
  label_en: string;
  label_kh: string | null;
}

export interface PortfolioItem {
  item_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

export interface Service {
  service_id: string;
  name: string;
  description: string | null;
  price: number | null;
  unit: "per_event" | "per_hour" | "package";
}

export interface Booking {
  booking_id: string;
  couple_id: string;
  service_summary: string | null;
  event_date: string | null;
  amount: number | null;
  status: "inquiry" | "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
}
