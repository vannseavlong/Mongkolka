import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@mongkolka/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";

const CONTACT_INFO = [
  { icon: Mail, label: "Email", value: "hello@mongkolka.com" },
  { icon: Phone, label: "Phone", value: "+855 12 345 678" },
  { icon: MapPin, label: "Address", value: "Phnom Penh, Cambodia" },
  { icon: Clock, label: "Business Hours", value: "Mon - Fri: 9:00 AM - 6:00 PM" },
];

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

      <section className="flex flex-col items-center gap-2 px-6 py-16 text-center sm:px-12">
        <h1 className="text-lg font-medium text-primary">Contact Us</h1>
        <p className="text-2xl font-medium tracking-tight sm:text-3xl">We&apos;d love to hear from you</p>
      </section>

      <section className="px-6 pb-16 sm:px-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <h2 className="mb-6 font-medium text-primary">Get In Touch</h2>
              <ContactForm />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="flex flex-col gap-5 pt-6">
                <h2 className="font-medium text-primary">Contact Information</h2>
                {CONTACT_INFO.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                      <item.icon className="size-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                      <div className="text-sm">{item.value}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
              <MessageCircle className="size-5" />
              <h2 className="font-medium">Need Immediate Help?</h2>
              <p className="text-sm text-primary-foreground/90">
                Our support team is available via live chat during business hours!
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6 px-6 pb-16 sm:px-12">
        <p className="text-center text-sm font-medium text-primary">Frequently Asked Questions</p>
        <div className="mx-auto flex w-full max-w-3xl flex-col divide-y">
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
