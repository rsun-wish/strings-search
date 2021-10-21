import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import SearchInput from './SearchInput';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { closeNotification, search } from '../actions'
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { fetchLocaleTranslations, setLocale, openAboutDialog } from '../actions'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));


const renderLocaleSelector = (locales) => {
    return locales.map(locale => (
        <MenuItem value={locale}>
            <em>{locale}</em>
        </MenuItem>
    ))
}

const renderSnackBar = (dispatch, notification) => {
    return (<Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={notification} autoHideDuration={6000} onClose={() => dispatch(closeNotification())}>
            <Alert severity="success" sx={{ width: '100%' }}>
                {notification}
            </Alert>
        </Snackbar>
    </Stack>)
}

export default function PrimarySearchAppBar() {
    const text = useSelector(state => state.app.searchText)
    const locales = useSelector(state => state.app.locales)
    const selectedLocale = useSelector(state => state.app.selectedLocale)
    const translationLoading = useSelector(state => state.app.translationLoading)
    const notification = useSelector(state => state.app.notification)
    const dispatch = useDispatch()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={translationLoading}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Toolbar>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        String search tool
                    </Typography>
                    <Tooltip title="Select the locale of the string you want to search" arrow>
                        <FormControl variant="standard" color="primary" sx={{ m: 1, minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-standard-label">Locale</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={selectedLocale}
                                onChange={(event) => {
                                    dispatch(setLocale(event.target.value));
                                    dispatch(fetchLocaleTranslations(event.target.value));
                                }}
                                label="Locale"
                            >
                                {renderLocaleSelector(locales)}
                            </Select>
                        </FormControl>
                    </Tooltip>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <SearchInput />
                    </Search>
                    <Button variant="contained" color="success" onClick={() => dispatch(search(text))}>
                        Search
                    </Button>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton
                        size="large"
                        aria-label="display more actions"
                        edge="end"
                        color="inherit"
                        onClick={() => dispatch(openAboutDialog())}
                    >
                        <MoreIcon />
                    </IconButton>
                </Toolbar>
                {renderSnackBar(dispatch, notification)}
            </AppBar>
        </Box>
    );
}