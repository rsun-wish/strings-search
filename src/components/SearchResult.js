import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import './SearchResult.css'
import Grid from '@mui/material/Grid';
import { changeSearchText, expandAccordion, search } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';

const RenderTranslatedContent = (dispatch, target, expansions) => {
    const isExpanded = expansions[target.source_string]
    const handleChange = (id) => (event, expanded) => {
        dispatch(expandAccordion(id, !isExpanded))
    };

    return (<Accordion key={target.source_string} expanded={isExpanded} onChange={handleChange(target.source_string)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
        >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography>
                        <div className="long_text_div">
                            {target.source_string}
                        </div>
                    </Typography>
                    <Typography>
                        <Button variant="contained" color="success" endIcon={<ManageSearchIcon />} onClick={() => {
                            dispatch(changeSearchText(target.source_string))
                            dispatch(search(target.source_string))
                        }
                        }>
                            Find Source
                        </Button>
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        {target.context}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>{target.locale}</Typography>
                </Grid>
            </Grid>
        </AccordionSummary>
        <AccordionDetails>
            <TableContainer component={Paper}>
                <Table aria-label="simple table" style={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Source String</TableCell>
                            <TableCell>Locale</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="td" scope="row" style={{
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                width: '30%'
                            }}>
                                {target.source_string}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {target.locale}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </AccordionDetails>
    </Accordion>);
}
const RenderSourceContent = (dispatch, target, expansions) => {
    const isExpanded = expansions[target.project]
    const handleChange = (id) => (event, expanded) => {
        dispatch(expandAccordion(id, !isExpanded))
    };
    return (
        <div>
            <Accordion key={target.project} expanded={isExpanded} onChange={handleChange(target.project)}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography>
                                {target.project}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>
                                {target.context}
                            </Typography>
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>
                                <div className="long_text_div">
                                    {target.description}
                                </div>
                            </Typography>
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" style={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project Name</TableCell>
                                    <TableCell align="right">Context</TableCell>
                                    <TableCell align="right">Plurals</TableCell>
                                    <TableCell align="right">Engineers</TableCell>
                                    <TableCell align="right">Product Managers</TableCell>
                                    <TableCell align="right">Owning team</TableCell>
                                    <TableCell align="right">CC List</TableCell>
                                    <TableCell align="right">Last Updated Time</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {target.project}
                                    </TableCell>
                                    <TableCell align="right" style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: '30%'
                                    }}>{target.context}</TableCell>
                                    <TableCell align="right">{target.plurals}</TableCell>
                                    <TableCell align="right">{target.engineers}</TableCell>
                                    <TableCell align="right">{target.pm}</TableCell>
                                    <TableCell align="right">{target.owning_team}</TableCell>
                                    <TableCell align="right">{target.cc_list}</TableCell>
                                    <TableCell align="right" style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: '30%'
                                    }}>{target.description}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </AccordionDetails>
            </Accordion>

        </div>
    )
}

const RenderSourceContentHeader = (sourceHeaderRendered) => {
    if (!sourceHeaderRendered) {
        return (<Grid container spacing={2}>
            <Grid item xs={2}>
                <div className="header">
                    <Typography variant="h6" gutterBottom component="div">
                        Project Name
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={5}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Context
                    </Typography>
                </div>
            </Grid >
            <Grid item xs={5}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Description
                    </Typography>
                </div>
            </Grid >
        </Grid >)
    } else {
        return null
    }
}

const RenderTranslatedContentHeader = (translatedHeaderRendered) => {
    if (!translatedHeaderRendered) {
        return (<Grid container spacing={2}>
            <Grid item xs={4}>
                <div className="header">
                    <Typography variant="h6" gutterBottom component="div">
                        Source String
                    </Typography>
                </div>
            </Grid>
            <Grid item xs={4}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Context
                    </Typography>
                </div>
            </Grid >
            <Grid item xs={4}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Locale
                    </Typography>
                </div>
            </Grid >
        </Grid >)

    } else {
        return null;
    }
}

const renderTranslation = (dispatch, translationTarget, expansions) => {
    if (translationTarget) {
        return (
            <div>
                {RenderTranslatedContentHeader(false)}
                {RenderTranslatedContent(dispatch, translationTarget, expansions)}
            </div>
        )
    } else {
        return null;
    }
}

export default function SearchResult() {
    const expansions = useSelector(state => state.app.expansions)
    const targets = useSelector(state => state.app.sourceTargets);
    const translationTarget = useSelector(state => state.app.translationTarget)
    const dispatch = useDispatch()

    let sourceHeaderRendered = false
    return (
        <div>
            {renderTranslation(dispatch, translationTarget, expansions)}
            {
                targets && targets.map(target => {
                    return (
                        <div>
                            {RenderSourceContentHeader(sourceHeaderRendered)}
                            {sourceHeaderRendered = true}
                            {RenderSourceContent(dispatch, target, expansions)}
                            <Divider />
                        </div>
                    )
                })
            }
        </div>
    )
}