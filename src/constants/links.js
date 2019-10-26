// page names that are used to reference the current page
export const LOGIN_PAGE_ID = 'LOGIN'
export const TAGGING_PAGE_ID = 'TAGGING'
export const MERGING_PAGE_ID = 'MERGING'
export const ADLC_PAGE_ID = 'ADLC'
export const SETTINGS_PAGE_ID = 'SETTINGS'
export const LOGS_PAGE_ID = 'LOGS'

export const GROUND_SERVER_URL =
    process.env.NODE_ENV === 'development' ?
        'http://127.0.0.1:9000' :
        'http://192.168.0.22:9000'
