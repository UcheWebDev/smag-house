import { useState, useEffect, useMemo } from "react";
import { MenuItem, Category } from "@/types/menu";
import type { FilterType } from "@/types/menu";
import QrHeader from "@/components/QrHeader";
import QrFilterButtons from "@/components/QrFilterButtons";
import QrMenuCategory from "@/components/QrMenuCategory";
import { getItems, getCategories } from "@/lib/menuApi";

interface GroupedMenuItems {
  title: string;
  slug: string;
  items: MenuItem[];
}

const QrPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [items, cats] = await Promise.all([getItems(), getCategories()]);
      // Filter only available items for the QR menu
      setMenuItems(items.filter((item) => item.available));
      setCategories(cats);
    } catch (error) {
      console.error("Failed to load menu data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryTitles = useMemo(
    () => ["All", ...categories.map((cat) => cat.name)],
    [categories]
  );

  const groupedMenu: GroupedMenuItems[] = useMemo(() => {
    // Group items by category
    const grouped = categories.map((category) => ({
      title: category.name,
      slug: category.slug,
      items: menuItems.filter((item) => item.category === category.slug),
    }));

    // Filter out empty categories
    return grouped.filter((group) => group.items.length > 0);
  }, [menuItems, categories]);

  const filteredMenu: GroupedMenuItems[] = useMemo(() => {
    if (activeFilter === "All") {
      return groupedMenu;
    }
    return groupedMenu.filter((category) => category.title === activeFilter);
  }, [activeFilter, groupedMenu]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </main>
    );
  }

  if (menuItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h2 className="text-2xl font-serif font-bold text-amber-600">
            No Menu Items Available
          </h2>
          <p className="text-gray-600">
            Please add some menu items to display.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex flex-row">
        {/* Left Panel: Menu Content */}
        <div className="w-3/5 sm:w-1/2 lg:w-2/5 xl:w-1/3 bg-white p-8 sm:p-12 shadow-2xl z-10 h-screen overflow-y-auto menu-scrollbar">
          <QrHeader />
          <QrFilterButtons
            categories={categoryTitles}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="mt-8 space-y-10" key={activeFilter}>
            {filteredMenu.map((category, index) => (
              <QrMenuCategory
                key={category.slug}
                title={category.title}
                items={category.items}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Right Panel: Image */}
        <div className="w-2/5 sm:w-1/2 lg:w-3/5 xl:w-2/3 h-screen sticky top-0">
          <div
            className="bg-cover bg-center h-full w-full"
            style={{
              backgroundImage: `url('https://picsum.photos/id/292/1200/1800')`,
            }}
            role="img"
            aria-label="A delicious spread of food on a wooden table"
          >
            <div className="h-full w-full bg-black bg-opacity-20"></div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QrPage;
