import { Category } from "@/types/menu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, FolderOpen } from "lucide-react";

interface CategoryCardProps {
  category: Category;
  itemCount: number;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export default function CategoryCard({ category, itemCount, onEdit, onDelete }: CategoryCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">{category.name}</h3>
              <p className="text-xs text-muted-foreground">{category.slug}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Badge>
        </div>
        
        {category.description && (
          <p className="text-sm text-muted-foreground">{category.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="gap-2 border-t border-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(category)}
        >
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(category.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
