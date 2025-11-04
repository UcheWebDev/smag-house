import { MenuItem } from "@/types/menu";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

export default function MenuItemCard({ item, onEdit, onDelete }: MenuItemCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}
        <div className={cn(
          "absolute right-2 top-2",
          item.available ? "opacity-0 group-hover:opacity-100" : ""
        )}>
          <Badge variant={item.available ? "default" : "destructive"}>
            {item.available ? "Available" : "Unavailable"}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-3 sm:p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-foreground sm:text-base">{item.name}</h3>
          <span className="text-base font-bold text-primary sm:text-lg">${item.price.toFixed(2)}</span>
        </div>
        <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">{item.description}</p>
        <div className="mt-2">
          <Badge variant="secondary" className="text-xs capitalize">
            {item.category}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2 border-t border-border p-3">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit(item)}
        >
          <Pencil className="mr-1 h-3 w-3" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
