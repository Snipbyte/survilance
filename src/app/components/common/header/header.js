import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaBell, FaBars } from "react-icons/fa";
import { FaFileCsv, FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { MdMenu, MdOutlineArrowBack } from "react-icons/md";
import Cookies from "js-cookie";
import { getUserProfile , logoutUser } from "../../../../../utils/organization/auth/api";

const Header = ({ variant = "default" }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.user);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Optionally redirect to login if token is invalid
        Cookies.remove("orgUserToken");
        router.push("/login");
      }
    };
    fetchUserProfile();
  }, [router]);

  // Get initials from userFullName
  const getInitials = (name) => {
    if (!name) return "A";
    const names = name.split(" ").filter(Boolean);
    if (names.length === 0) return "A";
    const initials = names.length > 1
      ? `${names[0][0]}${names[1][0]}`
      : names[0][0];
    return initials.toUpperCase();
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      Cookies.remove("orgUserToken");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getHeaderVariant = () => {
    const initials = user ? getInitials(user.userFullName) : "A";

    switch (variant) {
      case "variant1":
        return (
          <div className="bg-white p-3 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
               
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="flex space-x-2 mb-2 md:mb-0">
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                    defaultValue="2024-12-15"
                  />
                  <span className="text-gray-600 hidden md:inline">to</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                    defaultValue="2024-12-15"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full md:w-48 outline-none mb-2 md:mb-0"
                />
                
              
                <div className="relative">
                  <div
                    className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {initials}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-[10000]">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "variant2":
      case "variant4":
      case "variant5":
        return (
          <div className="bg-white p-3 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 mb-2 md:mb-0">
                  <MdOutlineArrowBack /> Back to Dashboard
                </Link>
              
                <div className="relative">
                  <div
                    className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {initials}
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-[10000]">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "variant3":
        return (
          <div className="bg-white p-3 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
              
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 text-sm mb-2 md:mb-0">
                <MdOutlineArrowBack /> Back to Dashboard
              </Link>
              {/* <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                <button className="bg-red-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0">
                  <FaFilePdf />PDF
                </button>
                <button className="bg-green-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0">
                  <FaFileCsv />CSV
                </button>
                <button className="bg-blue-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto">
                  <FaFileExcel />XLSX
                </button>
              </div> */}
            
              <div className="relative">
                <div
                  className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {initials}
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-[10000]">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-3 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
               
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <div className="flex space-x-2 mb-2 md:mb-0">
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                    defaultValue="2024-12-15"
                  />
                  <span className="text-gray-600 hidden md:inline">to</span>
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                    defaultValue="2024-12-15"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full md:w-48 outline-none mb-2 md:mb-0"
                />
              
                <div className="relative">
                  <div
                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-600 font-medium">{initials}</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-[10000]">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return getHeaderVariant();
};

export default Header;