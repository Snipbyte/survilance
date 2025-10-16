// components/common/Dropdown.js
const Dropdown = ({ options = [], onChange }) => (
  <select
    onChange={(e) => onChange(e.target.value)}
    className="p-2 border rounded-md"
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default Dropdown;
