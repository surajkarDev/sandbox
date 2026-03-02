'use client';
import React from "react";

type Props = {
    flightTab: boolean;
    setFlightTab: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchForm = ({ flightTab, setFlightTab }: Props) => (
    <>
        Search Form - flightTab is {flightTab ? 'true' : 'false'}
    </>
);

export default SearchForm;