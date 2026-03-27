'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const LfsPage = () => {
  const params = useParams();
  const token = JSON.parse(localStorage.getItem('token')|| 'null');
  const [searchResult,useSearchResult] = useState<object>({});
  // ✅ Type-safe ID extraction
  const id = params?.id as string | undefined;
  const searchRq = async (searchId: string) => {
    try {
      const response = await fetch(
        // `https://stgapi.a.farenexushub.com/sandbox-session/v2/executeSearch/${searchId}`,
        `https://stgapi.a.farenexushub.com/sandbox-session/v2/searchRq/${searchId}`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      const data = await response.json();
      console.log("execute response", data);
      executeSearch(searchId)
    } catch (error) {
      console.error("Error during search execution:", error);
    }
  };
  const executeSearch = async (id: string) => {
    const url = `https://stgapi.a.farenexushub.com/sandbox-session/v2/executeSearch/${id}`;
    try {
      const response = await fetch(url,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json();
      console.log("execute response", data);
      useSearchResult(data.response[0])
    }catch(error){
      console.error("Error during search execution:", error);
    }
  }

  useEffect(() => {
    if (typeof id === 'string') {
      searchRq(id);
    }
  }, [id]);

  return (
    <div>
      <h1>LFS Page</h1>
      <p>ID: {id}</p>
      {JSON.stringify(searchResult)}
    </div>
  );
};

export default LfsPage;