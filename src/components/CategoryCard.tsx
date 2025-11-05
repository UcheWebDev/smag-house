import { Category } from "@/types/menu";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, FolderOpen } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  itemCount: number;
  disabled?: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryCard({
  category,
  itemCount,
  disabled = false,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{category.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {category.description || "No description provided"}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-2 py-1 font-mono">
              {category.slug}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2 border-t border-border pt-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(category)}
          disabled={disabled}
        >
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(category.id)}
          disabled={disabled}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}