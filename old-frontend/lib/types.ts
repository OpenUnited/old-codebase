export const USER_LOGGED_IN = "USER_LOGGED_IN";
export const SAVE_TAGS = "SAVE_TAGS";
export const SAVE_USERS = "SAVE_USERS";
export const SAVE_CATEGORIES = "SAVE_CATEGORIES";
export const SET_CURRENT_PROJECT = "SET_CURRENT_PROJECT";
export const SET_USER_ROLE = "SET_USER_ROLE";
export const SET_LOGIN_URL = "SET_LOGIN_URL";
export const SET_REGISTER_URL = "SET_REGISTER_URL";
export const ADD_REPOSITORY = "ADD_REPOSITORY";
export const SET_CAPABILITIES = "SET_CAPABILITIES";
export const ADD_CAPABILITY = "ADD_CAPABILITY";

export interface BaseAction {
  type: string;
  payload?: any;
}
