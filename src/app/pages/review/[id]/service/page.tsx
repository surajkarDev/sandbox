'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeToken = (value: string | null): string | null => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as unknown;
    return isNonEmptyString(parsed) ? parsed : value;
  } catch {
    return value;
  }
};

export default function ReviewServicePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewKey, setReviewKey] = useState<string | null>(null);
  const [servicesResponse, setServicesResponse] = useState<any>({});

  const callServices = async () => {
    if (!isNonEmptyString(token) || !isNonEmptyString(reviewKey)) {
      return;
    }

    try {
      const request = {
        apiSource: 'NDCEXCHANGE',
        reviewKey,
      };

      const response = await fetch(
        'https://stgapi.a.farenexushub.com/sandbox-session/v2/services',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`Services call failed: ${response.status}`);
      }

      const res = await response.json();
      setServicesResponse(res);
      console.log('Services response:', res);
    } catch (error) {
      console.error('Error calling services:', error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const normalizedToken = normalizeToken(storedToken);

    setToken(normalizedToken);
  }, []);

  useEffect(() => {
    if (!isNonEmptyString(id) || !isNonEmptyString(token)) return;

    const fetchReview = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://stgapi.a.farenexushub.com/sandbox-session/v2/getReview/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch review: ${response.status}`);
        }

        const reqData = (await response.json()) as { request?: string };

        if (!isNonEmptyString(reqData.request)) {
          throw new Error('Review request payload is missing or invalid.');
        }

        const parsedRequest = JSON.parse(reqData.request) as { reviewKey?: unknown };

        if (!isNonEmptyString(parsedRequest.reviewKey)) {
          throw new Error('Review key is missing or invalid.');
        }

        console.log('Review data:', parsedRequest.reviewKey);
        setReviewKey(parsedRequest.reviewKey);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, token]);

  useEffect(() => {
    if (!isNonEmptyString(reviewKey)) {
      return;
    }

    callServices();
  }, [reviewKey, token]);

  return (
    <div className="p-6">
      {loading && <p className="mt-3 text-sm text-gray-500">Loading review...</p>}
      {servicesResponse?.itineraryInfo?.originDestinationInfo ? (
        <>
          {servicesResponse.itineraryInfo.originDestinationInfo.map((item: any, index: number) => (
            <div key={index} className="mt-3 p-4 border rounded-md shadow-sm">
              {item?.flightSegmentInfo?.length > 0 && (
                <>
                  {item.flightSegmentInfo.map((service: any, serviceIndex: number) => (
                    <div key={serviceIndex} className="mt-2 p-2 border rounded-md bg-gray-50">
                      {JSON.stringify(service.services, null, 2)}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </>
      ) : (
        <p className="mt-3 text-sm text-gray-500">No services found.</p>
      )}
    </div>
  );
}
