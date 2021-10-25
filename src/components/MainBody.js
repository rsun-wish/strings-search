import * as React from 'react';
import { useSelector } from "react-redux"
import Typography from '@mui/material/Typography';
import './MainBody.css'

function MainBody() {
    const sourceTargets = useSelector(state => state.app.sourceTargets)
    const translationTarget = useSelector(state => state.app.translationTarget)
    if (Object.keys(sourceTargets).length > 0 || translationTarget) {
        return null
    } else {
        return (<div class="main-body">
            <Typography variant="h1" component="div" gutterBottom>
                No contents found
            </Typography>
        </div>)
    }
}

export default MainBody