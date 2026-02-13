import { SliderForm, SliderFormData } from '@/components/admin/slider-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSliderPage({ params }: PageProps) {
  const { id } = await params;

  const slider = await prisma.sliderContent.findUnique({
    where: { id },
  });

  if (!slider) {
    notFound();
  }

  // Map to form data
  const initialData: SliderFormData & { id: string } = {
    id: slider.id,
    title: slider.title || '',
    description: slider.description || '',
    image: slider.image,
    phoneImage: slider.phoneImage || '',
    link: slider.link || '',
    buttonText: slider.buttonText || '',
    isActive: slider.isActive,
    order: slider.order,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Slider</h1>
      </div>
      <SliderForm mode="edit" initialData={initialData} sliderId={id} />
    </div>
  );
}
