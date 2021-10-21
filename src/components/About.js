import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { closeAboutDialog } from '../actions';

export default function About() {
    const open = useSelector(state => state.app.aboutDialogOpen)
    const dispatch = useDispatch()
    return (
        <Dialog
            open={open}
            onClose={() => dispatch(closeAboutDialog())}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                About the String search tool
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This APP is created and mainatined by renchen (rsun@). If you have any recommendations on improving it, feel free to reach out to me directly.
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}