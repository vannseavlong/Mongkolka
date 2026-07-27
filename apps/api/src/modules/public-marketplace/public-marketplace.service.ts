import { VendorsModel } from "../vendors/vendors.model.js";
import { VendorsService } from "../vendors/vendors.service.js";
import { VendorCategoriesService } from "../vendor-categories/vendor-categories.service.js";
import { VendorProfileService } from "../vendor-profile/vendor-profile.service.js";
import { VendorPortfolioService } from "../vendor-portfolio/vendor-portfolio.service.js";
import { VendorServicesService } from "../vendor-services/vendor-services.service.js";
import { SiteTemplatesService } from "../site-templates/site-templates.service.js";

export interface ListVendorsInput {
  categoryId?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export const PublicMarketplaceService = {
  async listCategories() {
    const categories = await VendorCategoriesService.list();
    return categories.filter((c) => c.active !== false);
  },

  async listVendors({ categoryId, search, page, pageSize }: ListVendorsInput) {
    const all = await VendorsService.listVendors("active", categoryId);
    const term = search?.trim().toLowerCase();
    const filtered = term
      ? all.filter((v) => {
          const name = String(v.business_name ?? "").toLowerCase();
          const location = String(v.location ?? "").toLowerCase();
          return name.includes(term) || location.includes(term);
        })
      : all;

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const vendors = filtered.slice(start, start + pageSize);

    return { vendors, total, page, pageSize };
  },

  async getVendor(vendorId: string) {
    const vendor = await VendorsModel.findById(vendorId);
    if (!vendor || vendor.status !== "active") return null;

    const actorSheetId = vendor.actor_sheet_id as string;
    const [profile, portfolio, services] = await Promise.all([
      VendorProfileService.get(vendorId, actorSheetId),
      VendorPortfolioService.list(actorSheetId),
      VendorServicesService.list(actorSheetId),
    ]);

    return { vendor: profile, portfolio, services };
  },

  listTemplates() {
    return SiteTemplatesService.list("active");
  },
};
