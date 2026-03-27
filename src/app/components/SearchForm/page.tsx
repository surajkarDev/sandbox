'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";

type SearchSegment = {
  windowDate: number;
  sequence: number;
  departureAirport: string;
  departureType: string;
  arrivalAirport: string;
  arrivalType: string;
  departureDate: string;
  departureTime: string;
  timeSlot: string | null;
  departTimeRange: string;
  arrivalTimeRange: string;
  connectionTime: string;
  departTimeWindow: string;
  arrivalTimeWindow: string;
  travelClass: string;
};
type RequestData = {
  editBeforeSending: boolean;
  enhancedSeatingFlow: boolean;
  flightPassResultsOnly: boolean;
  pos: string;
  isAgency: boolean;
  corporateCodes: string[];
  flight: SearchSegment[];
  passenger: { type: string; quantity: number }[];
  tripType: string;
  travelClass: string;
  inclusiveFlights: string[];
  maxStops: string;
  searchByTime: boolean;
  hideBasicFare: boolean;
  isFlexibleDate: boolean;
  ndcPromo: string;
  eUpgradeTo: string;
  liveConnect: boolean;
  baggagePieces: number | null;
  corporateName: string;
  airShopping: string;
  flightTypeShow: string;
  aggregatorCode: string;
  pcc: string;
  iataVersion: string;
  language: string;
};
type TripType = "RT" | "OW" | "MC";
const SearchForm = () => {
  const  [token,setTokan] = useState<string>("eyJraWQiOiJFa0I1SkxyV0R3R0NpV2xvWHl6dEVVUCtqcU9wSDlYNlFoN2t5dHZoU2d3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4ZDYzYzUwMC1hMWRmLTRjZTEtOTQ1Ny0zMmEzMjliNDg4NzUiLCJjdXN0b206cm9sZXMiOiJHUk9VUF9BRE1JTiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0yLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMl9md1A5aU5NZ0EiLCJjb2duaXRvOnVzZXJuYW1lIjoiOGQ2M2M1MDAtYTFkZi00Y2UxLTk0NTctMzJhMzI5YjQ4ODc1Iiwib3JpZ2luX2p0aSI6IjhjNWMxNTU1LTU5ZTgtNGI3OS1iMTBjLTZkMjE1ZDUzOWM1NyIsImF1ZCI6IjVsM2hlNmJwN3BrNWxibzQ1Nmw3MmMzZmxuIiwiZXZlbnRfaWQiOiJjOGJhNDFiMC01ODdhLTQ0MmYtODA0ZC1mNTJiYTZjZTg1ZGMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc3NDU5NjcxNCwibmFtZSI6IkhpbWFuc2h1IFBhbCIsImV4cCI6MTc3NDY4MzExNCwiaWF0IjoxNzc0NTk2NzE0LCJqdGkiOiI3MTBiZTAwMy02YTlmLTQwZmMtYjM1MC1kOGVhN2ZiYTJkYTEiLCJlbWFpbCI6ImhpbWFuc2h1LnBhbEBmYXJlbmV4dXMuY29tIn0.c7RtPmMWMzsx2rWckha8Ah8c6cMtpy5FUzTEJEkpdWkXrqF3iGHytXKpVbZctPL1fCvIKqJzWc_AEY1sDznMdazKBRLCsfGc0U3EqzIQTxrJFSupFxGZnM-HU7e_3Ei2PwOyLRM3rw3z9yGq9FOfeRVrFfl-9xVlmya9aXU5n9L9VFMLrAh63nqgLiwkvhMZFl2TnrDsJgbNZY5fP6CQpSMT4wx_FEuco9cmSbKZ2NeuFO_lSuGC7kNnYRGlLgLClstOdCZqTiar5SK3jOEgYDa1E_hze7GoGQBcbzGmMI4vw1QdLT3Z_MzvDNsKbVDK0s7ZOAFjPIYdLzkiHmQhzQ");
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  };
  const [searchData, setSearchData] = useState<SearchSegment[]>([
    {
			windowDate: 0,
			sequence: 1,
			departureAirport: "",
			departureType: "FLIGHT",
			arrivalAirport: "",
			arrivalType: "CITY",
			departureDate: getTodayDate(),
			departureTime: "",
			timeSlot: null,
			departTimeRange: "",
			arrivalTimeRange: "",
			connectionTime: "",
			departTimeWindow: "",
			arrivalTimeWindow: "",
			travelClass: "ECO"
		},
    {
			windowDate: 0,
			sequence: 2,
			departureAirport: "",
			departureType: "CITY",
			arrivalAirport: "",
			arrivalType: "FLIGHT",
			departureDate: getTodayDate(),
			departureTime: "",
			timeSlot: null,
			departTimeRange: "",
			arrivalTimeRange: "",
			connectionTime: "",
			departTimeWindow: "",
			arrivalTimeWindow: "",
			travelClass: "ECO"
		},
  ]);
  const router = useRouter();
  const [tripType, setTripType] = useState<TripType>("RT");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    // setSearchData((prev) => ({ ...prev, [name]: value }));
    setSearchData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: name === "departureDate" ? value : value.toUpperCase(),
      }as SearchSegment;
      if (tripType === "RT") {
        if (name === "departureAirport" && updated[index + 1]) {
          updated[index + 1].arrivalAirport = value.toUpperCase();
        }

        if (name === "arrivalAirport" && updated[index + 1]) {
          updated[index + 1].departureAirport = value.toUpperCase();
        }
      }
      return updated;
    });
  };
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const requestdata: RequestData = {
      editBeforeSending:false,
      enhancedSeatingFlow:true,
      flightPassResultsOnly:false,
      pos:"CA",
      isAgency:false,
      corporateCodes:[],
      flight: searchData, // ✅ directly assign
      passenger:[
        {type:"ADT",quantity:1},
        {type:"YTH",quantity:0}
      ],
      tripType:"MC",
      travelClass:"UNK",
      inclusiveFlights:["CB_GDS"],
      maxStops:"4",
      searchByTime:false,
      hideBasicFare:false,
      isFlexibleDate:false,
      ndcPromo:"",
      eUpgradeTo:"",
      liveConnect:false,
      baggagePieces:null,
      corporateName:"sandbox",
      airShopping:"V2",
      flightTypeShow:"all",
      aggregatorCode:"",
      pcc:"",
      iataVersion:"17",
      language:"EN"
    };
    console.log("searchData", searchData);
    localStorage.setItem('searchRequest',JSON.stringify(searchData));
    localStorage.setItem('token',JSON.stringify(token));
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
      // await executeSearch(data.id);
      router.push(`/pages/Lfspage/${data.id}`);
    
    } catch (error) {
      console.error("Error during search:", error);
    }
  };
  

  const addRemoveTripType = (type: TripType) => {
    setTripType(type);
    if(type === 'RT'){
      if(searchData.length === 1){
        setSearchData((prev) => [
          ...prev,
          {
            windowDate: 0,
            sequence: 2,
            departureAirport: "",
            departureType: "CITY",
            arrivalAirport: "",
            arrivalType: "FLIGHT",
            departureDate: getTodayDate(),
            departureTime: "",
            timeSlot: null,
            departTimeRange: "",
            arrivalTimeRange: "",
            connectionTime: "",
            departTimeWindow: "",
            arrivalTimeWindow: "",
            travelClass: "ECO"
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
            windowDate: 0,
            sequence: 2,
            departureAirport: "",
            departureType: "CITY",
            arrivalAirport: "",
            arrivalType: "FLIGHT",
            departureDate: getTodayDate(),
            departureTime: "",
            timeSlot: null,
            departTimeRange: "",
            arrivalTimeRange: "",
            connectionTime: "",
            departTimeWindow: "",
            arrivalTimeWindow: "",
            travelClass: "ECO"
          }
        ]);
      }
    }
  }

  const addRemoveMulticity = (action: 'add' | 'remove'): void => {
    setSearchData((prev) => {
      if (action === 'add') {
        if (prev.length < 6) {
          return [
            ...prev,
            {
              windowDate: 0,
              sequence: prev.length + 1, // ✅ FIXED
              departureAirport: "",
              departureType: "CITY",
              arrivalAirport: "",
              arrivalType: "FLIGHT",
              departureDate: getTodayDate(),
              departureTime: "",
              timeSlot: null,
              departTimeRange: "",
              arrivalTimeRange: "",
              connectionTime: "",
              departTimeWindow: "",
              arrivalTimeWindow: "",
              travelClass: "ECO"
            }
          ];
        }
        return prev;
      }

      if (action === 'remove') {
        if (prev.length > 2) {
          return prev.slice(0, prev.length - 1);
        }
        return prev;
      }

      return prev;
    });
  };
  
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
                                name="departureAirport"
                                placeholder="City or Airport"
                                value={location.departureAirport}
                                onChange={(e)=>handleChange(e,index)}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* To */}
                            <div className="flex flex-col">
                                <label className="text-sm text-gray-600 mb-1">To</label>
                                <input
                                type="text"
                                name="arrivalAirport"
                                placeholder="City or Airport"
                                value={location.arrivalAirport}
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