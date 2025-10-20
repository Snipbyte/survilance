import Link from 'next/link';
import React from 'react';
import { GoArrowRight } from 'react-icons/go';

const StatsCard = ({ icon, iconColor, iconBgColor, title, description, actionText, textColor, link }) => {
  return (
    <div className="w-full md:w-[24%] p-4 rounded-lg border bg-white">
      <div className="flex items-center justify-start gap-2 mb-2">
        <span className={`p-3 rounded ${iconBgColor} ${iconColor} text-lg md:text-xl`}>{icon}</span>
        <div>
          <h3 className="text-headingColor font-bold text-base">{title}</h3>
          <p className="text-sm text-paraColor">{description}</p>
        </div>
      </div>
      <Link href={link} className={`text-sm mt-3 flex items-center justify-start gap-1 font-medium ${textColor}`}>
        {actionText} <span><GoArrowRight className='mt-1 text-xs md:text-sm' /></span>
      </Link>
    </div>
  );
};

export default StatsCard;