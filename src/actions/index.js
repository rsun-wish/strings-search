export const CLICK_COUNT = 'CLICK_COUNT'
export const CHANGE_SEARCH_TEXT = 'CHANGE_SEARCH_TEXT'
export const LOAD_DATA = 'LOAD_DATA'
export const SEARCH = 'SEARCH'
export const FETCH_LOCALE_TRANSLATIONS = 'FETCH_LOCALE_TRANSLATIONS'
export const SET_LOCALE = 'SET_LOCALE'
export const CLOSE_NOTIFICATION = 'CLOSE_NOTIFICATION'
export const OPEN_ABOUT_DIALOG = 'OPEN_ABOUT_DIALOG'
export const CLOSE_ABOUT_DIALOG = 'CLOSE_ABOUT_DIALOG'
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