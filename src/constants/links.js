// page names that are used to reference the current page
export const LOGIN_PAGE_ID = 'LOGIN'
export const LOGOUT_PAGE_ID = 'LOGOUT'
export const TAGGING_PAGE_ID = 'TAGGING'
export const MERGING_PAGE_ID = 'MERGING'
export const ADLC_PAGE_ID = 'ADLC'
export const SETTINGS_PAGE_ID = 'SETTINGS'
export const LOGS_PAGE_ID = 'LOGS'
export const PROGRESS_PAGE_ID = 'PROGRESS'
export const GROUND_SERVER_URL =
    process.env.REACT_APP_GS_IP ?
      `http://${process.env.REACT_APP_GS_IP}:9000` :
      process.env.NODE_ENV === 'development' ?
        'http://127.0.0.1:9000' :
        'http://192.168.0.22:9000'
