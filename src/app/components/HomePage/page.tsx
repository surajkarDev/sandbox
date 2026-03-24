'use client'
import React from 'react';
import Image from "next/image";
import { usePathname, useSearchParams } from 'next/navigation';
const HomePage = (props: { children: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return (
    <div>
        <div className="min-h-screen bg-gray-50">
          
          {/* Header */}
          {
            fullUrl !== '/' && (
                <header className="shadow-md">
            
                    {/* Top Header */}
                    <div className="bg-black px-6 py-6 flex items-center gap-6">
                    <Image
                        src="https://sandbox.stg.w.farenexushub.com/_nuxt/img/ac-logo-white.05f46aa.svg"
                        alt="logo"
                        width={230}
                        height={40}
                    />
                    <div className="distribution-img position: relative">
                        <Image
                        src="https://sandbox.stg.w.farenexushub.com/_nuxt/img/newdistributioncapability.7986f83.svg"
                        alt="distribution"
                        width={423.5}
                        height={40}
                        />
                    </div>
                    </div>

                    {/* Navbar */}
                    <div className="px-6 py-3 flex items-center justify-between">
                    
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        
                        {/* Home Icon */}
                        <span className="cursor-pointer text-white text-lg">
                        🏠
                        </span>

                        {/* Dropdown */}
                        <div className="relative group">
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm">
                            UAT NDC SANDBOX
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute hidden group-hover:block bg-white text-black mt-2 rounded-md shadow-lg w-52 z-10">
                            <ul className="text-sm">
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                BAT NDC SANDBOX
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                PROD NDC SANDBOX
                            </li>
                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                CRT NDC SANDBOX
                            </li>
                            </ul>
                        </div>
                        </div>

                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        
                        {/* Feedback */}
                        <button className="bg-gray-700 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800">
                        Feedback
                        </button>

                        {/* Partner Type */}
                        <select className="px-2 py-1 rounded-md text-sm border">
                        <option value="ACO">Consumer</option>
                        <option value="ADO">Agency</option>
                        </select>

                        {/* User */}
                        <span className="text-white text-sm font-medium">
                        Himanshu Pal
                        </span>

                        {/* Logout */}
                        <span className="cursor-pointer text-white text-lg">
                        ⎋
                        </span>

                    </div>
                    </div>
                </header>
            )
          }
          

          {/* Page Content */}
          <main>
            <div className="w-full">
              <div className="flex">
                {
                    fullUrl !== '/' && (
                        <div className="w-1/12 border-r border-gray-300">
                            {[
                                "Flights",
                                "Bookings",
                                "Booking Summary",
                                "XML Logs",
                                "Configuration",
                                "Test Cases",
                                "Release Note",
                                "Test Data",
                                "Editor",
                                "Page Generator",
                                "XML Validate",
                            ].map((item, index) => (
                                <div
                                key={index}
                                className="flex flex-col items-center justify-center py-4 border-b cursor-pointer border-gray-300 hover:bg-gray-200 transition"
                                >
                                {/* Icon Placeholder */}
                                <div className="text-xl mb-1">🔹</div>

                                {/* Label */}
                                <span className="text-sm text-center leading-tight">
                                    {item}
                                </span>
                                </div>
                            ))}
                        </div>
                    )
                }
                
                <div className={fullUrl !== '/' ? 'w-11/12': 'w-full'}>
                  {props.children}
                </div>
              </div>
            </div>
          </main>
          
        </div>
    </div>
  );
}

export default HomePage;