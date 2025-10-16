// components/common/Breadcrumb.js
const Breadcrumb = ({ items }) => (
  <nav className="text-sm">
    {items.map((item, idx) => (
      <span key={idx}>
        <a href={item.href} className="text-blueColor hover:underline">
          {item.label}
        </a>
        {idx < items.length - 1 && <span className="mx-2">/</span>}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
