import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { TemperatureFilterProps } from '../../types/temperatureFilters';

const TemperatureFilter: React.FC<TemperatureFilterProps> = (props) => {
  const { placeholder, onChange, value, maxValue, minValue } = props;

  const min = minValue || -80;
  const max = maxValue || 80;

  const [error, setError] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    if (newValue === '') {
      setError('');
      onChange('');
      return;
    }

    if (!Number.isInteger(Number(newValue))) {
      setError('The value must be an integer');
      return;
    }

    // @ts-ignore
    if (+newValue < +min || +newValue > +max) {
      setError(`The value must be between ${min} and ${max}`);
      onChange('');
      return;
    }

    setError('');

    onChange(newValue);
  };

  return (
    <TextField
      sx={{
        marginLeft: '8px',

        '& .MuiInputBase-root': {
          color: '#FDFCFF',
          width: 160,
          height: 40,
          background: '#313131',
          borderRadius: '12px',

          fieldset: {
            borderColor: "#515151"
          },

          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: '#515151',
            }
          },
        },

        '& .MuiFormHelperText-root': {
          position: 'absolute',
          top: '40px',
          left: 0,
          width: 275,
          margin: 0,
        },
      }}
      type="number"
      placeholder={placeholder}
      InputProps={{ inputProps: { min, max, step: 1 } }}
      onChange={handleChange}
      error={!!error}
      helperText={error}
      value={value}
    />
  );
};

export default TemperatureFilter;