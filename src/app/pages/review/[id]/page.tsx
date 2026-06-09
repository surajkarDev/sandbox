'use client';
import react,{useState,useEffect} from 'react';
import { useParams,useRouter } from 'next/navigation';

const ReviewPage = () => {
    const params = useParams();
    const [token, setToken] = useState<string | null>(null);
    console.log("Review Page ID:", params.id);
    const getReviewData = async () => {
        try{
            const response = await fetch(`https://stgapi.a.farenexushub.com/sandbox-session/v2/getReview/${params.id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            const res  = await response.json();
            console.log("Review Data:", res);
        }catch(error){
            console.error("Error fetching review data:", error);
        }
    }
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
      useEffect(() => {
        if (token) {
          getReviewData();
        }
    }, [token]);
    return (
        <>
            <div className='w-full h-screen flex items-center justify-center'>
                <h1 className='text-2xl font-bold'>Review Page</h1>
            </div>
        </>
    )
}

export default ReviewPage;