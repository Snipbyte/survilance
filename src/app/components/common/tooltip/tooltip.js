// components/common/Tooltip.js
const Tooltip = ({ children, text }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block text-sm text-white bg-black p-2 rounded">
        {text}
      </div>
    </div>
  );
  
  export default Tooltip;
  