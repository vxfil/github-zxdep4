import React from 'react';
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";

type TableRowsLoaderProps = {
    rowsNum: number;
    cellsNum: number;
};

const TableRowsLoader: React.FC<TableRowsLoaderProps> = (props) => {
    const { rowsNum, cellsNum } = props;

    const rowsArr = [...Array(rowsNum)];
    const cellsArr = [...Array(cellsNum)];

    const renderCells = () => cellsArr.map((cell, index) => {
        const isFirstCell = index === 0;

        return (
            <TableCell
                key={index}
                component={isFirstCell ? "th" : undefined}
                scope={isFirstCell ? "row" : undefined}
            >
                <Skeleton
                    variant="text"
                    animation='pulse'
                    sx={{
                        backgroundColor: '#B3FC4F',
                    }}
                />
            </TableCell>
        )
    });

    return rowsArr.map((row, index) => (
        <TableRow
            key={index}
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
            }}>
            {renderCells()}
        </TableRow>
    ));
};

export default TableRowsLoader;