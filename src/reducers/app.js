import { CLICK_COUNT, CHANGE_SEARCH_TEXT, SEARCH, SET_LOCALE, FETCH_LOCALE_TRANSLATIONS, CLOSE_NOTIFICATION, OPEN_ABOUT_DIALOG, CLOSE_ABOUT_DIALOG, EXPAND_ALL, EXPAND_ACCORDION, TOGGLE_LEFT_DRAWER, DISPLAY_JSON_MODAL, OPEN_BUILD_INFO_DIALOG, SET_FUZZY_SEARCH, DISPLAY_DOWNLOAD_MODAL, CHANGE_DOWNLOAD_RESULT_FILENAME, CHANGE_DOWNLOAD_FILE_FORMAT, DOWNLOAD_RESULTS, FILTER_PROJECT, COPY, PUBLISH_NOTIFICATION, SEARCH_PENDING, SEARCH_FULFILLED } from "../actions"
import produce from "immer"
import sources from '../data/sources.json'
import projects from '../data/projects.json'
import locales from '../data/locales.json'
import exportFromJSON from 'export-from-json';


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
    translationTargets: undefined,
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
    buildInfoDialogOpen: false,
    fuzzySearch: true,
    displayDownloadModal: false,
    downloadResultFileName: 'results',
    downloadResultFileFormat: exportFromJSON.types.json,
    filteredSourceTargets: [],
    projectFilter: ''
}

const fuzzySearch = (state, action, draft) => {
    const fuzzySearch = state.fuzzySearch
    let sourceStrings = [action.payload]
    if (fuzzySearch) {
        sourceStrings = Object.keys(state.sources).filter(key => key.includes(action.payload))
    }

    let sourceTargets = []
    let translationTargets = []
    const translations = state.translations[state.selectedLocale]

    for (var i = 0; i < sourceStrings.length; i++) {
        const sourceString = sourceStrings[i]
        const targets = state.sources[sourceStrings[i]]
        if (translations && translations[sourceStrings[i]]) {
            translationTargets.concat(translations[sourceStrings[i]])
        }

        if (targets) {
            const mappedTargets = targets.map(target => ({
                source: sourceString,
                ...target,
                ...state.projects[target.project]
            }));
            sourceTargets = sourceTargets.concat(mappedTargets);
        }
    }
    draft.sourceTargets = sourceTargets;
    draft.filteredSourceTargets = sourceTargets;
    draft.translationTargets = translationTargets;
    draft.sourceTargets.forEach(target => draft.expansions[target.project] = false);
    draft.translationTargets.forEach(target => draft.expansions[target.sourceStrings] = false);
    if (draft.translationTargets.length && draft.sourceTargets.length === 0) {
        draft.translationTargets = []
        draft.filteredSourceTargets = []
        draft.expansions = {}
    }
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
        case SEARCH_PENDING:
            return produce(state, draft => {
                draft.translationLoading = true
            })
        case SEARCH_FULFILLED:
            return produce(state, draft => {
                draft.translationLoading = false
                draft.sourceTargets = action.payload.sourceTargets
                draft.filteredSourceTargets = action.payload.filteredSourceTargets
                draft.translationTargets = action.payload.translationTargets
                draft.expansions = action.payload.expansions
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
        case SET_FUZZY_SEARCH:
            return produce(state, draft => {
                draft.fuzzySearch = action.payload
            })
        case DISPLAY_DOWNLOAD_MODAL:
            return produce(state, draft => {
                draft.displayDownloadModal = action.payload
            })
        case CHANGE_DOWNLOAD_RESULT_FILENAME:
            return produce(state, draft => {
                draft.downloadResultFileName = action.payload
            })
        case CHANGE_DOWNLOAD_FILE_FORMAT:
            return produce(state, draft => {
                draft.downloadResultFileFormat = action.payload
            })
        case DOWNLOAD_RESULTS:
            exportFromJSON(
                {
                    data: state.sourceTargets,
                    fileName: state.downloadResultFileName + '.' + state.downloadResultFileFormat,
                    exportType: state.downloadResultFileFormat,
                })
            return state
        case FILTER_PROJECT:
            return produce(state, draft => {
                draft.projectFilter = action.payload
                draft.filteredSourceTargets = state.sourceTargets.filter(target => target.project.startsWith(action.payload))
            })
        case PUBLISH_NOTIFICATION:
            return produce(state, draft => {
                draft.notification = action.payload
            })
        default:
            return state
    }
}