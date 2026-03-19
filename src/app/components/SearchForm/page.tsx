'use client';
import React, { useState } from "react";

interface SearchData {
  from: string;
  to: string;
  departureDate: string;
}

const SearchForm = () => {
  const  [token,setTokan] = useState<string>("eyJraWQiOiJFa0I1SkxyV0R3R0NpV2xvWHl6dEVVUCtqcU9wSDlYNlFoN2t5dHZoU2d3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4ZDYzYzUwMC1hMWRmLTRjZTEtOTQ1Ny0zMmEzMjliNDg4NzUiLCJjdXN0b206cm9sZXMiOiJHUk9VUF9BRE1JTiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9md1A5aU5NZ0EiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGQ2M2M1MDAtYTFkZi00Y2UxLTk0NTctMzJhMzI5YjQ4ODc1Iiwib3JpZ2luX2p0aSI6ImM5MzMyYTM0LWNhMDEtNGIxYS1iYzczLWU0NTVkNjc2NWMxNyIsImF1ZCI6IjVsM2hlNmJwN3BrNWxibzQ1Nmw3MmMzZmxuIiwiZXZlbnRfaWQiOiI3NDExZDhjNi03M2IyLTQ1MzgtYjI4MS0zOTM4MDEyMWU1OTQiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc3MzkzODQ3MywibmFtZSI6IkhpbWFuc2h1IFBhbCIsImV4cCI6MTc3NDAyNDg3MywiaWF0IjoxNzczOTM4NDczLCJqdGkiOiIyODRjMjQ0Zi1lNDZhLTQ5OTEtYTdkMS1lZGY0ODFlYjkyZTkiLCJlbWFpbCI6ImhpbWFuc2h1LnBhbEBmYXJlbmV4dXMuY29tIn0.QUsbuyyxeVi-R9tLrWH96E4K9fq1frxvcW4XyAFMG4bltiNaQVEkIPRVwtz8qB5BCUt4ILqF0APKG-p7RDQvYaaH9EkhDdE3zv05sy_NrNCMDghPpoIPSKQsZ9xebnXj2s8shTPWAk4y7EQYsk9eGSH-R15hJm52xFqD08PqHBmLLeAhu0JNaiSA804hvj5CTvejL89gA7jgQ__1SgS7AcfMPjUm3Fbz5u_Pb2LcjnBV6c2zCT7flOSz_-ActFPVPUXsELI9oOZwVeW0WazwIivggva3RAf28SQ_AJgcGvOPWUt91i6Q3Sd4WxAt5IMrQYfMYvQ2pkaa2KLyYdL44Q");
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
  const [tripType, setTripType] = useState<string>("RT");
  const requestdata = {
    editBeforeSending: false,
    enhancedSeatingFlow: true,
    flightPassResultsOnly: false,
    pos: "CA",
    isAgency: true,
    corporateCodes: [],
	  flight: [
      {
        windowDate: 0,
        sequence: 1,
        departureAirport: "YUL",
        departureType: "FLIGHT",
        arrivalAirport: "YVR",
        arrivalType: "CITY",
        departureDate: "2026-03-18",
        departureTime: "",
        timeSlot: null,
        departTimeRange: "",
        arrivalTimeRange: "",
        connectionTime: "",
        departTimeWindow: "",
        arrivalTimeWindow: "",
        travelClass: "ECO"
      }
    ],
    passenger: [
      {
        type: "ADT",
        quantity: 1
      },
      {
        type: "YTH",
        quantity: 0
      }
    ],
    tripType: "OW",
    travelClass: "UNK",
    inclusiveFlights: [
      "CB_GDS"
    ],
    maxStops: "4",
    searchByTime: false,
    hideBasicFare: false,
    isFlexibleDate: false,
    ndcPromo: "",
    eUpgradeTo: "",
    liveConnect: false,
    baggagePieces: null,
    corporateName: "sandbox",
    airShopping: "V2",
    flightTypeShow: "all",
    aggregatorCode: "",
    pcc: "",
    iataVersion: "17",
    language: "EN"
  }
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
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("searchData", searchData);

    const requestBody = {
      request: JSON.stringify(requestdata),
      xml: null
    };

    const url = "https://stgapi.a.farenexushub.com/sandbox-session/v2/createSearch";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      // ✅ Handle HTTP errors properly
      if (!response.ok) {
        const errorText = await response.text(); // fallback if not JSON
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // ✅ Parse JSON safely
      const data = await response.json();

      console.log("response", data.id);
      await executeSearch(data.id);
    
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  const executeSearch = async (id: string) => {
    const url = `https://stgapi.a.farenexushub.com/sandbox-session/v2/executeSearch/${id}`;
    try {
      const response = await fetch(url,{
        method:"GET",
        headers:{
          'COntent-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json();
      console.log("execute response", data);
    }catch(error){
      console.error("Error during search execution:", error);
    }
  }

  const addRemoveTripType = (type: string) => {
    setTripType(type);
    if(type === 'RT'){
      if(searchData.length === 1){
        setSearchData((prev) => [
          ...prev,
          {
            from: "",
            to: "",
            departureDate: ""
          }
        ]);
      }else if(searchData.length > 2){
        setSearchData((prev) => prev.slice(0,2));
      }
    } else if(type === 'OW'){
      if(searchData.length > 1){
        setSearchData((prev) => prev.slice(0,1));
      }
    } else if(type === 'MC'){
      if(searchData.length === 1){
        setSearchData((prev) => [
          ...prev,
          {
            from: "",
            to: "",
            departureDate: ""
          }
        ]);
      }
    }
  }

  const addRemoveMulticity = (action: string) => {
    if(action === 'add'){
      if(searchData.length < 6){
        setSearchData((prev) => [
          ...prev,
          {
            from: "",
            to: "",
            departureDate: ""
          }
        ]);
      }
    }else if(action === 'remove'){
      if(searchData.length > 2){
        setSearchData((prev) => prev.slice(0,prev.length-1));
      }
    }
  }
  
  return (
    <div className="">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full">

        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Flight Search ✈️
        </h2> */}
        <div className="flex mb-4 justify-between">
          <div className="d-flex">
            <button onClick={()=>addRemoveTripType('RT')} className={`border border-gray-300 px-4 cursor-pointer mr-2 ${tripType === 'RT' ? 'bg-blue-600 text-white' : ''}`}>Round Trip</button>
            <button onClick={()=>addRemoveTripType('OW')} className={`border border-gray-300 px-4 cursor-pointer mr-2 ${tripType === 'OW' ? 'bg-blue-600 text-white' : ''}`}>One Way</button>
            <button onClick={()=>addRemoveTripType('MC')} className={`border border-gray-300 px-4 cursor-pointer ${tripType === 'MC' ? 'bg-blue-600 text-white' : ''}`}>Multi City</button>
          </div>
          {
            tripType === 'MC' && (
              <>
                <div>
                  {
                    searchData.length > 1 && searchData.length < 6 && (
                      <span className="border px-1 cursor-pointer mr-2" onClick={()=>addRemoveMulticity('add')}>+</span>
                    )
                  }
                  
                  {searchData.length > 2 && (
                    <span className="border px-1 cursor-pointer" onClick={()=>addRemoveMulticity('remove')}>-</span>
                  )}
                </div>
              </>
            )
          }
          
        </div>
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

      </div>
    </div>
  );
};

export default SearchForm;