export const CLICK_COUNT = 'CLICK_COUNT'
export const CHANGE_SEARCH_TEXT = 'CHANGE_SEARCH_TEXT'
export const LOAD_DATA = 'LOAD_DATA'
export const SEARCH = 'SEARCH'
export const FETCH_LOCALE_TRANSLATIONS = 'FETCH_LOCALE_TRANSLATIONS'
export const SET_LOCALE = 'SET_LOCALE'
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'
export const OPEN_ABOUT_DIALOG = 'OPEN_ABOUT_DIALOG'
export const CLOSE_ABOUT_DIALOG = 'CLOSE_ABOUT_DIALOG'
export const EXPAND_ACCORDION = 'EXPAND_ACCORDION'
export const EXPAND_MORE_MENUS = 'EXPAND_MORE_MENUS'
export const EXPAND_ALL = 'EXPAND_ALL'
export const TOGGLE_LEFT_DRAWER = 'TOGGLE_LEFT_DRAWER'
export const DISPLAY_JSON_MODAL = 'DISPLAY_JSON_MODAL'
export const OPEN_BUILD_INFO_DIALOG = 'OPEN_BUILD_INFO_DIALOG'
export const SET_FUZZY_SEARCH = 'SET_FUZZY_SEARCH'
export const DISPLAY_DOWNLOAD_MODAL = 'DISPLAY_DOWNLOAD_MODAL'
export const CHANGE_DOWNLOAD_RESULT_FILENAME = 'CHANGE_DOWNLOAD_RESULT_FILENAME'
export const CHANGE_DOWNLOAD_FILE_FORMAT = 'CHANGE_DOWNLOAD_FILE_FORMAT'
export const DOWNLOAD_RESULTS = 'DOWNLOAD_RESULTS'
export const FILTER_PROJECT = 'FILTER_PROJECT'
export const PUBLISH_NOTIFICATION = 'PUBLISH_NOTIFICATION'
export const clickCount = () => ({
    type: CLICK_COUNT
})

export const changeSearchText = (text) => ({
    type: CHANGE_SEARCH_TEXT,
    payload: text
})

export const loadData = () => ({
    type: LOAD_DATA,
    payload: fetch('/strings.json').then(data => data.json())
})

export const search = (text) => ({
    type: SEARCH,
    payload: text
})

export const setLocale = (locale) => ({
    type: SET_LOCALE,
    payload: locale
})

export const fetchLocaleTranslations = (locale) => ({
    type: FETCH_LOCALE_TRANSLATIONS,
    payload: fetch(`translations/${locale}/strings.json`).then(data => data.json())
})

export const closeNotification = () => ({
    type: CLOSE_NOTIFICATION
})

export const openAboutDialog = () => ({
    type: OPEN_ABOUT_DIALOG
})

export const closeAboutDialog = () => ({
    type: CLOSE_ABOUT_DIALOG
})

export const expandAccordion = (id, expanded) => ({
    type: EXPAND_ACCORDION,
    payload: {
        id,
        expanded
    }
})

export const expandAll = (expandAll) => ({
    type: EXPAND_ALL,
    payload: expandAll
})

export const toggleLeftDrawer = (open) => ({
    type: TOGGLE_LEFT_DRAWER,
    payload: open
})

export const displayJsonModal = (dataType) => ({
    type: DISPLAY_JSON_MODAL,
    payload: dataType
})

export const openBuildInfoDialog = (open) => ({
    type: OPEN_BUILD_INFO_DIALOG,
    payload: open
})

export const setFuzzySearch = (checked) => ({
    type: SET_FUZZY_SEARCH,
    payload: checked
})

export const displayDownloadModal = (display) => ({
    type: DISPLAY_DOWNLOAD_MODAL,
    payload: display
})

export const changeDownloadResultFileName = (filename) => ({
    type: CHANGE_DOWNLOAD_RESULT_FILENAME,
    payload: filename
})

export const changeDownloadResultFileFormat = (format) => ({
    type: CHANGE_DOWNLOAD_FILE_FORMAT,
    payload: format
})

export const downloadResults = () => ({
    type: DOWNLOAD_RESULTS,
})

export const filterProject = (project) => ({
    type: FILTER_PROJECT,
    payload: project
})

export const publishNotification = (content) => ({
    type: PUBLISH_NOTIFICATION,
    payload: content
})