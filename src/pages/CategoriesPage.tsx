import { useState, useEffect } from "react";
import { Category, MenuItem } from "@/types/menu";
import Layout from "@/components/Layout";
import CategoriesManagement from "./CategoriesManagement";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES_STORAGE_KEY = "restaurant-menu-categories";
const ITEMS_STORAGE_KEY = "restaurant-menu-items";

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "Appetizers",
    slug: "appetizers",
    description: "Start your meal with our delicious starters",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Main Courses",
    slug: "mains",
    description: "Hearty and satisfying main dishes",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Desserts",
    slug: "desserts",
    description: "Sweet treats to end your meal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    name: "Drinks",
    slug: "drinks",
    description: "Refreshing beverages and cocktails",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    name: "Sides",
    slug: "sides",
    description: "Perfect accompaniments to your meal",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load categories
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (storedCategories) {
      const parsed = JSON.parse(storedCategories);
      setCategories(
        parsed.map((cat: any) => ({
          ...cat,
          createdAt: new Date(cat.createdAt),
          updatedAt: new Date(cat.updatedAt),
        }))
      );
    } else {
      setCategories(defaultCategories);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
    }

    // Load items for counting
    const storedItems = localStorage.getItem(ITEMS_STORAGE_KEY);
    if (storedItems) {
      const parsed = JSON.parse(storedItems);
      setItems(
        parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
    }
  }, []);

  const saveCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(newCategories));
  };

  const handleAddCategory = (categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveCategories([...categories, newCategory]);
    toast({
      title: "Category added",
      description: `${newCategory.name} has been added.`,
    });
  };

  const handleUpdateCategory = (updatedCategory: Category) => {
    const newCategories = categories.map((cat) =>
      cat.id === updatedCategory.id ? updatedCategory : cat
    );
    saveCategories(newCategories);
    toast({
      title: "Category updated",
      description: `${updatedCategory.name} has been updated.`,
    });
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((c) => c.id === id);
    const itemCount = items.filter((item) => item.category === category?.slug).length;
    
    if (itemCount > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category contains ${itemCount} item(s). Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }

    const newCategories = categories.filter((cat) => cat.id !== id);
    saveCategories(newCategories);
    toast({
      title: "Category deleted",
      description: `${category?.name} has been removed.`,
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <CategoriesManagement
        categories={categories}
        items={items}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </Layout>
  );
};

export default CategoriesPage;
