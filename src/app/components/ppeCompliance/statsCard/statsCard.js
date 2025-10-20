import React from "react";

const StatsCard = ({
    title,
    icon: Icon,
    iconColor,
    mainValue,
    mainColor,
    subText,
    subColor,
}) => {
    return (
        <div className="bg-white p-4 rounded-lg border w-full md:w-[19%]">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-paraColor">
                    {title}
                </h3>
                {Icon && <Icon className={`text-lg ${iconColor}`} />}
            </div>
            <p className={`text-3xl font-bold mb-2 ${mainColor}`}>{mainValue}</p>
            <p className={`text-sm ${subColor || "text-paraColor"}`}>{subText}</p>
        </div>
    );
};

export default StatsCard;
