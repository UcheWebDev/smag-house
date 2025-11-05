import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
import Layout from "@/components/Layout";
import MenuManagement from "./MenuManagement";
import { useToast } from "@/hooks/use-toast";
import {
  getItems,
  insertItem,
  updateItem,
  deleteItemById,
} from "@/lib/menuApi";

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    void loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (e) {
      toast({
        title: "Failed to load items",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async (
    itemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      setIsSaving(true);
      const created = await insertItem(itemData);
      setItems([created, ...items]);
      toast({
        title: "Item added",
        description: `${created.name} has been added to your menu.`,
      });
    } catch (e) {
      toast({
        title: "Add failed",
        description: (e as Error).message,
        variant: "destructive",
      });
      throw e; // Re-throw to prevent dialog from closing
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateItem = async (updatedItem: MenuItem) => {
    try {
      setIsSaving(true);
      const saved = await updateItem(updatedItem);
      setItems(items.map((item) => (item.id === saved.id ? saved : item)));
      toast({
        title: "Item updated",
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

  const handleDeleteItem = async (id: string) => {
    try {
      setIsSaving(true);
      const item = items.find((i) => i.id === id);
      await deleteItemById(id);
      setItems(items.filter((i) => i.id !== id));
      toast({
        title: "Item deleted",
        description: `${item?.name} has been removed from your menu.`,
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
            <p className="text-muted-foreground">Loading menu items...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MenuManagement
        items={items}
        isSaving={isSaving}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    </Layout>
  );
};

export default MenuPage;
