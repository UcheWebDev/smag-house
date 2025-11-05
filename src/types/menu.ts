export type MenuCategory = string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

export type FilterType = 'All' | 'Appetizers' | 'Pasta Specialities' | 'Desserts' | 'Drinks';
