import { Container } from '@/components/container';
import { SuccessView } from '@/components/checkout/success-view';

export const metadata = {
  title: 'Order Placed - Shilpini',
  description: 'Thank you for your order',
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await searchParams;

  return (
    <main className="min-h-screen bg-muted/30 py-10">
      <Container>
        <SuccessView orderNumber={orderNumber} />
      </Container>
    </main>
  );
}
