import { getHeroSlides } from '@/lib/actions/sliders';
import { HeroSlider } from '@/components/hero-slider';

export async function HeroSection() {
  const slides = await getHeroSlides();
  return <HeroSlider slides={slides} />;
}
