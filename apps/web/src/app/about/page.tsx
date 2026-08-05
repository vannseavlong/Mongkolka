import {
  Award,
  Globe,
  Heart,
  MapPin,
  Palette,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@mongkolka/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { fetchJson } from "@/lib/api";

type StatRecord = {
  stat_id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
};

const STAT_ICONS: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  globe: Globe,
  award: Award,
};

const WHO_WHY = [
  {
    icon: Users,
    title: "Who We Are",
    text: "Mongkolka is a wedding platform built for couples in Cambodia — bringing planning tools, a shareable wedding website, and a trusted vendor marketplace together in one place.",
  },
  {
    icon: Target,
    title: "Why We Exist",
    text: "We believe planning a wedding should be joyful, not overwhelming. That's why we built Mongkolka — to give couples the tools and connections they need to bring their wedding day to life.",
  },
];

const MISSION_VISION = [
  {
    icon: Sparkles,
    title: "Our Mission",
    text: "To make wedding planning simple and joyful for every couple in Cambodia — with intuitive tools, a beautiful shareable website, and trusted local vendors, all in one place.",
  },
  {
    icon: Globe,
    title: "Our Vision",
    text: "To become the platform every couple in Cambodia turns to first when planning their wedding — and a place where local wedding vendors can grow their business.",
  },
];

const VALUES = [
  {
    icon: Heart,
    title: "Love First",
    text: "Every decision we make is centered around celebrating love and helping couples create meaningful moments.",
  },
  {
    icon: Award,
    title: "Quality & Trust",
    text: "We only work with vendors who meet our standards, so couples can book with confidence.",
  },
  {
    icon: Palette,
    title: "Simplicity",
    text: "Wedding planning has enough moving parts — our tools stay simple so you can focus on the celebration.",
  },
  {
    icon: MapPin,
    title: "Built for Cambodia",
    text: "Designed around how couples actually plan weddings here — in English or Khmer, for vendors and traditions across the country.",
  },
];

async function getStats(): Promise<StatRecord[]> {
  try {
    const data = await fetchJson<{ stats: StatRecord[] }>("/public/api/stats", {
      next: { revalidate: 300 },
    });
    return data?.stats ?? [];
  } catch {
    return [];
  }
}

export default async function AboutPage() {
  const stats = await getStats();

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="flex flex-col items-center gap-4 px-6 py-20 text-center sm:px-12">
        <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
          <Heart className="size-7 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-primary sm:text-3xl">
          About Mongkolka
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Helping couples across Cambodia plan and share their wedding, beautifully.
        </p>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="px-6 pb-16 sm:px-12">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {stats.map((stat) => {
              const Icon = (stat.icon && STAT_ICONS[stat.icon]) || Sparkles;
              return (
                <Card key={stat.stat_id} className="text-center">
                  <CardContent className="flex flex-col items-center gap-2 pt-6">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <div className="text-2xl font-medium text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      {/* Who we are / Why we exist */}
      <section className="px-6 pb-16 sm:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {WHO_WHY.map((item) => (
            <Card key={item.title}>
              <CardContent className="flex flex-col gap-3 pt-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-full bg-muted">
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <h2 className="font-medium text-primary">{item.title}</h2>
                </div>
                <p className="text-muted-foreground">{item.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="px-6 pb-16 sm:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2">
          {MISSION_VISION.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground"
            >
              <div className="flex items-center gap-2">
                <item.icon className="size-5" />
                <h2 className="font-medium">{item.title}</h2>
              </div>
              <p className="text-primary-foreground/90">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="px-6 py-16 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-10 text-center text-sm font-medium text-primary">Our Values</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title}>
                <CardContent className="flex flex-col gap-3 pt-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <value.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
