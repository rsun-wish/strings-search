import React from 'react';
import TextField from '@mui/material/TextField';
import './SearchInput.css';
import { useDispatch, useSelector } from 'react-redux'
import { changeSearchText } from '../actions';

export default function FreeSolo() {
    const dispatch = useDispatch();
    const searchText = useSelector(state => state.app.searchText);
    return (
        <div id='search-input'>
            <TextField multiline fullWidth inputProps={{ style: { paddingLeft: '50px', color: 'white' }, value: searchText }} value={searchText} onChange={(event) => dispatch(changeSearchText(event.target.value))} />
        </div>
    )
}