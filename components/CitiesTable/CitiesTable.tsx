import React, { useState, Dispatch, SetStateAction } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { CountriesFilter, TemperatureFilter, TableRowsLoader } from '../../components';
import { WeatherData } from '../../common';

type CitiesTableProps = {
  weatherData: WeatherData[];
  selectedCity: string;
  setSelectedCity: Dispatch<SetStateAction<string>>;
  loading: boolean;
};

type Filter = {
  isTriggered: boolean;
  filterFunc: (data: Data[]) => Data[];
};

type Order = 'asc' | 'desc';
interface Data {
  windDirection: number;
  maxTemp: number;
  minTemp: number;
  city: string;
  country: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: readonly HeadCell[] = [
  {
    id: 'city',
    numeric: false,
    disablePadding: false,
    label: 'City',
  },
  {
    id: 'maxTemp',
    numeric: true,
    disablePadding: false,
    label: 'Temperature max',
  },
  {
    id: 'minTemp',
    numeric: true,
    disablePadding: false,
    label: 'Temperature min',
  },
  {
    id: 'windDirection',
    numeric: true,
    disablePadding: false,
    label: 'Wind direction',
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{
      '& .MuiTableRow-root': {
        backgroundColor: '#030303',

        '.MuiTableCell-root': {
          border: 'none',

          '.MuiButtonBase-root': {
            color: '#FDFCFF',

            '.MuiSvgIcon-root': {
              color: '#FDFCFF',
            }
          }
        },
      },
    }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const CitiesTable: React.FC<CitiesTableProps> = (props) => {
  const { weatherData, selectedCity, setSelectedCity, loading } = props;

  const rows = weatherData.map(({ city, country, daily, current_weather }) => {
    const { temperature_2m_max, temperature_2m_min } = daily;
    const { winddirection } = current_weather;

    return {
      city,
      country,
      maxTemp: temperature_2m_max[temperature_2m_max.length - 1],
      minTemp: temperature_2m_min[temperature_2m_min.length - 1],
      windDirection: winddirection,
    };
  });

  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('city');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [countriesFilter, setCountriesFilter] = useState<string[]>([]);
  const [minTempFilter, setMinTempFilter] = useState<number | string>('');
  const [maxTempFilter, setMaxTempFilter] = useState<number | string>('');

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  //   const handleChangePage = (event: unknown, newPage: number) => {
  //     setPage(newPage);
  //   };

  //   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setRowsPerPage(parseInt(event.target.value, 10));
  //     setPage(0);
  //   };

  const applyFilters = (data: Data[], filters: Filter[]): Data[] => {
    const res = filters.reduce((acc: Data[], item: Filter) => {
      const { isTriggered, filterFunc } = item;
      if (isTriggered) {
        const filtered = filterFunc(acc);
        return filtered;
      } else {
        return acc;
      }
    }, [...data]);

    return res;
  };

  const byCountryFilterObj: Filter = {
    isTriggered: !!countriesFilter.length,
    filterFunc: (data: Data[]) =>
      data.filter(({ country }) => countriesFilter.includes(country)),
  };

  const minTempFilterObj: Filter = {
    isTriggered: !!minTempFilter,
    filterFunc: (data: Data[]) =>
      data.filter(({ minTemp }) => minTempFilter && minTemp >= Number(minTempFilter)),
  };

  const maxTempFilterObj: Filter = {
    isTriggered: !!maxTempFilter,
    filterFunc: (data: Data[]) =>
      data.filter(({ maxTemp }) => maxTempFilter && maxTemp <= Number(maxTempFilter)),
  };

  const rowsToRender = applyFilters(rows, [byCountryFilterObj, minTempFilterObj, maxTempFilterObj]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsToRender.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rowsToRender, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rowsToRender],
  );

  const handleClick = (event: React.MouseEvent<unknown>, city: string) => {
    setSelectedCity(selectedCity === city ? '' : city);
  };

  const countries = [...new Set(rows.map(({ country }) => country))];

  return (
    <Box sx={{
      width: 641,
      height: 432,
      background: '#1A1A1A',
      borderRadius: '16px',
      padding: '25px 16px 18px',
      marginLeft: '16px',
    }}>
      <Box sx={{ display: 'flex', marginBottom: '25px' }} >
        <CountriesFilter countries={countries} onChange={setCountriesFilter} />
        <TemperatureFilter
          placeholder="Min"
          value={minTempFilter || undefined}
          onChange={(value: any) => setMinTempFilter(value)}
          maxValue={maxTempFilter}
        />
        <TemperatureFilter
          placeholder="Max"
          value={maxTempFilter || undefined}
          onChange={(value: any) => setMaxTempFilter(value)}
          minValue={minTempFilter}
        />
      </Box>
      <Paper sx={{ width: '100%', backgroundColor: 'initial', overflowX: "auto" }}>
        <TableContainer sx={{ borderRadius: '12px', border: '1px solid #313131' }}>
          <Table
            aria-labelledby="tableTitle"
            size='small'
            sx={{ minWidth: 607 }}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {loading ?
                <TableRowsLoader rowsNum={8} cellsNum={4} />
                : visibleRows.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      onClick={(event) => handleClick(event, `${row.city}`)}
                      selected={row.city === selectedCity}
                      key={row.city}
                      sx={{
                        cursor: 'pointer',
                        background: '#313131',
                        height: 36,

                        '&:hover': {
                          background: 'rgba(85, 108, 214, 0.12)',
                        },

                        "&:nth-child(odd)": {
                          background: '#191919',

                          '&:hover': {
                            background: 'rgba(85, 108, 214, 0.04)',
                          },

                          '&.Mui-selected': {
                            background: 'rgba(85, 108, 214, 0.08)',
                          }
                        },

                        '& .MuiTableCell-root': {
                          color: '#FDFCFF',
                          border: 'none',
                        },
                      }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                      >
                        {row.city}
                      </TableCell>
                      <TableCell align="right">{row.maxTemp}</TableCell>
                      <TableCell align="right">{row.minTemp}</TableCell>
                      <TableCell align="right">{row.windDirection}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 33 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </Box>
  );
}

export default CitiesTable;