import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types/menu";
import Layout from "@/components/Layout";
import CategoriesManagement from "./CategoriesManagement";
import { useToast } from "@/hooks/use-toast";
import {
  getCategories,
  getItems,
  insertCategory,
  updateCategory,
  deleteCategoryById,
} from "@/lib/menuApi";

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [cats, its] = await Promise.all([getCategories(), getItems()]);
      setCategories(cats);
      setItems(its);
    } catch (e) {
      toast({
        title: "Failed to load data",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (
    categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsSaving(true);
      const created = await insertCategory(categoryData);
      setCategories([...categories, created]);
      toast({
        title: "Category added",
        description: `${created.name} has been added.`,
      });
    } catch (e) {
      toast({
        title: "Add failed",
        description: (e as Error).message,
        variant: "destructive",
      });
      throw e; // Re-throw to let the component know it failed
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateCategory = async (updatedCategory: Category) => {
    try {
      setIsSaving(true);
      const saved = await updateCategory(updatedCategory);
      setCategories(
        categories.map((cat) => (cat.id === saved.id ? saved : cat))
      );
      toast({
        title: "Category updated",
        description: `${saved.name} has been updated.`,
      });
    } catch (e) {
      toast({
        title: "Update failed",
        description: (e as Error).message,
        variant: "destructive",
      });
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find((c) => c.id === id);
    const itemCount = items.filter(
      (item) => item.category === category?.slug
    ).length;

    if (itemCount > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category contains ${itemCount} item(s). Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      await deleteCategoryById(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      toast({
        title: "Category deleted",
        description: `${category?.name} has been removed.`,
        variant: "destructive",
      });
    } catch (e) {
      toast({
        title: "Delete failed",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <CategoriesManagement
        categories={categories}
        items={items}
        isSaving={isSaving}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </Layout>
  );
};

export default CategoriesPage;
