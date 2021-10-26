import { CLICK_COUNT, CHANGE_SEARCH_TEXT, SEARCH, SET_LOCALE, FETCH_LOCALE_TRANSLATIONS, CLOSE_NOTIFICATION, OPEN_ABOUT_DIALOG, CLOSE_ABOUT_DIALOG, EXPAND_ALL, EXPAND_ACCORDION, TOGGLE_LEFT_DRAWER, DISPLAY_JSON_MODAL, OPEN_BUILD_INFO_DIALOG } from "../actions"
import produce from "immer"
import sources from '../data/sources.json'
import projects from '../data/projects.json'
import locales from '../data/locales.json'


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
    locales,
    selectedLocale: 'en-US',
    translationLoading: false,
    translations: {},
    notification: '',
    expansions: {},
    expandAll: false,
    leftDrawerOpen: false,
    displayModal: null,
    buildInfoDialogOpen: false
}

 // eslint-disable-next-line
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
                } else {
                    draft.translationTarget = undefined
                    draft.expansions = {}
                }

                if (targets) {
                    draft.sourceTargets = targets.map(target => ({
                        ...target,
                        ...state.projects[target.project]
                    }))
                    targets.forEach(target => draft.expansions[target.project] = false)
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
        case EXPAND_ACCORDION:
            return produce(state, draft => {
                draft.expansions[action.payload.id] = action.payload.expanded
            })
        case EXPAND_ALL:
            return produce(state, draft => {
                draft.expandAll = action.payload
                const targets = state.sourceTargets

                if (targets) {
                    targets.forEach(target => draft.expansions[target.project] = action.payload)
                }
            })
        case TOGGLE_LEFT_DRAWER:
            return produce(state, draft => {
                draft.leftDrawerOpen = action.payload
            })
        case DISPLAY_JSON_MODAL:
            return produce(state, draft => {
                draft.displayModal = action.payload
            })
        case OPEN_BUILD_INFO_DIALOG:
            return produce(state, draft => {
                draft.buildInfoDialogOpen = action.payload
            })
        default:
            return state
    }
}