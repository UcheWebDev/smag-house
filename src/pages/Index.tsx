import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
import Layout from "@/components/Layout";
import Dashboard from "./Dashboard";
import { useToast } from "@/hooks/use-toast";
import {
  getItems,
  insertItem,
  updateItem,
  deleteItemById,
} from "@/lib/menuApi";

const Index = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    void loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      const fetchedItems = await getItems();
      setItems(fetchedItems);
    } catch (error) {
      console.error("Failed to load menu items:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items. Please try again.",
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
      const newItem = await insertItem(itemData);
      setItems([newItem, ...items]);
      toast({
        title: "Item added",
        description: `${newItem.name} has been added to your menu.`,
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      toast({
        title: "Error",
        description: "Failed to add item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateItem = async (updatedItem: MenuItem) => {
    try {
      const updated = await updateItem(updatedItem);
      setItems(items.map((item) => (item.id === updated.id ? updated : item)));
      toast({
        title: "Item updated",
        description: `${updated.name} has been updated.`,
      });
    } catch (error) {
      console.error("Failed to update item:", error);
      toast({
        title: "Error",
        description: "Failed to update item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    try {
      await deleteItemById(id);
      setItems(items.filter((item) => item.id !== id));
      toast({
        title: "Item deleted",
        description: `${item?.name} has been removed from your menu.`,
        variant: "destructive",
      });
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
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
      <Dashboard items={items} />
    </Layout>
  );
};

export default Index;
