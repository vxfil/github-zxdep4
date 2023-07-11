import React, { Dispatch, SetStateAction } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Paper from '@mui/material/Paper';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ClearIcon from '@mui/icons-material/Clear';
import { CountriesFilterProps } from '../../types/countriesFilter';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CountriesFilter: React.FC<CountriesFilterProps> = (props) => {
  const { countries, onChange } = props;

  return (
    <Autocomplete
      onChange={(event, countriesArr) => onChange(countriesArr)}
      sx={{
        '& .MuiFormControl-root': {

          '.MuiInputBase-root': {
            color: '#FDFCFF',
            width: 160,
            height: 40,
            background: '#313131',
            borderRadius: '12px',
          },

          '.MuiInputBase-input': {
            boxSizing: 'border-box',
          },

          fieldset: {
            borderColor: "#515151"
          },

          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: '#515151',
            }
          }
        },
      }}
      PaperComponent={(props) => (
        <Paper
          sx={{
            background: "#313131",
            color: "#FDFCFF",
            border: "1px solid #515151",

            '&.MuiCheckbox-root': {
              color: 'yellow'
            },
          }}
          {...props}
        />
      )}
      clearIcon={<ClearIcon sx={{ fill: '#FFFFFF', width: 18 }} />}
      popupIcon={<KeyboardArrowDownIcon sx={{ fill: '#FFFFFF', width: 18 }} />}
      multiple
      id="checkboxes-tags-demo"
      options={countries}
      ChipProps={{ 'sx': { display: 'none' } }}
      disableCloseOnSelect
      getOptionLabel={(option) => option}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{ paddingLeft: 4 }}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={selected}
            sx={{
              color: '#A4A4A4'
            }}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} placeholder="Country" />
      )}
    />
  );
}

export default CountriesFilter;
