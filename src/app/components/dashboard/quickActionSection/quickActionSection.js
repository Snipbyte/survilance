import React from 'react';
import { FaFileAlt, FaEye, FaUsers, FaDownload } from 'react-icons/fa';
import Link from 'next/link';

const QuickActionSection = () => {
  const actionData = [
    {
      icon: <FaFileAlt />,
      text: 'Generate PPE Report',
      bgColorHover: 'hover:bg-blueColor',
      hoverTextColor: 'hover:text-white',
      component: Link,
      href: '/reporting',
    },
    {
      icon: <FaEye />,
      text: 'View PPE Compliance',
      bgColorHover: 'hover:bg-blueColor',
      hoverTextColor: 'hover:text-white',
      component: Link,
      href: '/ppe-compliance',
    },
    {
      icon: <FaUsers />,
      text: 'Manage Users',
      bgColorHover: 'hover:bg-blueColor',
      hoverTextColor: 'hover:text-white',
      component: Link,
      href: '/user-role-management',
    },
    // {
    //   icon: <FaDownload />,
    //   text: 'Export Data',
    //   bgColorHover: 'hover:bg-blueColor',
    //   hoverTextColor: 'hover:text-white',
    //   component: 'button',
    // },
  ];

  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-headingColor font-bold text-xl mb-4">Quick Actions</h3>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
        {actionData.map((action, index) => {
          const Component = action.component;
          return (
            <Component
              key={index}
              {...(action.href ? { href: action.href } : {})}
              className={`flex items-center px-4 py-1 rounded-lg border ${action.bgColorHover} ${action.hoverTextColor} text-paraColor transition-colors duration-200 w-full md:w-auto`}
            >
              <span className="mr-2 text-lg md:text-xl">{action.icon}</span>
              <span className="text-sm md:text-base">{action.text}</span>
            </Component>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionSection;