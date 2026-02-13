import { CollectionForm } from '@/components/admin/collection-form';

export const revalidate = 0;

export default function NewCollectionPage() {
  return (
    <div className=" max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Add New Collection
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Create a new collection to group products (e.g. New Arrivals).
        </p>
      </div>

      <CollectionForm mode="create" />
    </div>
  );
}

