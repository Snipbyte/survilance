import React from "react";
import StatsCard from "../statsCard/statsCard";
import { FaExclamationTriangle, FaCheckCircle, FaUserAlt, FaBan, FaGlasses } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { FaHand, FaHelmetSafety } from "react-icons/fa6";
import { TbJacket } from "react-icons/tb";

const StatsSection = () => {
  const statsData = [
    {
      title: "Total Non-Compliant",
      icon: FaExclamationTriangle,
      iconColor: "text-red-500",
      mainValue: "1,284",
      mainColor: "text-red-600",
      subText: "Today's events",
      subColor: "text-paraColor",
    },
    {
      title: "Vest Violations",
      icon: TbJacket,
      iconColor: "text-orange-500",
      mainValue: "342",
      mainColor: "text-headingColor",
      subText: "26.6% of total",
      subColor: "text-red-500",
    },
    {
      title: "Helmet Violations",
      icon: FaHelmetSafety,
      iconColor: "text-blue-500",
      mainValue: "298",
      mainColor: "text-headingColor",
      subText: "23.2% total",
      subColor: "text-red-500",
    },
    {
      title: "Gloves Violations",
      icon: FaHand,
      iconColor: "text-yellow-500",
      mainValue: "387",
      mainColor: "text-headingColor",
      subText: "30.1% of total",
      subColor: "text-red-500",
    },
    {
      title: "Other PPE",
      icon: FaGlasses,
      iconColor: "text-green-500",
      mainValue: "257",
      mainColor: "text-headingColor",
      subText: "20.0% of total",
      subColor: "text-red-500",
    },
  ];

  return (
    <div className="flex flex-wrap justify-between my-6">
      {statsData.map((item, index) => (
        <StatsCard key={index} {...item} />
      ))}
    </div>
  );
};

export default StatsSection;
