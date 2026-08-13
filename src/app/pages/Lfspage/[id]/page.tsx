'use client';

import React, { useEffect, useState } from 'react';
import { useParams,useRouter } from 'next/navigation';
import "../../../../../public/css/LfsPage.css";


/* =========================
   ✅ TYPES
========================= */

type FlightSegment = {
  flightDuration(flightDuration: any): string;
  departure: { airportCode: string };
  arrival: { airportCode: string };
  operatingCarrier: { code: string, name: string };
  flightNumber: string | number;
  departureDateTime: string | number;
  arrivalDateTime: string | number;
  equipment: { code: string };
};

type OriginDestinationInfo = {
  flightSegmentInfo: FlightSegment[];
  boundDuration:number;
};
type PriceClass = {
  fareClass : string;
  fareClassType : string;
}
type FareFamily = {
  priceClass: PriceClass[];
  reviewKey: string;
  totalPrice: string;
  currencyCode: string;
  boundIndex?: number;
  originDestinationInfo: OriginDestinationInfo[];
};

type SliceItinerary = {
  originDestinationInfo: OriginDestinationInfo[];
  fareFamily:FareFamily[];
  tripType?: string;
  boundIndex?: number;
};

type SowSlice = {
  sliceItinerary: SliceItinerary[];
};

type SearchResult = {
  status: object;
  warning: object[];
  sowSliceItinerary: SowSlice[];
  sliceItinerary: SliceItinerary[];
  terms: object[];
  enhancedSeatingFlow: boolean;
};

/* =========================
   ✅ COMPONENT
========================= */

