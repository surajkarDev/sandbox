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
                    <button className={flightTab ? "searchForm inline-flex items-center gap-1 activeTabSearchForm" : "searchForm inline-flex items-center gap-1"} onClick={() => setFlightTab(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22v-2.5l3-2.1v-3.6L2 17v-3l8-5.6V4q0-.825.588-1.412T12 2t1.413.588T14 4v4.4l8 5.6v3l-8-3.2v3.6l3 2.1V22l-5-1.5z"/></svg>
                      Flights
                    </button>
                    <button className={!flightTab ? "searchForm inline-flex items-center gap-1 activeTabSearchForm" : "searchForm inline-flex items-center gap-1"} onClick={() => setFlightTab(false)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M7 22v-2.5l3-2.1v-3.6L2 17v-3l8-5.6V4q0-.825.588-1.412T12 2t1.413.588T14 4v4.4l8 5.6v3l-8-3.2v3.6l3 2.1V22l-5-1.5z"/></svg>
                      Flight Pass
                    </button>
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