import { Dispatch, SetStateAction } from 'react';

export type CountriesFilterProps = {
    countries: string[];
    onChange: Dispatch<SetStateAction<string[]>>;
};