import {
  CategoryForm,
  CategoryFormData,
} from '@/components/admin/category-form';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  // Map to form data
  const initialData: CategoryFormData & { id: string } = {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    image: category.image || '',
    isActive: category.isActive,
    order: category.order,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
      </div>
      <CategoryForm mode="edit" initialData={initialData} categoryId={id} />
    </div>
  );
}
