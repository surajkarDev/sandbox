'use client';
import React from "react";
import SearchForm from "../SearchForm/page";

type Props = {
    flightTab: boolean;
    setFlightTab: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchTab = ({ flightTab, setFlightTab }: Props) => {
    return (
        <>
            {/* render based on flightTab or use setFlightTab as needed */}
            <div className="w-full mt-15">
              <div className="flex justify-center">
                <div className="w-10/12">
                    <button className={flightTab ? "searchForm activeTabSearchForm" : "searchForm"} onClick={() => setFlightTab(true)}>Flights</button>
                    <button className={!flightTab ? "searchForm activeTabSearchForm" : "searchForm"} onClick={() => setFlightTab(false)}>Flight Pass</button>
                    {
                        flightTab ? 
                        <>
                          <div className="border border-gray-300 p-4">
                            <SearchForm />
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
              </div>
            </div>
        </>
    )
}

export default SearchTab;