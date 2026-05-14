'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

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
interface storeState {
  counter: {
    token: string;
  };
}
type TripType = "RT" | "OW" | "MC";
const SearchForm = () => {
  const storeToken = useSelector((state:storeState) => state.counter.token);
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
      if (name === 'departureDate' && updated[index + 1]) {
        const currentDate = updated[index].departureDate;
        const nextDate = updated[index + 1].departureDate;

        if (!nextDate || nextDate < currentDate) {
          updated[index + 1].departureDate = currentDate;
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
    localStorage.setItem('token',JSON.stringify(storeToken));
    localStorage.setItem('tripType',JSON.stringify(tripType));
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
          Authorization: `Bearer ${storeToken}`
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
            departureAirport: searchData[prev.length - 1]?.arrivalAirport, // ✅ Set to last departure airport
            departureType: "CITY",
            arrivalAirport: searchData[prev.length - 1]?.departureAirport, // ✅ Set to last arrival airport
            arrivalType: "FLIGHT",
            departureDate: searchData[prev.length - 1]?.departureDate || getTodayDate(),
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
      if(searchData.length === 2){
        setSearchData((prev) => {
          const updated = [...prev];
          updated[1] = {
            ...updated[1],
            departureAirport: updated[0].arrivalAirport,
            arrivalAirport: updated[0].departureAirport,
            departureDate: updated[0].departureDate
          }as SearchSegment;
          return updated;
        });
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
            departureDate: searchData[prev.length - 1]?.departureDate || getTodayDate(),
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
              departureDate: searchData[prev.length - 1]?.departureDate || getTodayDate(), // ✅ Set to last departure date or today
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
  
  const getTodayLocalDate = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  }
  useEffect(()=>{
    let searchRequest = localStorage.getItem('searchRequest');
    let tripType = localStorage.getItem('tripType');
    if (searchRequest) {
      const parsedData = JSON.parse(searchRequest);
      console.log('Retrieved search request:', parsedData);
      setSearchData(parsedData);
    }
    if (tripType) {
      setTripType(JSON.parse(tripType));
    }
  },[]);
  return (
    <div className="">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full">

        {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Flight Search ✈️
        </h2> */}
        {/* {JSON.stringify(storeToken)} */}
        <div className="flex mb-4 justify-between">
          <div className="d-flex">
            <button onClick={()=>addRemoveTripType('RT')} className={`border border-gray-300 px-4 cursor-pointer mr-2 ${tripType === 'RT' ? 'selectedTab text-white' : ''}`}>Round Trip</button>
            <button onClick={()=>addRemoveTripType('OW')} className={`border border-gray-300 px-4 cursor-pointer mr-2 ${tripType === 'OW' ? 'selectedTab text-white' : ''}`}>One Way</button>
            <button onClick={()=>addRemoveTripType('MC')} className={`border border-gray-300 px-4 cursor-pointer ${tripType === 'MC' ? 'selectedTab text-white' : ''}`}>Multi City</button>
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
                                disabled={index !== 0 && tripType === 'RT'} // Disable if it's not the first segment in Round Trip
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
                                disabled={index !== 0 && tripType === 'RT'} // Disable if it's not the first segment in Round Trip
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
                                min={index === 0? getTodayLocalDate(): searchData[index - 1]?.departureDate || getTodayLocalDate()}
                                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                    )
                })
            }
          
          {/* Button */}
          <div className="md:col-span-2 text-right flex justify-end">
            <button
              type="submit"
              className="px-4 flex items-center gap-1 selectedTab text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
              </svg>
              Search Flights
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default SearchForm;