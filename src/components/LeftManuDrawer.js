import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useDispatch, useSelector } from 'react-redux';
import { displayJsonModal, toggleLeftDrawer } from '../actions';
import { SOURCES_JSON, TRANSLATIONS_JSON } from '../constants';
import ListItemButton from '@mui/material/ListItemButton';

const renderTranslationsMenu = (dispatch, hasTranslations) => {
    if (hasTranslations) {
        return (
            <ListItemButton onClick={() => dispatch(displayJsonModal(TRANSLATIONS_JSON))}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary='All Translations' />
            </ListItemButton>)
    } else {
        return null
    }
}

export default function TemporaryDrawer() {
    const leftDrawerOpen = useSelector(state => state.app.leftDrawerOpen)
    const hasTranslations = useSelector(state => Object.keys(state.app.translations).length > 0)
    const dispatch = useDispatch()

    const menus = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => dispatch(toggleLeftDrawer(true))}
        >
            <List>
                <ListItemButton onClick={() => dispatch(displayJsonModal(SOURCES_JSON))}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary='All Sources' />
                </ListItemButton>
                <Divider/>
                {renderTranslationsMenu(dispatch, hasTranslations)}
            </List>
        </Box>
    );

    return (
        <div>
            <React.Fragment>
                <Drawer
                    anchor='left'
                    open={leftDrawerOpen}
                    onClose={() => dispatch(toggleLeftDrawer(false))}
                >
                    {menus()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}