const LfsPage = () => {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [token, setToken] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFare, setSelectedFare] = useState<FareFamily[]>([]);
  const [tripType, setTripType] = useState<string>("");
  const [editBeforeSend, setEditBeforeSend] = useState<boolean>(false);
  const [errorLfs, setErrorLfs] = useState<string | null>(null);
  const router = useRouter();
  const [boundSelect,setBoundSelect] = useState<number>(1);
  const [selectedBoundDetailShow,setSelectedBoundDetailsShow] = useState<boolean>(false);

  /* =========================
     ✅ GET TOKEN (CLIENT SAFE)
  ========================= */
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(JSON.parse(storedToken));
      }
    } catch (err) {
      console.error("Token parse error:", err);
    }
  }, []);

  /* =========================
     ✅ SEARCH REQUEST
  ========================= */
  const searchRq = async (searchId: string) => {
    if (!token) return;

    try {
      setLoading(true);

      await fetch(
        `https://stgapi.a.farenexushub.com/sandbox-session/v2/searchRq/${searchId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      await executeSearch(searchId);

    } catch (err) {
      console.error("SearchRq Error:", err);
      setError("Failed to initiate search.");
    }
  };

  /* =========================
     ✅ EXECUTE SEARCH
  ========================= */
  const executeSearch = async (searchId: string) => {
    if (!token) return;

    try {
      const response = await fetch(
        `https://stgapi.a.farenexushub.com/sandbox-session/v2/executeSearch/${searchId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      const result = data?.response?.[0] || null;
      if(result.status.type === "ERROR"){
        setErrorLfs(result.error.errorMessage);
      }else{
      setSearchResult(result);
      setTripType(result?.sowSliceItinerary?.[0]?.sliceItinerary?.[0]?.tripType || "");
      }

    } catch (err) {
      console.error("ExecuteSearch Error:", err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
    }
  };

  const fareFamilyClass = (index: number, total: number) => {
    if (total > 0 && total % 5 === 0) {
      return "lg:w-1/5";
    }

  const fullRowCount = Math.floor(total / 5) * 5;
    return index >= fullRowCount ? "lg:flex-1" : "lg:w-1/5";
  };

  const getCurrencySymbol = (code:string) =>{
      const symbols: { [key: string]: string } = {
        USD: "$",
        CAD: "$",
        EUR: "€",
        GBP: "£",
        INR: "₹",
        JPY: "¥",
        AUD: "A$",
        CHF: "CHF",
        CNY: "¥"
      };
      return symbols[code] || code;
  };

  const handelFlightSelect = (fare: FareFamily, sliceIndex: number, originDestinationInfo: OriginDestinationInfo[] | OriginDestinationInfo) => {

    const tripType = searchResult?.sowSliceItinerary?.[0]?.sliceItinerary?.[0]?.tripType;

    if (!tripType) return;

    // Ensure originDestinationInfo matches FareFamily type (array)
    const fareselected = {
      ...fare,
      originDestinationInfo: Array.isArray(originDestinationInfo) ? originDestinationInfo : [originDestinationInfo],
      boundIndex: sliceIndex,
    } as FareFamily;

    // ONE WAY
    if (tripType === "OW") {
      setSelectedFare([fareselected]);
      return;
    }

    // ROUND TRIP
    if (tripType === "RT" || tripType === "MC") {

      setSelectedFare((prev) => {

        const existingIndex = prev.findIndex(
          item => item.boundIndex === sliceIndex
        );
        
        // Replace existing selection for same bound
        if (existingIndex !== -1) {

          const updatedFare = [...prev];
          updatedFare[existingIndex] = fareselected;

          return updatedFare;
        }

        // Add new selection
        return [...prev, fareselected];
      });
    }
  };

  const isFareSelected = (fare: FareFamily, sliceIndex: number) =>
    selectedFare.some(
      selected =>
        selected.boundIndex === sliceIndex &&
        selected.reviewKey === fare.reviewKey
    );

  const handleReset = () => {
    setSelectedFare([]);
  }

  const book = async () => {
    if(selectedFare.length === 0){
      alert("Please select a fare before booking.");
      return;
    }
    let reviewKeys = '';
    selectedFare.forEach(fare => {
      reviewKeys += fare.reviewKey + ',';
    });
    let req = {
      reviewKey : reviewKeys,
      apiSource : searchResult?.status?.gdsType || "Unknown",
      editBeforeSending : editBeforeSend
    }
    let requests = {
      request:JSON.stringify(req),
      id: id,
      isCombinedResponse: false,
      editBeforeSending : editBeforeSend
    } 
    try {
      const response = await fetch('https://stgapi.a.farenexushub.com/sandbox-session/v2/createReview',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requests)
      })
       const data = await response.json();

        if(response.ok){
          // alert("Booking successful!");
          router.push(`/pages/review/${data?.id}`);
        }else{
          alert("Booking failed: " + (data?.message || "Unknown error"));
        }
    }catch(err){
      console.error("Booking Error:", err);
      alert("Booking failed. Please try again.");
    }
    // alert("Booking successful! (This is a mock action.)");
  }

  const dateReturn = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
  }

   const flightdurationFun = (duration:string) => {
    const minutes = parseInt(duration, 10);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours && remainingMinutes) return `${hours} hrs ${remainingMinutes} min`;
    if (hours) return `${hours} hrs`;
    return `${remainingMinutes} min`;
   }
  /* =========================
     ✅ TRIGGER API
  ========================= */
  useEffect(() => {
    if (id && token) {
      searchRq(id);
    }
  }, [id, token]);

  /* =========================
     ✅ UI
  ========================= */
  return (
    <div className="lfs-container">
      {/* {JSON.stringify(searchResult.sowSliceItinerary)} */}
      {/* {JSON.stringify(selectedFare)} */}
      <h1 className='ml-4'>LFS Page</h1>
      <p className='ml-4'><strong>ID:</strong> {id}</p>
      {selectedFare.length > 0 && (
        <div className='selected-fare ml-4 mb-4 p-3 border rounded'>
          {
            selectedFare.map((fare,index)=>(
              <div key={index} className={`${selectedFare.length - 1 != index ? 'mb-3' : ''} border border-dashed border-gray-300 p-3 rounded`}>
                <div className='flex justify-between items-center mb-2'>
                  <span>
                    Aircraft Type {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.equipment?.code}
                  </span>
                  <span>
                    Trip Duration: {fare.originDestinationInfo[0]?.boundDuration}
                  </span>
                  <p className="border border-dashed border-gray-300 px-2 text-[13px]">{fare?.priceClass[0]?.fareClassType}</p>
                </div>
                <div className='flex justify-between items-center mb-3'>
                  <span>
                    {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.operatingCarrier.code} {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.flightNumber}
                    <p><small className="text-[#868686] text-[13px]">Operated By :</small> <span className="text-[14px]">{fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.operatingCarrier.name}</span></p>
                  </span>
                  <span>
                      {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.departure?.airportCode} {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.departureDateTime?.split('T')[1]?.slice(0, 5)}
                      <span className="mx-5 text-[#868686]">------------------------------------------------------------------</span>
                      {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.arrival?.airportCode} {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.arrivalDateTime?.split('T')[1]?.slice(0, 5)}
                  </span>
                  <p className="invisible">{fare?.priceClass[0]?.fareClassType}</p>
                </div>
                <p>
                  {/* {fare?.currencyCode} {getCurrencySymbol(fare?.currencyCode)}{fare?.totalPrice} */}
                  Includes travel operated by {fare.originDestinationInfo[0]?.flightSegmentInfo[0]?.operatingCarrier.name}
                </p>
              </div>
            ))
          }
          {
            selectedBoundDetailShow && (
              <>
                <div className="selectedItenaryModal">
                    <div className="flex items-center justify-center h-full">
                      <div className="selectedItenaryModalinner bg-white p-4 shadow-lg w-10/12 relative pt-8">
                          <h4 className="text-lg font-bold mb-2">Flight Details</h4>
                          <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-gray-200" onClick={() => setSelectedBoundDetailsShow(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {
                            selectedFare.map((fare,index)=> (
                              <React.Fragment key={index}>
                              <div>
                                  {
                                    fare.originDestinationInfo.map((info,index1)=> (
                                      <div key={index1} className="route py-6 px-1">
                                          {
                                            info.flightSegmentInfo.map((segment, segIndex) => (
                                              <React.Fragment key={segIndex}>
                                                <div v-if={segment} className="segment text-center">
                                                  <p>
                                                  {segment.departure.airportCode} To {segment.arrival.airportCode} ({dateReturn(String(segment.departureDateTime))})
                                                  </p>
                                                  {flightdurationFun(String(segment.flightDuration))}
                                                </div>
                                                <div className="border border-gray-300 my-2 p-4">
                                                    <div className="selectedItenaryModalInnerContent">
                                                      <p className="text-[15px] bg-[#eeeeee] py-[2px] px-[10px] border-b border-[#707070]">{segment.operatingCarrier.code} {segment.flightNumber} Aircraft Type {segment.equipment.code}</p>
                                                    </div>
                                                </div>
                                              </React.Fragment>
                                            ))
                                          }
                                      </div>
                                    ))
                                  }
                              </div>
                              </React.Fragment>
                            ))
                          }
                      </div>
                    </div>
                </div>
              </>
            )
          }
          <div className='mt-3 flex justify-between items-center'>
            <div className="">
              <button className='bg-gray-700 text-white px-3 py-1 rounded text-[13px] cursor-pointer' onClick={() => handleReset()}>Reset</button>
              <button className='bg-gray-700 text-white px-3 py-1 rounded ml-2 text-[13px] cursor-pointer' onClick={() => setSelectedBoundDetailsShow(true)}>Details</button>
            </div>

            <div className="mt-2">
              <span>
                <input type="checkbox" id="terms" name="terms" checked={editBeforeSend} className='mr-2' onChange={(e)=> setEditBeforeSend(e.target.checked)} />
                <label htmlFor="terms" className='text-sm text-[#868686]'>Edit Before Send</label>
              </span>
              <span className='ml-4 font-bold'>
                {selectedFare[0].currencyCode} {getCurrencySymbol(selectedFare[0].currencyCode)}{selectedFare.reduce((total, fare) => total + parseFloat(fare.totalPrice), 0).toFixed(2)}
              </span>
              <button className='bg-gray-700 text-white px-3 py-1 rounded ml-4 cursor-pointer' onClick={()=>book()}>Book</button>
            </div>
          </div>
        </div>
      )}
      {/* ✅ Loading */}
      {loading && <p>Loading flights...</p>}

      {/* ❌ Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ DATA */}
      {!loading && !error && (
        <div className={`${searchResult?.sowSliceItinerary?.length>2 ? 'flight-resultsMC':'flight-results'}`}>
          {/* {JSON.stringify(searchResult, null, 2)} */}
          {/* {searchResult.sowSliceItinerary[0].sliceItinerary[0].tripType} */}
          {searchResult?.sowSliceItinerary?.length > 2 ? (
            <>
            <div className='flex gap-0.5 mb-2'>
              {JSON.stringify(boundSelect)}
              {
                
                searchResult?.sowSliceItinerary.map((boudbtn,index)=>(
                  <div key={index}>
                    <button className='btn' onClick={()=>setBoundSelect(index+1)}>Bound {index+1}</button>
                  </div>
                ))
              }
              </div>
            </>
          ) : (
            <> </>
          )}
          {searchResult?.sowSliceItinerary?.length ? (
            searchResult.sowSliceItinerary.map((slice, sliceIndex) => (
              <div key={sliceIndex} className={`slice-card w-full ${searchResult?.sowSliceItinerary?.length>2? '' : 'mx-4'}`}>

                {slice?.sliceItinerary?.map((itinerary, itineraryIndex) => (
                  <div key={itineraryIndex} className="itinerary border p-3 mb-3">

                    {itinerary?.originDestinationInfo?.map((info, infoIndex) => (
                      <div key={infoIndex} className="route py-6 px-1">

                        {info?.flightSegmentInfo?.map((segment, segIndex) => (
                          <div key={segIndex} className="segment flex">
                            <div className='whitespace-nowrap mr-10'>
                              {segment?.operatingCarrier?.code} {segment?.flightNumber}
                            </div>
                            <div className='w-full flex justify-between items-center'>
                              <span className="airport">
                                {segment?.departure?.airportCode} {segment?.departureDateTime?.split('T')[1]?.slice(0, 5)}
                              </span>

                              <span className="arrow"> → </span>

                              <span className="airport">
                                {segment?.arrival?.airportCode} {segment?.arrivalDateTime?.split('T')[1]?.slice(0, 5)}
                              </span>
                            </div>
                          </div>
                        ))}

                      </div>
                    ))}
                    <div className='flex flex-wrap'>
                      {
                        itinerary?.fareFamily?.map((fare,fareindex)=>(
                          <div className={`p-4 border cursor-pointer w-full ${fareFamilyClass(fareindex, itinerary?.fareFamily?.length ?? 0)} flex items-center justify-center`} key={fareindex}>
                            <div className='text-center'>
                              <p>{fare?.priceClass[0]?.fareClassType}</p>
                              <input
                                type="radio"
                                name={`fare${sliceIndex}`}
                                className='ml-2'
                                checked={isFareSelected(fare, sliceIndex)}
                                onChange={() => handelFlightSelect(fare, sliceIndex, itinerary.originDestinationInfo)}
                              />
                              <p>{fare?.currencyCode} {getCurrencySymbol(fare?.currencyCode)}{fare?.totalPrice}</p>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                ))}

              </div>
            ))
          ) : searchResult?.sliceItinerary?.length ? (
            <div className="slice-card w-full">

                {searchResult?.sliceItinerary?.map((itinerary, itineraryIndex) => (
                  <div key={itineraryIndex} className="itinerary border p-3 mb-3">

                    {itinerary?.originDestinationInfo?.map((info, infoIndex) => (
                      <div key={infoIndex} className="route">

                        {info?.flightSegmentInfo?.map((segment, segIndex) => (
                          <div key={segIndex} className="segment flex justify-between">
                            <div className=''>
                              {segment?.operatingCarrier?.code} {segment?.flightNumber}
                            </div>
                            <span className="airport">
                              {segment?.departure?.airportCode} {segment?.departureDateTime?.split('T')[1]?.slice(0, 5)}
                            </span>

                            <span className="arrow"> → </span>

                            <span className="airport">
                              {segment?.arrival?.airportCode} {segment?.arrivalDateTime?.split('T')[1]?.slice(0, 5)}
                            </span>

                          </div>
                        ))}

                      </div>
                    ))}

                  </div>
                ))}

              </div>
          ):( 
            <p className="bg-[#e7e7e7] py-[10px] px-[13px] rounded-lg border border-[#ff1414] ml-4">{errorLfs}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LfsPage;