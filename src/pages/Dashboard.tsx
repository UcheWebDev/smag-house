import { MenuItem, MenuStats, Category } from "@/types/menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UtensilsCrossed,
  DollarSign,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORIES_STORAGE_KEY = "restaurant-menu-categories";

import { getCategories } from "@/lib/menuApi";
import { formatCurrency } from "@/helpers";



interface DashboardProps {
  items: MenuItem[];
}

export default function Dashboard({ items }: DashboardProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch {
        // swallow for dashboard; categories fallback to slug

        console.error("Failed to fetch categories");
      }
    })();
  }, []);

  const stats: MenuStats = {
    totalItems: items.length,
    byCategory: items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    unavailableItems: items.filter((item) => !item.available).length,
  };

  const averagePrice =
    items.length > 0
      ? items.reduce((sum, item) => sum + item.price, 0) / items.length
      : 0;

  const getCategoryLabel = (slug: string) => {
    const category = categories.find((cat) => cat.slug === slug);
    return category?.name || slug;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Overview of your restaurant menu
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground sm:text-3xl">
              {stats.totalItems}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Price
            </CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground sm:text-3xl">
              &#8358; {formatCurrency(averagePrice)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Per menu item</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground sm:text-3xl">
              {Object.keys(stats.byCategory).length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Active menu sections
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unavailable
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground sm:text-3xl">
              {stats.unavailableItems}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Items out of stock
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Items by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.byCategory).map(([category, count]) => (
              <div
                key={category}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm font-medium capitalize text-foreground">
                  {getCategoryLabel(category)}
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted sm:w-32">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: `${(count / stats.totalItems) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm font-bold text-foreground">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
