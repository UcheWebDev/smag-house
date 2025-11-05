import { useState, useEffect } from "react";
import { Category } from "@/types/menu";
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
import { Loader2 } from "lucide-react";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  isSaving: boolean;
  onSave: (
    category: Omit<Category, "id" | "createdAt" | "updatedAt"> & { id?: string }
  ) => Promise<void>;
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  isSaving,
  onSave,
}: CategoryDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, open]);

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: category
        ? formData.slug
        : name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, ""),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSave({
      ...(category && { id: category.id }),
      name: formData.name,
      slug: formData.slug,
      description: formData.description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-[95vw] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the details of your category."
              : "Create a new category for organizing menu items."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-3 py-4 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g., Appetizers"
                required
                disabled={isSaving}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL-friendly name)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="e.g., appetizers"
                required
                pattern="[a-z0-9-]+"
                title="Only lowercase letters, numbers, and hyphens allowed"
                disabled={isSaving}
              />
              <p className="text-xs text-muted-foreground">
                Auto-generated from name, or customize it
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe this category..."
                rows={3}
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
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{category ? "Save Changes" : "Add Category"}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
