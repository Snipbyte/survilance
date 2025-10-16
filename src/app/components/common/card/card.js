// components/common/Card.js
import Image from "next/image";

const Card = ({ title, description, image }) => (
  <div className="p-4 border rounded-lg shadow-lg bg-white max-w-sm">
    {image && <Image src={image} alt={title} className="w-full h-32 object-cover rounded-t-lg" />}
    <h2 className="text-xl font-semibold mt-4">{title}</h2>
    <p className="text-paraColor mt-2">{description}</p>
  </div>
);

export default Card;
