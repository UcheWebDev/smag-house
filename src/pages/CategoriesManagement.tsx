import { useState } from "react";
import { Category, MenuItem } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import CategoryCard from "@/components/CategoryCard";
import CategoryDialog from "@/components/CategoryDialog";

interface CategoriesManagementProps {
  categories: Category[];
  items: MenuItem[];
  isSaving: boolean;
  onAddCategory: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onUpdateCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
}

export default function CategoriesManagement({
  categories,
  items,
  isSaving,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoriesManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryItemCount = (categorySlug: string) => {
    return items.filter((item) => item.category === categorySlug).length;
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingCategory(undefined);
    setDialogOpen(true);
  };

  const handleSave = async (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    try {
      if (categoryData.id) {
        await onUpdateCategory({
          ...categoryData as Category,
          updatedAt: new Date(),
        });
      } else {
        await onAddCategory(categoryData);
      }
      setDialogOpen(false);
    } catch (e) {
      // Error already handled in parent, just don't close dialog
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Categories</h2>
          <p className="text-sm text-muted-foreground sm:text-base">Organize your menu items into categories</p>
        </div>
        <Button onClick={handleAdd} className="w-full gap-2 sm:w-auto" disabled={isSaving}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filteredCategories.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-6 text-center sm:min-h-[400px] sm:p-8">
          <p className="mb-2 text-base font-medium text-foreground sm:text-lg">No categories found</p>
          <p className="mb-4 text-sm text-muted-foreground">
            {categories.length === 0
              ? "Get started by creating your first category"
              : "Try adjusting your search"}
          </p>
          {categories.length === 0 && (
            <Button onClick={handleAdd} className="gap-2" disabled={isSaving}>
              <Plus className="h-4 w-4" />
              Add First Category
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              itemCount={getCategoryItemCount(category.slug)}
              onEdit={handleEdit}
              onDelete={onDeleteCategory}
              disabled={isSaving}
            />
          ))}
        </div>
      )}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        isSaving={isSaving}
        onSave={handleSave}
      />
    </div>
  );
}