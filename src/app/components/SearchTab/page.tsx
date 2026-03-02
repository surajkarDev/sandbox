'use client';
import React from "react";

type Props = {
    flightTab: boolean;
    setFlightTab: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchTab = ({ flightTab, setFlightTab }: Props) => {
    return (
        <>
            {/* render based on flightTab or use setFlightTab as needed */}
            Search Tab - flightTab is {flightTab ? 'true' : 'false'}

            <div >
                <button className={flightTab ? "searchForm activeTabSearchForm" : "searchForm"} onClick={() => setFlightTab(true)}>Flights</button>
                <button className={!flightTab ? "searchForm activeTabSearchForm" : "searchForm"} onClick={() => setFlightTab(false)}>Flight Pass</button>
                {
                    flightTab ? 
                    <>
                      <div className="border border-gray-300 p-4">
                        flight search form
                      </div>
                    </> 
                    :
                    <>
                      <div className="border border-gray-300 p-4">
                        flight pass search form
                      </div>
                    </>
                }
            </div>
        </>
    )
}

export default SearchTab;