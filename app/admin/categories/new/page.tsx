import { CategoryForm } from '@/components/admin/category-form';

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">New Category</h1>
      </div>
      <CategoryForm mode="create" />
    </div>
  );
}
