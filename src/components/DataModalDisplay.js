import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { displayJsonModal } from '../actions';
import { SOURCES_JSON, TRANSLATIONS_JSON } from '../constants';
import { changeSearchText, search } from '../actions'
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-github";
import 'brace/ext/searchbox';
import './DataModalDisplay.css'

export default function DataModalDisplay() {
    const dataType = useSelector(state => state.app.displayModal)
    const locale = useSelector(state => state.app.selectedLocale)
    const data = useSelector(state => dataType ? (dataType === SOURCES_JSON ? Object.keys(state.app.sources) : Object.keys(state.app.translations[state.app.selectedLocale])) : null)

    const dispatch = useDispatch()
    return (
        <Dialog
            fullWidth={true}
            maxWidth={true}
            open={dataType}
            onClose={() => dispatch((displayJsonModal(null)))}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {dataType == SOURCES_JSON ? 'All Source Strings' : null}
                {dataType == TRANSLATIONS_JSON ? 'All Target Strings for locale ' + locale : null}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <AceEditor
                        mode="json"
                        theme="github"
                        readOnly={true}
                        width='100%'
                        onSelectionChange={(value, event) => {
                            if (data) {
                                dispatch(changeSearchText(data[value.getCursor().row - 1]));
                                dispatch(search(data[value.getCursor().row - 1]));
                            }
                        }}
                        wrapEnabled={true}
                        showPrintMargin={false}
                        value={JSON.stringify(data, null, 2)}
                        name="json-modal"
                    />
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
}