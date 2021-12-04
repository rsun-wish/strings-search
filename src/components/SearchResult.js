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
import { changeSearchText, expandAccordion, publishNotification, search } from '../actions';
import { useSelector, useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { styled } from '@mui/material/styles';

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
                <Grid item xs={2}>
                    <Typography>
                        {target.package}
                    </Typography>
                </Grid>
                <Grid item xs={2}>
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
                            <TableCell>Context</TableCell>
                            <TableCell>Package</TableCell>
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
                                {target.context}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {target.package}
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


                            <Typography>
                                <CopyToClipboard text={target.project}>
                                    <Button variant="contained" color="success" endIcon={<ContentCopyIcon />} onClick={() => dispatch(publishNotification('Project name copied!'))}>
                                        Copy
                                    </Button>
                                </CopyToClipboard>
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography>
                                {target.context}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>
                                <div className="long_text_div">
                                    {target.description}
                                </div>
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography>
                                <div className="long_text_div">
                                    {target.source}
                                </div>
                            </Typography>
                            <Typography>
                                <CopyToClipboard text={target.source}>
                                    <Button variant="contained" color="success" endIcon={<ContentCopyIcon />} onClick={() => dispatch(publishNotification('Source text copied!'))}>
                                        Copy
                                    </Button>
                                </CopyToClipboard>
                            </Typography>

                        </Grid>
                    </Grid>
                </AccordionSummary>
                <AccordionDetails>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table" style={{ tableLayout: 'fixed', width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography>
                                            Project Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Context
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Plurals
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Engineers
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Product Managers
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Owning team
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            CC List
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Last Updated Time
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>
                                            Description
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {target.project}
                                    </TableCell>
                                    <TableCell style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                        width: '30%'
                                    }}>{target.context}</TableCell>
                                    <TableCell>{target.plurals}</TableCell>
                                    <TableCell>{target.engineers}</TableCell>
                                    <TableCell>{target.pm}</TableCell>
                                    <TableCell>{target.owning_team}</TableCell>
                                    <TableCell>{target.cc_list}</TableCell>
                                    <TableCell>{target.last_update_time}</TableCell>
                                    <TableCell style={{
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
            <Grid item xs={2}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Context
                    </Typography>
                </div>
            </Grid >
            <Grid item xs={4}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Description
                    </Typography>
                </div>
            </Grid >
            <Grid item xs={4}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Source String
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
            <Grid item xs={2}>
                <div className="header" >
                    <Typography variant="h6" gutterBottom component="div">
                        Package
                    </Typography>
                </div>
            </Grid >
            <Grid item xs={2}>
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
        return RenderTranslatedContent(dispatch, translationTarget, expansions)
    } else {
        return null;
    }
}

export default function SearchResult() {
    const expansions = useSelector(state => state.app.expansions)
    const targets = useSelector(state => state.app.filteredSourceTargets);
    const translationTargets = useSelector(state => state.app.translationTargets)
    const dispatch = useDispatch()

    let translatedHeaderRendered = false
    let sourceHeaderRendered = false
    return (
        <div>
            {translationTargets && translationTargets.map(target => {
                return (<div>
                    {RenderTranslatedContentHeader(translatedHeaderRendered)}
                    {translatedHeaderRendered = true}
                    {renderTranslation(dispatch, target, expansions)}
                </div>)
            })}
            {
                targets && targets.map(target => {
                    return (
                        <div>
                            {RenderSourceContentHeader(sourceHeaderRendered)}
                            {sourceHeaderRendered = true}
                            <div className="search-result">
                                <Paper elevation={3}>
                                    {RenderSourceContent(dispatch, target, expansions)}
                                </Paper>
                            </div>
                            <Divider />
                        </div>
                    )
                })
            }
        </div>
    )
}