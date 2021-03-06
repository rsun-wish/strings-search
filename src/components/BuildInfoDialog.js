import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { openBuildInfoDialog } from '../actions';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import 'brace/ext/searchbox';
import BUILD from '../data/build.json'

export default function BuildInfoDialog() {
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
                The current String Seach Tool is built on {BUILD.last_build_time}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <AceEditor
                        mode="json"
                        theme="github"
                        readOnly={true}
                        width='100%'
                        wrapEnabled={true}
                        showPrintMargin={false}
                        value={JSON.stringify(BUILD.versions, null, 2)}
                        name="json-modal"
                    />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}