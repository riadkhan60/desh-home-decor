import { ProductForm } from "@/components/admin/product-form";
import {
  getAllCategoriesForForm,
  getAllCollectionsForForm,
} from "@/lib/actions/admin-products";

export const revalidate = 0;

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([
    getAllCategoriesForForm(),
    getAllCollectionsForForm(),
  ]);

  return (
    <div className=" max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Add New Product
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Create a new product for your catalog
        </p>
      </div>

      <ProductForm
        categories={categories}
        availableCollections={collections}
        mode="create"
      />
    </div>
  );
}
