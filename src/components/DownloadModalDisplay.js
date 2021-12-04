import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { changeDownloadResultFileFormat, displayDownloadModal, changeDownloadResultFileName, downloadResults } from '../actions';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import exportFromJSON from 'export-from-json';

import './DataModalDisplay.css'

export default function DownloadModalDisplay() {
    const displayDownload = useSelector(state => state.app.displayDownloadModal)
    const filename = useSelector(state => state.app.downloadResultFileName)
    const format = useSelector(state => state.app.downloadResultFileFormat)

    const dispatch = useDispatch()
    return (
        <Dialog
            open={displayDownload}
            onClose={() => dispatch((displayDownloadModal(false)))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                Download search results
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Configure the following download options
                </DialogContentText>
                <TextField
                    id="name"
                    label="File Name"
                    fullWidth
                    variant="filled"
                    value={filename}
                    onChange={(event) => dispatch(changeDownloadResultFileName(event.target.value))}
                />
                <InputLabel id="demo-simple-select-label">File Format</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    fullWidth
                    value={format}
                    label="File Format"
                    onChange={(event) => dispatch(changeDownloadResultFileFormat(event.target.value))}
                >
                    <MenuItem value={exportFromJSON.types.txt}>txt</MenuItem>
                    <MenuItem value={exportFromJSON.types.css}>css</MenuItem>
                    <MenuItem value={exportFromJSON.types.html}>html</MenuItem>
                    <MenuItem value={exportFromJSON.types.json}>json</MenuItem>
                    <MenuItem value={exportFromJSON.types.csv}>csv</MenuItem>
                    <MenuItem value={exportFromJSON.types.xls}>xls</MenuItem>
                    <MenuItem value={exportFromJSON.types.xml}>xml</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => dispatch(displayDownloadModal(false))}>Cancel</Button>
                <Button variant="outlined" onClick={() => dispatch(downloadResults())}>Download</Button>
            </DialogActions>
        </Dialog >
    );
}