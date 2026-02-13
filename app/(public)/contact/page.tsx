import Link from 'next/link';
import { Container } from '@/components/container';
import { CONTACT } from '@/lib/constants/contact';
import { Phone, MessageCircle, Facebook, Instagram } from 'lucide-react';

export const metadata = {
  title: 'Contact Us - Deshi Home Decor',
  description:
    'Get in touch with Deshi Home Decor. Call us, message on WhatsApp, or connect on Facebook and Instagram.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background pb-16 pt-8">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-3 text-muted-foreground sm:text-lg">
            Reach out to us – we&apos;d love to hear from you
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Phone Numbers */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Phone className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Phone Numbers
              </h2>
            </div>
            <div className="space-y-3 rounded-xl border border-border bg-card p-4 sm:p-5">
              {CONTACT.phones.map((phone) => (
                <a
                  key={phone.number}
                  href={phone.href}
                  className="block rounded-lg border border-transparent px-4 py-3 text-center font-medium text-foreground transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 sm:py-3.5"
                >
                  <span className="block text-xs uppercase tracking-wider text-muted-foreground">
                    {phone.label}
                  </span>
                  <span className="mt-1 block text-base sm:text-lg">
                    {phone.number}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
                <MessageCircle className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                WhatsApp
              </h2>
            </div>
            <a
              href={CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[140px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 transition hover:border-[#25D366]/50 hover:bg-[#25D366]/5 sm:min-h-[160px]"
            >
              <MessageCircle className="h-12 w-12 text-[#25D366] sm:h-14 sm:w-14" />
              <span className="font-medium text-foreground">
                {CONTACT.whatsapp.label}
              </span>
              <span className="text-sm text-muted-foreground">
                {CONTACT.whatsapp.number}
              </span>
              <span className="text-xs text-[#25D366]">Tap to chat</span>
            </a>
          </div>

          {/* Social */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                <Facebook className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                Follow Us
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-4">
              <a
                href={CONTACT.facebook.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 transition hover:border-[#1877F2]/50 hover:bg-[#1877F2]/5 sm:min-h-[140px]"
              >
                <svg
                  className="h-10 w-10 text-[#1877F2] sm:h-12 sm:w-12"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium text-foreground">
                  {CONTACT.facebook.label}
                </span>
              </a>
              <a
                href={CONTACT.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-6 transition hover:border-[#E4405F]/50 hover:bg-[#E4405F]/5 sm:min-h-[140px]"
              >
                <Instagram className="h-10 w-10 text-[#E4405F] sm:h-12 sm:w-12" />
                <span className="text-sm font-medium text-foreground">
                  {CONTACT.instagram.label}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#D4AF37] bg-transparent px-6 py-3 text-sm font-medium text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"
          >
            Continue Shopping
          </Link>
        </div>
      </Container>
    </main>
  );
}
