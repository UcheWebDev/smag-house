export type MenuCategory = 
  | "appetizers"
  | "mains"
  | "desserts"
  | "drinks"
  | "sides";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuStats {
  totalItems: number;
  byCategory: Record<MenuCategory, number>;
  unavailableItems: number;
}
