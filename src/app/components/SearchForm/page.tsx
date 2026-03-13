'use client';
import React, { useState } from "react";

interface SearchData {
  from: string;
  to: string;
  departureDate: string;
}

const SearchForm = () => {
  const [searchData, setSearchData] = useState<SearchData[]>([
    {
        from: "",
        to: "",
        departureDate: ""
    },
    {
        from: "",
        to: "",
        departureDate: ""
    }
 ]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("searchData", searchData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    // setSearchData((prev) => ({ ...prev, [name]: value }));
    setSearchData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Flight Search ✈️
        </h2>
        <form onSubmit={handleSearch}>
            {
                searchData.map((location,index)=> {
                    return (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                            {/* From */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">From</label>
                                <input
                                type="text"
                                name="from"
                                placeholder="City or Airport"
                                value={location.from}
                                onChange={(e)=>handleChange(e,index)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* To */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">To</label>
                                <input
                                type="text"
                                name="to"
                                placeholder="City or Airport"
                                value={location.to}
                                onChange={(e)=>handleChange(e,index)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Departure */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">Departure Date</label>
                                <input
                                type="date"
                                name="departureDate"
                                value={location.departureDate}
                                onChange={(e)=>handleChange(e,index)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                    )
                })
            }
          
          {/* Button */}
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="px-4 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Search Flights 🔍
            </button>
          </div>
        </form>

        {/* Debug */}
        {/* <div className="mt-6 text-sm text-gray-500">
          {JSON.stringify(searchData)}
        </div> */}
      </div>
    </div>
  );
};

export default SearchForm;