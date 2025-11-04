import { useState } from "react";
import { MenuItem, MenuCategory } from "@/types/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import MenuItemCard from "@/components/MenuItemCard";
import MenuItemDialog from "@/components/MenuItemDialog";

interface MenuManagementProps {
  items: MenuItem[];
  onAddItem: (item: Omit<MenuItem, "id" | "createdAt" | "updatedAt">) => void;
  onUpdateItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export default function MenuManagement({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: MenuManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | undefined>();

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleSave = (itemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt"> & { id?: string }) => {
    if (itemData.id) {
      onUpdateItem({
        ...itemData as MenuItem,
        updatedAt: new Date(),
      });
    } else {
      onAddItem(itemData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Menu Items</h2>
          <p className="text-sm text-muted-foreground sm:text-base">Manage your restaurant menu items</p>
        </div>
        <Button onClick={handleAdd} className="w-full gap-2 sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as MenuCategory | "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="appetizers">Appetizers</SelectItem>
            <SelectItem value="mains">Main Courses</SelectItem>
            <SelectItem value="desserts">Desserts</SelectItem>
            <SelectItem value="drinks">Drinks</SelectItem>
            <SelectItem value="sides">Sides</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 p-6 text-center sm:min-h-[400px] sm:p-8">
          <p className="mb-2 text-base font-medium text-foreground sm:text-lg">No items found</p>
          <p className="mb-4 text-sm text-muted-foreground">
            {items.length === 0
              ? "Get started by adding your first menu item"
              : "Try adjusting your search or filters"}
          </p>
          {items.length === 0 && (
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Item
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={onDeleteItem}
            />
          ))}
        </div>
      )}

      <MenuItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editingItem}
        onSave={handleSave}
      />
    </div>
  );
}
