'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Container } from '@/components/container';
import { BanglaText } from '@/components/bangla-text';

type Slide = {
  id: string;
  title: string | null;
  description: string | null;
  image: string;
  phoneImage?: string | null;
  link: string | null;
  buttonText: string | null;
};

interface HeroSliderProps {
  slides: Slide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const fallbackSlides: Slide[] = [
    {
      id: 'fallback-1',
      title: 'Premium Home Lighting & Decor',
      description:
        'প্রিমিয়াম কোয়ালিটির হোম ডেকোর প্রোডাক্টস পাচ্ছেন দেশি হোম ডেকোরে।',
      image: '/df-slide.png',
      phoneImage: '/df-slide.png',
      link: '#',
      buttonText: 'Explore Collection',
    },
  ];

  const effectiveSlides = slides.length ? slides : fallbackSlides;

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const goTo = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  // Simple autoplay: move to next slide every 5 seconds when Embla is ready.
  useEffect(() => {
    if (!emblaApi || isHovered) return;

    const id = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => clearInterval(id);
  }, [emblaApi, isHovered]);

  return (
    <section
      className="relative w-full overflow-hidden bg-linear-to-b from-background to-muted aspect-4/5 lg:aspect-video max-h-[80vh]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {effectiveSlides.map((slide) => {
            const hasText = Boolean(
              slide.title || slide.description || slide.buttonText,
            );
            const isPureImage = !hasText && slide.link;

            const slideInner = (
              <div className="relative flex h-full min-w-full items-center justify-center">
                {/* Background image per slide */}
                <div className="absolute inset-0">
                  {/* Mobile-first image (use phoneImage if provided, else desktop image) */}
                  {(slide.phoneImage || slide.image) && (
                    <Image
                      src={
                        slide.phoneImage && slide.phoneImage !== ''
                          ? slide.phoneImage
                          : slide.image
                      }
                      alt={slide.title ?? 'Slide'}
                      fill
                      priority
                      className="object-cover lg:hidden"
                      draggable={false}
                    />
                  )}
                  {/* Desktop image */}
                  {slide.image && slide.image !== '' && (
                    <Image
                      src={slide.image}
                      alt={slide.title ?? 'Slide'}
                      fill
                      priority
                      className="hidden object-cover lg:block"
                      draggable={false}
                    />
                  )}
                  <div
                    className={`absolute inset-0 transition-colors ${
                      hasText
                        ? 'bg-linear-to-r from-background/80 via-background/60 to-background/10'
                        : ''
                    }`}
                  />
                </div>

                {/* Content */}
                <Container className="relative z-10 flex h-full flex-col justify-center gap-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-16">
                  <div className="max-w-xl space-y-4 text-center lg:text-left">
                    {slide.title && (
                      <BanglaText
                        as="p"
                        className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-sm"
                      >
                        {slide.title}
                      </BanglaText>
                    )}
                    {slide.description && (
                      <BanglaText
                        as="h1"
                        className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                      >
                        {slide.description}
                      </BanglaText>
                    )}

                    {slide.buttonText && (
                      <div className="mt-6 flex justify-center gap-3 lg:justify-start">
                        <BanglaText
                          as="a"
                          href={slide.link ?? '#'}
                          className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:bg-foreground/90"
                        >
                          {slide.buttonText}
                        </BanglaText>
                      </div>
                    )}
                  </div>

                  {!isPureImage && (
                    <div className="hidden max-w-md flex-1 lg:block">
                      <div className="relative aspect-4/5 overflow-hidden rounded-3xl border bg-background/80 shadow-xl backdrop-blur">
                        {slide.image && slide.image !== '' && (
                          <Image
                            src={slide.image}
                            alt={slide.title ?? 'Slide'}
                            fill
                            sizes="(min-width: 1024px) 400px, 0px"
                            className="object-cover"
                            draggable={false}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </Container>
              </div>
            );

            return (
              <div key={slide.id} className="embla__slide min-w-full h-full">
                {isPureImage ? (
                  <a href={slide.link ?? '#'} className="block h-full w-full">
                    {slideInner}
                  </a>
                ) : (
                  slideInner
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots + counter overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex flex-col items-center gap-2 text-[10px] font-medium text-muted-foreground">
        <div className="flex w-full max-w-xs items-center gap-2 px-4 pointer-events-auto">
          {effectiveSlides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-[2px] flex-1 rounded-full transition-colors ${
                index === currentIndex ? 'bg-foreground' : 'bg-muted'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <span>
          {currentIndex + 1} / {effectiveSlides.length}
        </span>
      </div>
    </section>
  );
}