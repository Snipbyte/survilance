import React from "react";

const Intro = ({
  heading = "Loading...",
  des = "Please wait while the content is loading.",
  headingClassName = "",
  paraClassName = "",
  icon = "",
}) => {
  return (
    <div className="pt-2">
      <div className="flex items-center gap-2">
        <h1 className={`font-bold text-headingColor ${headingClassName}`}>
          {heading}
        </h1>
        <div className="text-yellow-400">{icon}</div>
      </div>
      <p className={` text-paraColor  ${paraClassName}`}>{des}</p>
    </div>
  );
};

export default Intro;
