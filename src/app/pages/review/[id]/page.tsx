'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type OperatingCarrier = {
  code?: string;
  name?: string;
  text?: string[];
}
type FlightSegmentInfo = {
  departure?: {
    airportCode?: string;
  };
  arrival?: {
    airportCode?: string;
  };
  arrivalDateTime?: string;
  departureDateTime?:string;
  flightDuration?: string | number;
  secureFlight?:boolean;
  operatingCarrier?:OperatingCarrier
  priceClass?: {
    fareClassType?: string;
    cabinType?: {
      cabinTypeName?: string;
      cabinTypeCode?: string;
    }[];
  }[];
  bookingCode?: string;
  fareBasisCode?: string;
};

type OriginDestinationInfo = {
  flightSegmentInfo?: FlightSegmentInfo[];
};

type Itinerary = {
  originDestinationInfo?: OriginDestinationInfo[];
};

type Review = {
  id: string;
  itinerary?: Itinerary[];
};

type GetReviewResponse = {
  id: string;
};

type ReviewResponse = {
  response: string | Review;
};

const extractTime = (dateTimeString?: string): string => {
  if (!dateTimeString) return 'Unknown Time';

  try {
    const timePart = dateTimeString.split('T')[1];
    return timePart?.slice(0, 5) ?? 'Unknown Time';
  } catch {
    return 'Unknown Time';
  }
};

const extractDate = (dateTimeString?: string): string => {
  if (!dateTimeString) return 'Unknown Date';

  try {
    return dateTimeString.split('T')[0];
  } catch {
    return 'Unknown Date';
  }
};

const formatDuration = (
  duration?: string | number
): string => {
  const totalMinutes = Number(duration ?? 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
};

const ReviewPage = () => {
  const params = useParams();

  const reviewId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [token, setToken] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const parsedToken = JSON.parse(storedToken);

      setToken(
        typeof parsedToken === 'string'
          ? parsedToken
          : storedToken
      );
    } catch {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token || !reviewId) return;

    const fetchReview = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://stgapi.a.farenexushub.com/sandbox-session/v2/getReview/${reviewId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `getReview failed: ${response.status}`
          );
        }

        const result =
          (await response.json()) as GetReviewResponse;

        if (!result.id) {
          throw new Error(
            'Review ID is missing from getReview response'
          );
        }

        const reviewResponse = await fetch(
          `https://stgapi.a.farenexushub.com/sandbox-session/v2/review/${result.id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!reviewResponse.ok) {
          throw new Error(
            `review failed: ${reviewResponse.status}`
          );
        }

        const reviewResult =
          (await reviewResponse.json()) as ReviewResponse;

        const reviewData =
          typeof reviewResult.response === 'string'
            ? (JSON.parse(reviewResult.response) as Review)
            : reviewResult.response;

        setReview(reviewData);
      } catch (error) {
        console.error(
          'Error fetching review data:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchReview();
  }, [reviewId, token]);

  const originDestinations =
    review?.itinerary?.[0]?.originDestinationInfo ?? [];

  const firstFlight =
    originDestinations[0]?.flightSegmentInfo?.[0];

  const lastOriginDestination =
    originDestinations[originDestinations.length - 1];

  const lastFlight =
    lastOriginDestination?.flightSegmentInfo?.[
      (lastOriginDestination?.flightSegmentInfo?.length ?? 1) - 1
    ];

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-2xl font-bold px-4 py-4">
        Review Page
      </h1>
    {/* {JSON.stringify(originDestinations)} */}
      {loading ? (
        <div className="px-4">Loading...</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4 px-4">
          {/* Left Section */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center p-3 bg-[#f1f1f1] border border-[#ccc]">
              <h2 className="font-semibold">
                Review Your Itinerary
              </h2>

              <span>
                {firstFlight?.departure?.airportCode ??
                  'Unknown'}
                {' '}to{' '}
                {lastFlight?.arrival?.airportCode ??
                  'Unknown'}
              </span>
            </div>

            <div className="p-4 border border-[#ccc] border-t-0 mb-4">
              {originDestinations.length > 0 ? (
                originDestinations.map(
                  (item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className={
                        itemIndex !==
                        originDestinations.length - 1
                          ? 'mb-6'
                          : ''
                      }
                    >
                      {item.flightSegmentInfo?.map(
                        (flight, flightIndex) => (
                          <div
                            key={`${itemIndex}-${flightIndex}`}
                            className="mb-4"
                          >
                            <div className="flex justify-between border-b border-[#ccc] pb-2">
                              <p>
                                {flight.departure
                                  ?.airportCode ??
                                  'Unknown'}
                                {' '}to{' '}
                                {flight.arrival
                                  ?.airportCode ??
                                  'Unknown'}
                              </p>

                              <span>
                                {extractDate(
                                  flight.arrivalDateTime
                                )}
                                {' '}
                                {extractTime(
                                  flight.arrivalDateTime
                                )}
                              </span>
                            </div>

                            <div className="flex justify-between px-4 py-2 pt-1">
                              <small>
                                (
                                {flight.departure
                                  ?.airportCode ??
                                  'Unknown'}
                                )
                              </small>

                              <small>
                                (
                                {flight.arrival
                                  ?.airportCode ??
                                  'Unknown'}
                                )
                              </small>
                            </div>

                            <div className="border border-[#ccc] p-3">
                              <div className="flex justify-between items-center border-b border-[#ccc]">
                                <span>
                                  (
                                  {flight.departure
                                    ?.airportCode ??
                                    'Unknown'}
                                  )
                                </span>

                                <span>
                                  {formatDuration(
                                    flight.flightDuration
                                  )}
                                </span>

                                <span>
                                  (
                                  {flight.arrival
                                    ?.airportCode ??
                                    'Unknown'}
                                  )
                                </span>
                              </div>
                              <div className='flex justify-between'>
                                <span>
                                  {extractDate(flight.departureDateTime)}{' '}
                                  {extractTime(flight.departureDateTime)}<br/>
                                  <small><b>Secure Flight : {JSON.stringify(flight.secureFlight)}</b></small><br/>
                                  <small>
                                    <b>Amenities -</b> {flight?.operatingCarrier?.name}
                                  </small>
                                </span>
                                <span>
                                  {extractDate(flight.arrivalDateTime)}{' '}
                                  {extractTime(flight.arrivalDateTime)}
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">
                                  <b>{flight?.priceClass?.[0]?.fareClassType} {flight.bookingCode}</b>
                                </p>
                                <p>
                                  <small className="bg-[#7c7c7c] p-1 px-2 rounded text-white font-semibold">
                                    {flight?.priceClass?.[0]?.cabinType?.[0].cabinTypeName} {flight?.priceClass?.[0]?.cabinType?.[0].cabinTypeCode}
                                  </small>
                                </p>
                                <p><small><b>Fare Basis Code :</b> {flight?.fareBasisCode}</small></p>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )
                )
              ) : (
                <p>No review itinerary available.</p>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/4">
            <div className="p-3 bg-[#f1f1f1] border border-[#ccc]">
              Mandatory : No
            </div>

            <div className="p-4 border border-[#ccc] border-t-0 min-h-[200px]">
              {/* Additional content */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;