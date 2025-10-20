import React from 'react';
import { FaChartLine, FaFileAlt, FaUsers, FaCog } from 'react-icons/fa';
import StatsCard from '../statsCard/statsCard';

const StatsSection = () => {
  const cardData = [
    {
      icon: <FaChartLine />,
      iconColor: 'text-blue-500',
      iconBgColor: 'bg-blue-100',
      title: 'PPE Compliance',
      description: 'Detailed compliance reports',
      actionText: 'View Analytics',
      textColor: 'text-blue-600',
      link: '/ppe-compliance',
    },
    {
      icon: <FaFileAlt />,
      iconColor: 'text-green-500',
      iconBgColor: 'bg-green-100',
      title: 'Reporting',
      description: 'Generate custom reports',
      actionText: 'Create Report',
      textColor: 'text-green-600',
      link: '/reporting',
    },
    {
      icon: <FaUsers />,
      iconColor: 'text-purple-500',
      iconBgColor: 'bg-purple-100',
      title: 'Users & Roles',
      description: 'Manage access and permissions',
      actionText: 'Manage Users',
      textColor: 'text-purple-600',
      link: '/user-role-management',
    },
    {
      icon: <FaCog />,
      iconColor: 'text-gray-500',
      iconBgColor: 'bg-gray-100',
      title: 'Settings & Customization',
      description: 'Configure system preferences',
      actionText: 'Open Settings',
      textColor: 'text-gray-600',
      link: '/setting-customization',
    },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 my-6">
      {cardData.map((card, index) => (
        <StatsCard
          key={index}
          icon={card.icon}
          iconColor={card.iconColor}
          iconBgColor={card.iconBgColor}
          title={card.title}
          description={card.description}
          actionText={card.actionText}
          textColor={card.textColor}
          link={card.link}
        />
      ))}
    </div>
  );
};

export default StatsSection;