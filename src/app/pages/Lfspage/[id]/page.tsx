'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import "../../../../../public/css/LfsPage.css";

/* =========================
   ✅ TYPES
========================= */

type FlightSegment = {
  departure: { airportCode: string };
  arrival: { airportCode: string };
  operatingCarrier: { code: string };
  flightNumber: string | number;
  departureDateTime: string | number;
  arrivalDateTime: string | number;
};

type OriginDestinationInfo = {
  flightSegmentInfo: FlightSegment[];
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
      setSearchResult(result);
      setTripType(result?.sowSliceItinerary?.[0]?.sliceItinerary?.[0]?.tripType || "");

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
    // console.log("fullRowCount:", fullRowCount, "index:", index);
    console.log(Math.floor(total / 5))
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

  const handelFlightSelect = (e: React.ChangeEvent<HTMLInputElement>,fare: FareFamily,sliceIndex: number) => {

    const tripType = searchResult?.sowSliceItinerary?.[0]?.sliceItinerary?.[0]?.tripType;

    if (!tripType) return;

    const fareselected = {
      ...fare,
      boundIndex: sliceIndex
    };

    // ONE WAY
    if (tripType === "OW") {
      setSelectedFare([fareselected]);
      return;
    }

    // ROUND TRIP
    if (tripType === "RT") {

      setSelectedFare((prev) => {

        const existingIndex = prev.findIndex(
          item => item.boundIndex === sliceIndex
        );
        console.log("existingIndex",existingIndex);
        
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
      <h1 className='ml-4'>LFS Page</h1>
      <p className='ml-4'><strong>ID:</strong> {id}</p>
      {selectedFare.length > 0 ? JSON.stringify(selectedFare): "No fare selected"}
      {/* ✅ Loading */}
      {loading && <p>Loading flights...</p>}

      {/* ❌ Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ DATA */}
      {!loading && !error && (
        <div className="flight-results">
          {/* {JSON.stringify(searchResult, null, 2)} */}
          {/* {searchResult.sowSliceItinerary[0].sliceItinerary[0].tripType} */}
          {searchResult?.sowSliceItinerary?.length ? (
            searchResult.sowSliceItinerary.map((slice, sliceIndex) => (
              <div key={sliceIndex} className="slice-card w-full mx-4">

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
                              <input type="radio" name={`fare${sliceIndex}`} className='ml-2' onChange={(e)=>handelFlightSelect(e.target.value,fare,sliceIndex)} />
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
            <p>No flight data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LfsPage;