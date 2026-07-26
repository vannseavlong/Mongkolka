"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@mongkolka/ui/card";
import { Skeleton } from "@mongkolka/ui/skeleton";
import { useApiQuery } from "@/lib/use-api-query";
import type { Booking, PortfolioItem, Service, VendorProfile } from "@/lib/types";

export default function DashboardPage() {
  const { data: profileData, loading: profileLoading } = useApiQuery<{ profile: VendorProfile }>(
    "/vendor/api/profile",
  );
  const { data: bookingsData, loading: bookingsLoading } = useApiQuery<{ bookings: Booking[] }>(
    "/vendor/api/bookings",
  );
  const { data: portfolioData, loading: portfolioLoading } = useApiQuery<{ items: PortfolioItem[] }>(
    "/vendor/api/portfolio",
  );
  const { data: servicesData, loading: servicesLoading } = useApiQuery<{ services: Service[] }>(
    "/vendor/api/services",
  );

  const stats = [
    {
      label: "Total bookings",
      value: bookingsData?.bookings.length,
      loading: bookingsLoading,
    },
    {
      label: "Pending bookings",
      value: bookingsData?.bookings.filter((b) => b.status === "pending" || b.status === "inquiry")
        .length,
      loading: bookingsLoading,
    },
    { label: "Portfolio photos", value: portfolioData?.items.length, loading: portfolioLoading },
    { label: "Services listed", value: servicesData?.services.length, loading: servicesLoading },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium">
          {profileLoading ? "Welcome" : `Welcome, ${profileData?.profile.business_name ?? "there"}`}
        </h1>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your listing.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-medium">{stat.value ?? 0}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
