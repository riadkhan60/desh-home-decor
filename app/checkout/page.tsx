import { Container } from '@/components/container';
import { CheckoutForm } from '@/components/checkout-form';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata = {
  title: 'Checkout - Shilpini',
  description: 'Complete your purchase',
};

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-muted/30 py-10">
        <Container>
          <CheckoutForm />
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
