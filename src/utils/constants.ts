export const HOST = import.meta.env.VITE_SERVER_URL;

export const AUTH_ROUTES = `${HOST}/auth`;
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`;
export const SIGNIN_ROUTE = `${AUTH_ROUTES}/signin`;

export const POST_ROUTES = `${HOST}/posts`;
export const NEW_POST_ROUTE = `${POST_ROUTES}`;
export const SEARCH_POST_ROUTE = `${POST_ROUTES}/search`

export const USER_ROUTES = `${HOST}/users`;
export const SEARCH_USER_ROUTE = `${USER_ROUTES}/search`

export const APP_STORE_ROUTE = `https://tmwalsh.com`;

export const CONFIRM_LINK_ROUTE = `${AUTH_ROUTES}/confirmation`
export const CHECK_CONFIRM_ROUTE = `${CONFIRM_LINK_ROUTE}/status`
export const SEND_CONFIRM_ROUTE = `${CONFIRM_LINK_ROUTE}/send`
export const VERIFY_CONFIRM_ROUTE = `${CONFIRM_LINK_ROUTE}/confirm`