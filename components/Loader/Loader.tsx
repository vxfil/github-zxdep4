import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
    return (
        <>
            <svg width="0" height="0">
                <linearGradient id="linearColors" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#B3FC4F" />
                    <stop offset="100%" stopColor="#173102" />
                </linearGradient>
            </svg>
            <CircularProgress thickness={4} sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                margin: 'auto',

                '& .MuiCircularProgress-svg': {

                    circle: {
                        stroke: 'url(#linearColors)',
                    }
                }
            }}
            />
        </>
    )
};

export default Loader;