// components/common/Accordion.js
import { useState } from "react";

const Accordion = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button className="w-full text-left py-2" onClick={() => setIsOpen(!isOpen)}>
        <h2 className="font-semibold">{title}</h2>
      </button>
      {isOpen && <p className="p-4">{content}</p>}
    </div>
  );
};

export default Accordion;
