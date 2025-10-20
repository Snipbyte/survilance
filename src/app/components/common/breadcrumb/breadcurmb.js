import Link from "next/link";
import { BiChevronRight } from "react-icons/bi";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center text-sm text-paraColor mt-4 p-2 border-y">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center">
          <Link
            href={item.href}
            className={`${
              idx === items.length - 1
                ? "text-headingColor font-semibold"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {item.label}
          </Link>
          {idx < items.length - 1 && (
            <BiChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
