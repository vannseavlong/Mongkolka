import { notFound } from "next/navigation";
import { MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";
import type { VendorDetailResponse } from "../types";

const UNIT_LABEL: Record<string, string> = {
  per_event: "per event",
  per_hour: "per hour",
  package: "package",
};

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ vendorId: string }>;
}) {
  const { vendorId } = await params;
  const data = await fetchJson<VendorDetailResponse>(`/public/api/vendors/${vendorId}`);
  if (!data) notFound();

  const { vendor, portfolio, services } = data;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-6 px-6 py-10 sm:px-12">
        <Link href="/marketplace" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to marketplace
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-tight">{vendor.business_name || "Unnamed vendor"}</h1>
          {vendor.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4" />
              {vendor.location}
            </div>
          )}
        </div>

        {(vendor.bio || vendor.description) && (
          <p className="max-w-2xl text-muted-foreground">{vendor.bio || vendor.description}</p>
        )}
      </section>

      {services.length > 0 && (
        <section className="flex flex-col gap-4 px-6 pb-12 sm:px-12">
          <h2 className="text-lg font-medium">Services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div key={service.service_id} className="flex flex-col gap-1 rounded-xl border p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{service.name}</h3>
                  {service.price != null && (
                    <span className="shrink-0 text-sm font-medium">
                      ${service.price} <span className="text-muted-foreground">{UNIT_LABEL[service.unit]}</span>
                    </span>
                  )}
                </div>
                {service.description && (
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {portfolio.length > 0 && (
        <section className="flex flex-col gap-4 px-6 pb-16 sm:px-12">
          <h2 className="text-lg font-medium">Portfolio</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {portfolio.map((item) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={item.item_id}
                src={item.image_url}
                alt={item.caption || "Portfolio image"}
                className="aspect-square w-full rounded-lg object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
