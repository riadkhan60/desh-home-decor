import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import { getSliders } from '@/lib/actions/sliders';

export const dynamic = 'force-dynamic';

export default async function SlidersPage() {
  const { data: sliders, error } = await getSliders();

  if (error || !sliders) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load sliders.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Sliders</h1>
        <Link
          href="/admin/sliders/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" />
          Add Slider
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sliders.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-card border rounded-xl">
            No sliders found. Create your first one.
          </div>
        ) : (
          sliders.map((slider) => (
            <div
              key={slider.id}
              className="relative group overflow-hidden rounded-xl border bg-card"
            >
              <div className="aspect-video relative bg-muted">
                <Image
                  src={slider.image}
                  alt={slider.title || 'Slider'}
                  fill
                  className="object-cover"
                />
                {!slider.isActive && (
                  <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <span className="bg-background text-foreground text-xs font-bold px-2 py-1 rounded">
                      In-Active
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate pr-2">
                    {slider.title || 'Untitled'}
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    #{slider.order}
                  </span>
                </div>

                {slider.phoneImage && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-2">
                    📱 Mobile Image Set
                  </span>
                )}

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/admin/sliders/${slider.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80 transition"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
