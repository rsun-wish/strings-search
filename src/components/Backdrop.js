import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function BackDrop() {
    const translationLoading = useSelector(state => state.app.translationLoading)
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={translationLoading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}
