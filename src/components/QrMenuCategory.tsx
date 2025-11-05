import type { MenuItem } from "../types/menu";

interface MenuCategoryProps {
  title: string;
  items: MenuItem[];
  index: number;
}

const QrMenuCategory = ({ title, items, index }) => {
  return (
    <section
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {index > 0 && <hr className="border-gray-400 mb-10" />}
      <h2 className="text-3xl font-semibold text-amber-500 mb-4 font-serif">
        {title}
      </h2>
      <ul className="space-y-4">
        {items.map((item, itemIndex) => (
          <li
            key={item.name}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 100 + (itemIndex + 1) * 50}ms`,
            }}
          >
            <h3 className="text-lg font-medium text-gray-100">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-400 mt-1 max-w-prose">
                {item.description}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QrMenuCategory;
