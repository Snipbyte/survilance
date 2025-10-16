// components/common/Badge.js
const Badge = ({ children, color = "bg-blueColor" }) => (
    <span className={`px-2 py-1 rounded-full text-white text-sm ${color}`}>
      {children}
    </span>
  );
  
  export default Badge;
  