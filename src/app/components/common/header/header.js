import Link from 'next/link'
import React from 'react'
import { FaBell, FaBars } from 'react-icons/fa'
import { FaFileCsv, FaFileExcel, FaFilePdf } from 'react-icons/fa6'
import { MdMenu, MdOutlineArrowBack } from 'react-icons/md'

const Header = ({ variant = "default" }) => {
    const getHeaderVariant = () => {
        switch (variant) {
            case "variant1":
                return (
                    <div className="bg-white p-3 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                                <span className="text-sm text-paraColor">Singapore Maritime Port | Dec 15, 2024</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                                <div className="flex space-x-2 mb-2 md:mb-0">
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                                        defaultValue="2024-12-15"
                                    />
                                    <span className="text-paraColor hidden md:inline">to</span>
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
                                <button className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 duration-300 flex items-center justify-center gap-1 w-full md:w-auto">
                                    <MdMenu />Menu
                                </button>
                                <FaBell className="text-gray-600 cursor-pointer w-6 h-6 md:w-auto md:h-auto" />
                                <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "variant2":
                return (
                    <div className="bg-white p-3 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                                <span className="text-xs text-paraColor">Singapore Maritime Port - Dec 15, 2025</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 mb-2 md:mb-0"><MdOutlineArrowBack /> Back to Dashboard</Link>
                                <FaBell className="text-paraColor text-sm w-6 h-6 md:w-auto md:h-auto" />
                                <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "variant3":
                return (
                    <div className="bg-white p-3 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center space-x-2 mb-2 md:mb-0">
                            <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                            <span className="text-xs text-paraColor">Singapore Maritime Port - Dec 15, 2025</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 text-sm mb-2 md:mb-0"><MdOutlineArrowBack /> Back to Dashboard</Link>
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
                                <button className="bg-red-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0"><FaFilePdf />PDF</button>
                                <button className="bg-green-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto mb-2 md:mb-0"><FaFileCsv />CSV</button>
                                <button className="bg-blue-600 text-white rounded-md px-2 py-1 text-sm flex items-center justify-center gap-1 w-full md:w-auto"><FaFileExcel />XlSX</button>
                            </div>
                            <FaBell className="text-paraColor text-sm w-6 h-6 md:w-auto md:h-auto mb-2 md:mb-0" />
                            <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center">
                                A
                            </div>
                        </div>
                    </div>
                )

            case "variant4":
                return (
                    <div className="bg-white p-3 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                                <span className="text-xs text-paraColor">Singapore Maritime Port - Dec 15, 2025</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 mb-2 md:mb-0"><MdOutlineArrowBack /> Back to Dashboard</Link>
                                <FaBell className="text-paraColor text-sm w-6 h-6 md:w-auto md:h-auto" />
                                <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case "variant5":
                return (
                   <div className="bg-white p-3 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                                <span className="text-xs text-paraColor">Singapore Maritime Port - Dec 15, 2025</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 flex items-center gap-1 duration-300 mb-2 md:mb-0"><MdOutlineArrowBack /> Back to Dashboard</Link>
                                <FaBell className="text-paraColor text-sm w-6 h-6 md:w-auto md:h-auto" />
                                <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="bg-white p-3 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                            <div className="flex items-center space-x-2 mb-2 md:mb-0">
                                <h1 className="text-lg md:text-2xl font-bold text-blue-900">Port Surveillance</h1>
                                <span className="text-sm text-paraColor">Singapore Maritime Port | Dec 15, 2024</span>
                            </div>
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                                <div className="flex space-x-2 mb-2 md:mb-0">
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded px-2 py-1 text-sm outline-none w-full md:w-28"
                                        defaultValue="2024-12-15"
                                    />
                                    <span className="text-paraColor hidden md:inline">to</span>
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
                                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 w-full md:w-auto mb-2 md:mb-0">
                                    ≡ Menu
                                </button>
                                <FaBell className="text-gray-600 cursor-pointer w-6 h-6 md:w-auto md:h-auto mb-2 md:mb-0" />
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-600 font-medium">A</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return getHeaderVariant()
}

export default Header