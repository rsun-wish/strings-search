import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { closeAboutDialog, openBuildInfoDialog } from '../actions';
import BUILD from '../data/build.json'

export default function BuildInfo() {
    const open = useSelector(state => state.app.buildInfoDialogOpen)
    const dispatch = useDispatch()
    return (
        <Dialog
            open={open}
            onClose={() => dispatch(openBuildInfoDialog(false))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                The current String Search Tool is built on {BUILD.last_build_time}. 
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    This APP is created and mainatined by renchen (rsun@). If you have any recommendations on improving it, feel free to reach out to me directly.
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}