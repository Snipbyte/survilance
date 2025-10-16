// components/common/Tabs.js
import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="flex space-x-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`py-2 px-4 ${index === activeTab ? "border-b-2 border-blueColor" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{tabs[activeTab].content}</div>
    </div>
  );
};

export default Tabs;
