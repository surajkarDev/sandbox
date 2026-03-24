'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

const LfsPage = () => {
  const params = useParams();

  // ✅ Type-safe ID extraction
  const id = params?.id as string | undefined;

  // ✅ Keep token as constant (no need for useState)
  const token = "YOUR_TOKEN_HERE";

  const executeSearch = async (searchId: string) => {
    try {
      const response = await fetch(
        // `https://stgapi.a.farenexushub.com/sandbox-session/v2/executeSearch/${searchId}`,
        `https://stgapi.a.farenexushub.com/sandbox-session/v2/searchRq/${searchId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("execute response", data);

    } catch (error) {
      console.error("Error during search execution:", error);
    }
  };

  useEffect(() => {
    if (typeof id === 'string') {
      executeSearch(id);
    }
  }, [id]);

  return (
    <div>
      <h1>LFS Page</h1>
      <p>ID: {id}</p>
    </div>
  );
};

export default LfsPage;