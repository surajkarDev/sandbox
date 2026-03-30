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

type SliceItinerary = {
  originDestinationInfo: OriginDestinationInfo[];
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

    } catch (err) {
      console.error("ExecuteSearch Error:", err);
      setError("Failed to fetch search results.");
    } finally {
      setLoading(false);
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
      <h1>LFS Page</h1>
      <p><strong>ID:</strong> {id}</p>

      {/* ✅ Loading */}
      {loading && <p>Loading flights...</p>}

      {/* ❌ Error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* ✅ DATA */}
      {!loading && !error && (
        <div className="flight-results">
          {/* {JSON.stringify(searchResult, null, 2)} */}
          {searchResult?.sowSliceItinerary?.length ? (
            searchResult.sowSliceItinerary.map((slice, sliceIndex) => (
              <div key={sliceIndex} className="slice-card w-full">

                {slice?.sliceItinerary?.map((itinerary, itineraryIndex) => (
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