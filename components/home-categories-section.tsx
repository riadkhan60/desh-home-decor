import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { getHomeCategories } from "@/lib/actions/categories";

export default async function HomeCategoriesSection() {
  const categories = await getHomeCategories();

  if (!categories.length) return null;

  return (
    <section className="pb-20 pt-4">
      <Container className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Shop by category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl border bg-card text-foreground shadow-sm transition hover:shadow-lg"
              >
              <div className="relative flex h-full flex-row items-center gap-4 overflow-hidden p-4 sm:p-5">
                {/* Text content */}
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Category
                  </p>
                  <h3 className="text-base font-semibold sm:text-lg">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  )}

                  <span className="mt-4 inline-flex items-center text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80">
                    View items
                    <span className="ml-1 text-xs">↗</span>
                  </span>
                </div>

                {/* Category image on the right with consistent aspect ratio */}
                {cat.image && (
                  <div className="flex flex-none justify-end">
                    <div className="relative w-24 sm:w-28 md:w-32 aspect-3/4 overflow-hidden rounded-2xl bg-muted/60 shadow-inner">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="(min-width:1024px) 12vw, 30vw"
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-background/10 via-transparent to-background/30" />
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

