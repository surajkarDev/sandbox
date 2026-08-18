'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ReviewServicePage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setToken(null);
        return;
      }

      const parsedToken = JSON.parse(storedToken);
      const finalToken = typeof parsedToken === 'string' ? parsedToken : storedToken;
      setToken(finalToken);
    } catch {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  useEffect(() => {
    if (!id || !token) return;

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

        const reqData = await response.json();
        console.log('Review data:', reqData);
      } catch (error) {
        console.error('Error fetching review:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [id, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Review Service</h1>
      <p className="text-gray-600">Review service page for booking ID: {id || 'unknown'}</p>
      {loading && <p className="mt-3 text-sm text-gray-500">Loading review...</p>}
    </div>
  );
}
