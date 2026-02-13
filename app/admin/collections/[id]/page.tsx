import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CollectionForm } from '@/components/admin/collection-form';

export const revalidate = 0;

interface EditCollectionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id },
  });

  if (!collection) {
    notFound();
  }

  const initialData = {
    id: collection.id,
    name: collection.name,
    slug: collection.slug,
    description: collection.description || '',
    image: collection.image || '',
    isActive: collection.isActive,
    order: collection.order,
  };

  return (
    <div className=" max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Edit Collection
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Update collection details
        </p>
      </div>

      <CollectionForm
        initialData={initialData}
        mode="edit"
        collectionId={id}
      />
    </div>
  );
}

