export interface VendorCategory {
  category_id: string;
  key: string;
  label_en: string;
  label_kh: string | null;
  icon: string | null;
  active: boolean;
}

export interface VendorListItem {
  vendor_id: string;
  business_name: string | null;
  category_id: string | null;
  location: string | null;
  description: string | null;
  status: string;
}

export interface VendorsListResponse {
  vendors: VendorListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VendorCategoriesResponse {
  categories: VendorCategory[];
}

export interface VendorPortfolioItem {
  item_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
}

export interface VendorService {
  service_id: string;
  name: string;
  description: string | null;
  price: number | null;
  unit: "per_event" | "per_hour" | "package";
}

export interface VendorDetailResponse {
  vendor: VendorListItem & { bio: string | null; service_area: string | null };
  portfolio: VendorPortfolioItem[];
  services: VendorService[];
}
