import { Container } from '@/components/container';

export default function PublicLoading() {
  return (
    <main className="min-h-screen bg-black">
      <div className="animate-pulse">
        <div className="h-64 sm:h-96 bg-zinc-900" />
        <Container className="py-12">
          <div className="mb-8 h-8 w-48 rounded bg-zinc-800" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-zinc-800"
              />
            ))}
          </div>
        </Container>
      </div>
    </main>
  );
}
