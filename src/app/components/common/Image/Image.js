import React from "react";
import Image from "next/image";

// Shimmer SVG generator
const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#e5e7eb" offset="20%" />
        <stop stop-color="#d1d5db" offset="50%" />
        <stop stop-color="#e5e7eb" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#e5e7eb" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>
`;

// Convert to base64 string
const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const Images = (props) => {
  const width = props.width || 1000;
  const height = props.height || 1000;

  return (
    <Image
      src={props.src}
      alt={props.alt || "random image"}
      loading="lazy"
      width={width}
      height={height}
      quality={80}
      className={props.className}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
    />
  );
};

export default Images;
