import { useState } from "react";
import type { FilterType } from "../types/menu";

interface FilterButtonsProps {
  categories: string[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const QrFilterButtons = ({
  categories,
  activeFilter,
  onFilterChange,
}: FilterButtonsProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFilterClick = (filter: FilterType) => {
    onFilterChange(filter);
    if (filter !== "All") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  };

  const handleShowMore = () => {
    setIsCollapsed(false);
  };

  return (
    <nav className="animate-fade-in-down" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-wrap justify-start gap-2 sm:gap-4 my-8 items-center">
        {isCollapsed ? (
          <>
            <button
              onClick={() => handleFilterClick(activeFilter)}
              className="px-4 py-2 text-sm font-medium rounded-full bg-amber-500 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-amber-500"
            >
              {activeFilter}
            </button>
            <button
              onClick={handleShowMore}
              className="px-4 py-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors duration-200 flex items-center gap-1"
            >
              more <span className="text-lg">»</span>
            </button>
          </>
        ) : (
          categories.map((category) => (
            <button
              key={category}
              onClick={() => handleFilterClick(category as FilterType)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-amber-500
                ${
                  activeFilter === category
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
              {category}
            </button>
          ))
        )}
      </div>
    </nav>
  );
};

export default QrFilterButtons;