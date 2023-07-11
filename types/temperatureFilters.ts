export interface TemperatureFilterProps {
    placeholder?: string;
    onChange: (value: string) => void;
    value: string;
    maxValue?: number;
    minValue?: number;
}