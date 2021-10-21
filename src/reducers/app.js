import { CLICK_COUNT, CHANGE_SEARCH_TEXT, SEARCH, SET_LOCALE, FETCH_LOCALE_TRANSLATIONS, CLOSE_NOTIFICATION, OPEN_ABOUT_DIALOG, CLOSE_ABOUT_DIALOG } from "../actions"
import produce from "immer"
import sources from '../data/sources.json'
import projects from '../data/projects.json'

/*
sources
{
    "source_text": {
        "project_name": string,
        "project_id": number,
        "context": string,
        "plurals": [string]
    }
}

projects
{
    "project_id": {
        "name": string,
        "description": "",
        "source_loclaes": [string]
    }
}

*/
const initialState = {
    count: 0,
    searchText: '',
    sourceTargets: [],
    aboutDialogOpen: false,
    translationTarget: undefined,
    sources,
    projects,
    selectedLocale: 'en-US',
    translationLoading: false,
    translations: {},
    notification: '',
    expansions: {}
}
export default (state = initialState, action) => {
    switch (action.type) {
        case CLICK_COUNT:
            return {
                ...state,
                count: state.count + 1
            }
        case CHANGE_SEARCH_TEXT:
            return produce(state, draft => {
                draft.searchText = action.payload
            })
        case SET_LOCALE:
            return produce(state, draft => {
                draft.selectedLocale = action.payload
            })
        case FETCH_LOCALE_TRANSLATIONS + '_PENDING':
            return produce(state, draft => {
                draft.translationLoading = true
            })
        case FETCH_LOCALE_TRANSLATIONS + '_FULFILLED':
            return produce(state, draft => {
                draft.translationLoading = false
                draft.translations[state.selectedLocale] = action.payload
                draft.notification = `${Object.keys(draft.translations[state.selectedLocale]).length} translations for ${state.selectedLocale} are loaded successfully. `
            })
        case SEARCH:
            return produce(state, draft => {
                const targets = state.sources[action.payload]
                const translations = state.translations[state.selectedLocale]
                if (translations) {
                    draft.translationTarget = translations[action.payload]
                    console.log(translations[action.payload])
                } else {
                    draft.translationTarget = undefined
                    draft.expansions = {}
                }

                if (targets) {
                    draft.sourceTargets = targets.map(target => ({
                        ...target,
                        ...state.projects[target.project]
                    }))
                    targets.forEach(target => draft.expansions[target.feature_name] = false)
                } else {
                    draft.sourceTargets = []
                    draft.expansions = {}
                }
            })
        case CLOSE_NOTIFICATION:
            return produce(state, draft => {
                draft.notification = ''
            })
        case OPEN_ABOUT_DIALOG:
            return produce(state, draft => {
                draft.aboutDialogOpen = true
            })
        case CLOSE_ABOUT_DIALOG:
            return produce(state, draft => {
                draft.aboutDialogOpen = false
            })
        default:
            return state
    }
}