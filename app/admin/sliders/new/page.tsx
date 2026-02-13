import { SliderForm } from '@/components/admin/slider-form';

export default function NewSliderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Slider</h1>
      </div>
      <SliderForm mode="create" />
    </div>
  );
}
