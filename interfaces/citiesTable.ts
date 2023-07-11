import { Order } from "../types/citiesTable";

export interface Data {
    windDirection: number;
    maxTemp: number;
    minTemp: number;
    city: string;
    country: string;
}

export interface HeadCell {
    disablePadding: boolean;
    id: keyof Data;
    label: string;
    numeric: boolean;
}

export interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    order: Order;
    orderBy: string;
}