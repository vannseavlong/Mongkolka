import { Mail, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const FAQS = [
  {
    question: "How do I register as a couple?",
    answer:
      "Click \"Start planning\" and sign in with Google — your account and wedding workspace are created automatically. If you're planning together, you can invite your partner to the same account afterward.",
  },
  {
    question: "Is it free to list as a vendor?",
    answer:
      "Yes. Click \"For vendors\" and sign in with Google to submit your business. An admin reviews and approves new vendors before they appear in the marketplace.",
  },
  {
    question: "Is the platform available in Khmer?",
    answer: "Yes — wedding websites support both English and Khmer, with a language toggle for your guests.",
  },
  {
    question: "How do I reach a vendor I find in the marketplace?",
    answer: "Vendor pages list their services and portfolio today; direct messaging isn't available yet.",
  },
];

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      <section className="flex flex-col gap-4 px-6 py-16 sm:px-12">
        <h1 className="text-3xl font-medium tracking-tight sm:text-4xl">Contact us</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Have a question about planning your wedding or listing your business? Reach out.
        </p>
      </section>

      <section className="flex flex-col gap-4 px-6 pb-16 sm:px-12">
        <div className="flex items-center gap-3">
          <Mail className="size-5 text-primary" />
          <a href="mailto:hello@mongkolka.com" className="hover:underline">
            hello@mongkolka.com
          </a>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="size-5 text-primary" />
          Phnom Penh, Cambodia
        </div>
      </section>

      <section className="flex flex-col gap-6 px-6 pb-16 sm:px-12">
        <h2 className="text-xl font-medium">Frequently asked questions</h2>
        <div className="flex flex-col divide-y">
          {FAQS.map((faq) => (
            <div key={faq.question} className="flex flex-col gap-1 py-4">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
