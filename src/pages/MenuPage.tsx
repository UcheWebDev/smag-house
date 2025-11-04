import { useState, useEffect } from "react";
import { MenuItem } from "@/types/menu";
import Layout from "@/components/Layout";
import MenuManagement from "./MenuManagement";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "restaurant-menu-items";

const MenuPage = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setItems(
        parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
      );
    }
  }, []);

  const saveItems = (newItems: MenuItem[]) => {
    setItems(newItems);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
  };

  const handleAddItem = (itemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => {
    const newItem: MenuItem = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    saveItems([...items, newItem]);
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your menu.`,
    });
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    const newItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveItems(newItems);
    toast({
      title: "Item updated",
      description: `${updatedItem.name} has been updated.`,
    });
  };

  const handleDeleteItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    const newItems = items.filter((item) => item.id !== id);
    saveItems(newItems);
    toast({
      title: "Item deleted",
      description: `${item?.name} has been removed from your menu.`,
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <MenuManagement
        items={items}
        onAddItem={handleAddItem}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
      />
    </Layout>
  );
};

export default MenuPage;
