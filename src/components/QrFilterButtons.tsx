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
  return (
    <nav className="animate-fade-in-down" style={{ animationDelay: "200ms" }}>
      <div className="flex flex-wrap justify-start gap-2 sm:gap-4 my-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(category as FilterType)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
              ${
                activeFilter === category
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default QrFilterButtons;
