// components/common/Avatar.js
import Image from "next/image";

const Avatar = ({ src, alt, size = "w-10 h-10" }) => (
  <div className={`rounded-full overflow-hidden ${size}`}>
    <Image src={src} alt={alt} className="object-cover" />
  </div>
);

export default Avatar;
