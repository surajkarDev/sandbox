'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type FlightSegmentInfo = {
  departure?: {
    airportCode?: string;
  };
  arrival?: {
    airportCode?: string;
  };
  arrivalDateTime?: string;
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
  response?: string;
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

const TimeDisplay = ({ time }: { time: string }) => (
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{time}</span>
  </div>
);

const ReviewPage = () => {
  const params = useParams();
  const reviewId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [token, setToken] = useState<string | null>(null);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      return;
    }
    try {
      const parsedToken = JSON.parse(storedToken);
      setToken(typeof parsedToken === 'string' ? parsedToken : storedToken);
    } catch {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token || !reviewId) {
      return;
    }

    const fetchReview = async () => {
      try {
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
          throw new Error(`getReview failed: ${response.status}`);
        }

        const result = (await response.json()) as GetReviewResponse;
        if (!result.id) {
          throw new Error('Review ID is missing from getReview response');
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
          throw new Error(`review failed: ${reviewResponse.status}`);
        }

        const reviewResult = (await reviewResponse.json()) as ReviewResponse;
        const reviewData =
          typeof reviewResult.response === 'string'
            ? JSON.parse(reviewResult.response)
            : reviewResult.response;

        setReview(reviewData);
      } catch (error) {
        console.error('Error fetching review data:', error);
      }
    };

    void fetchReview();
  }, [reviewId, token]);

  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold px-4 mb-4">Review Page</h1>
        <div className="flex flex-col lg:flex-row px-4">
            <div className="w-full lg:w-3/4">
                <div className="flex justify-between items-center p-4 bg-[#f1f1f1] border border-[#ccc]">
                    <h2>Review Your Itinerary</h2>
                    <span>
                        {review?.itinerary?.[0]?.originDestinationInfo?.[0]?.flightSegmentInfo?.[0]?.departure?.airportCode ?? 'Unknown'} to{' '}
                        {review?.itinerary?.[0]?.originDestinationInfo?.[review?.itinerary?.[0]?.originDestinationInfo.length - 1]?.flightSegmentInfo?.[0]?.departure?.airportCode ?? 'Unknown'}
                    </span>
                </div>
                <div className="p-4 border border-[#ccc] mb-4">
                    {review?.itinerary?.[0]?.originDestinationInfo?.length ? (
                        <>
                        {review.itinerary[0].originDestinationInfo.map((item, itemIndex) => (
                            <div key={itemIndex}>
                            {item.flightSegmentInfo?.map((flight, flightIndex) => (
                                <div key={flightIndex} className="flex justify-between">
                                    <p>
                                        {flight.departure?.airportCode ?? 'Unknown'} to{' '}
                                        {flight.arrival?.airportCode ?? 'Unknown'}
                                    </p>
                                    <span>
                                        {flight?.arrivalDateTime?.split('T')[0] ?? 'Unknown Date'}&nbsp;
                                        {flight?.arrivalDateTime?.split('T')[1]?.slice(0, 5) ?? 'Unknown Time'}
                                    </span>
                                </div>
                            ))}
                            </div>
                        ))}
                        </>
                    ) : (
                        <p>No review itinerary available.</p>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-1/4">
                <div className="flex justify-between items-center p-4 bg-[#f1f1f1] border border-[#ccc]">
                    Mandatory : No
                </div>
                <div className="p-4 border border-[#ccc]">
                </div>
            </div>
        </div>
    </div>
  );
};

export default ReviewPage;
