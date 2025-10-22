import React, { useState } from 'react';
import Intro from '../../common/intro/intro';
import { FaInfoCircle } from 'react-icons/fa';
import SystemUserTable from '../systemUserTable/systemUserTable';
import SystemUserRolesTable from '../systemUserRoleTable/systemUserRoleTable';
import Breadcrumb from '../../common/breadcrumb/breadcurmb';
import Header from '../../common/header/header';

const UserRoleManagementMainPage = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Port Surveillance", href: "#" },
    { label: "Users & Roles", href: "/user-role-management" },
  ];

  const [activeTab, setActiveTab] = useState('users');

  const tabs = [
    { id: 'users', label: 'Users', component: <SystemUserTable /> },
    { id: 'roles', label: 'User Roles', component: <SystemUserRolesTable /> },
  ];

  return (
    <div>
      <Header variant="variant4" />
      <Breadcrumb items={breadcrumbItems} />
      <div className="bg-blue-50 text-blue-600 border-y-0 border-r-gray-300 border-r border-l-2 border-blue-600 p-2 flex items-center justify-start gap-2">
        <FaInfoCircle />
        <p>
          <span className="font-semibold">Note:</span> User profiles are for system access only — detections are object-based and not linked to individual users.
        </p>
      </div>
      <div className="p-3">
        <Intro
          heading="Users & Roles Management"
          des="Manage system access and user permissions for the surveillance platform"
          headingClassName="text-xl md:text-2xl lg:text-3xl font-bold"
        />
        <div className="mt-6">
          <div className="flex border-b border-gray-200 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div>{tabs.find((tab) => tab.id === activeTab)?.component}</div>
        </div>
      </div>
    </div>
  );
};

export default UserRoleManagementMainPage;