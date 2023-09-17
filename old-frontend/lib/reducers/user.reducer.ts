import { BaseAction, USER_LOGGED_IN } from '../types';

export type UserState = {
  isLoggedIn: boolean,
  firstName: string,
  slug: string,
  id: string,
  roles: {product: string, role: string}[],
};

// const userId = window.localStorage.getItem("userId");
// const firstName = window.localStorage.getItem("firstName");

export const userReducer = (
  state: any = {
    isLoggedIn: false,//userId ? true : false,
    firstName: '',
    slug: '',
    username: '',
    id: null,
    claimedTask: null,
    roles: [],
    loading: true,
  },
  action: BaseAction
) => {
  switch (action.type) {
    case USER_LOGGED_IN:
      return {...state, ...action.payload};
  }
  return state;
};
