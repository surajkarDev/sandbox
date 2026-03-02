 "use client";
 import React,{useState} from "react";
import SearchForm from "../../components/SearchTab/page";

const Home = () => {
    const [flightTab,setFlightTab] = useState<boolean>(true);
    return (
        <>
            <div className="container mx-auto p-4">
                <div className="row">
                    <div className="col-12">
                        <SearchForm flightTab={flightTab} setFlightTab={setFlightTab} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;