import { supabase } from "./supabase";
import { Category, MenuItem } from "@/types/menu";

function toCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function toItem(row: any): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    category: row.categories?.slug || row.category_id, // Use category slug from join or fall back to ID
    image: row.image ?? undefined,
    available: Boolean(row.available),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data.map(toCategory);
}

export async function insertCategory(
  categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ ...categoryData }])
    .select()
    .single();
  if (error) throw error;
  return toCategory(data);
}

export async function updateCategory(category: Category): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: category.name,
      slug: category.slug,
      description: category.description ?? null,
    })
    .eq("id", category.id)
    .select()
    .single();
  if (error) throw error;
  return toCategory(data);
}

export async function deleteCategoryById(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function getItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      *,
      categories (
        slug
      )
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toItem);
}

export async function insertItem(
  itemData: Omit<MenuItem, "id" | "createdAt" | "updatedAt">
): Promise<MenuItem> {
  // First, get the category ID from the slug
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", itemData.category)
    .single();

  if (categoryError) throw categoryError;
  if (!categoryData) throw new Error(`Category with slug "${itemData.category}" not found`);

  const { data, error } = await supabase
    .from("menu_items")
    .insert([{
      name: itemData.name,
      description: itemData.description,
      price: itemData.price,
      category_id: categoryData.id,
      image: itemData.image ?? null,
      available: itemData.available,
    }])
    .select(`
      *,
      categories (
        slug
      )
    `)
    .single();
  if (error) throw error;
  return toItem(data);
}

export async function updateItem(item: MenuItem): Promise<MenuItem> {
  // First, get the category ID from the slug
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", item.category)
    .single();

  if (categoryError) throw categoryError;
  if (!categoryData) throw new Error(`Category with slug "${item.category}" not found`);

  const { data, error } = await supabase
    .from("menu_items")
    .update({
      name: item.name,
      description: item.description,
      price: item.price,
      category_id: categoryData.id,
      image: item.image ?? null,
      available: item.available,
    })
    .eq("id", item.id)
    .select(`
      *,
      categories (
        slug
      )
    `)
    .single();
  if (error) throw error;
  return toItem(data);
}

export async function deleteItemById(id: string): Promise<void> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}