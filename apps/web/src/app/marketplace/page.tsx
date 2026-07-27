import Link from "next/link";
import { MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";
import { VendorFilters } from "./vendor-filters";
import type { VendorCategoriesResponse, VendorsListResponse } from "./types";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const category = typeof query.category === "string" ? query.category : undefined;
  const search = typeof query.search === "string" ? query.search : undefined;
  const page = typeof query.page === "string" ? query.page : "1";

  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  params.set("page", page);

  const [categoriesRes, vendorsRes] = await Promise.all([
    fetchJson<VendorCategoriesResponse>("/public/api/vendor-categories"),
    fetchJson<VendorsListResponse>(`/public/api/vendors?${params.toString()}`),
  ]);

  const categories = categoriesRes?.categories ?? [];
  const vendors = vendorsRes?.vendors ?? [];
  const categoryLabel = (categoryId: string | null) =>
    categories.find((c) => c.category_id === categoryId)?.label_en ?? null;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-2 px-6 py-10 sm:px-12">
        <h1 className="text-3xl font-medium tracking-tight">Wedding vendors</h1>
        <p className="text-muted-foreground">Find photographers, venues, salons, and more for your big day.</p>
      </section>

      <section className="flex flex-col gap-8 px-6 pb-16 sm:px-12">
        <VendorFilters categories={categories} activeCategory={category} />

        {vendors.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-20 text-center text-muted-foreground">
            <p>No vendors found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.map((vendor) => (
              <Link
                key={vendor.vendor_id}
                href={`/marketplace/${vendor.vendor_id}`}
                className="flex flex-col gap-3 rounded-xl border p-6 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium">{vendor.business_name || "Unnamed vendor"}</h2>
                  {categoryLabel(vendor.category_id) && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {categoryLabel(vendor.category_id)}
                    </span>
                  )}
                </div>
                {vendor.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {vendor.location}
                  </div>
                )}
                {vendor.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{vendor.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
