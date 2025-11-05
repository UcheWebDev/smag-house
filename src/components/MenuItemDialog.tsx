import { useState, useEffect } from "react";
import { MenuItem, MenuCategory, Category } from "@/types/menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";

interface MenuItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: MenuItem;
  categories: Category[];
  isSaving: boolean;
  onSave: (
    item: Omit<MenuItem, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => Promise<void>;
}

export default function MenuItemDialog({
  open,
  onOpenChange,
  item,
  categories,
  isSaving,
  onSave,
}: MenuItemDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "" as MenuCategory,
    image: "",
    available: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        image: item.image || "",
        available: item.available,
      });
    } else {
      // Set default category to first available category or empty
      const defaultCategory = categories.length > 0 ? categories[0].slug : "";
      setFormData({
        name: "",
        description: "",
        price: "",
        category: defaultCategory as MenuCategory,
        image: "",
        available: true,
      });
    }
  }, [item, open, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      return; // Don't submit if no category selected
    }

    await onSave({
      ...(item && { id: item.id }),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || undefined,
      available: formData.available,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {item
              ? "Update the details of your menu item."
              : "Create a new item for your menu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 py-4 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Margherita Pizza"
                required
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your dish..."
                rows={3}
                required
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (&#8358;)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: MenuCategory) =>
                    setFormData({ ...formData, category: value })
                  }
                  required
                  disabled={isSaving}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="uncategorized" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                disabled={isSaving}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="available" className="text-base">
                  Available
                </Label>
                <p className="text-sm text-muted-foreground">
                  Is this item currently available to order?
                </p>
              </div>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, available: checked })
                }
                disabled={isSaving}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={categories.length === 0 || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{item ? "Save Changes" : "Add Item"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
