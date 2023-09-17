import * as types from './types';
import { UserState } from './reducers/user.reducer';

export const userLogInAction = (data: UserState): types.BaseAction => {
  return {
    type: types.USER_LOGGED_IN,
    payload: data,
  }
};

export const saveTags = (data: any): types.BaseAction => {
  return {
    type: types.SAVE_TAGS,
    payload: data
  }
}

export const saveUsers = (data: any): types.BaseAction => {
  return {
    type: types.SAVE_USERS,
    payload: data
  }
}

export const saveCategories = (data: any): types.BaseAction => {
  return {
    type: types.SAVE_CATEGORIES,
    payload: data
  }
}

export const setCurrentProject = (data: any): types.BaseAction => {
  return {
    type: types.SET_CURRENT_PROJECT,
    payload: data
  }
}

export const setUserRole = (data: any): types.BaseAction => {
  return {
    type: types.SET_USER_ROLE,
    payload: data
  }
}

export const setLoginURL = (loginUrl: string): types.BaseAction => {
  return {
    type: types.SET_LOGIN_URL,
    payload: { loginUrl }
  }
}

export const setRegisterURL = (registerUrl: string): types.BaseAction => {
  return {
    type: types.SET_REGISTER_URL,
    payload: { registerUrl }
  }
}

// export const addRepository = (data: any): types.BaseAction => {
//   return {
//     type: types.ADD_REPOSITORY,
//     payload: data
//   }
// }
//
// export const setCapabilities = (data: any): types.BaseAction => {
//   return {
//     type: types.SET_CAPABILITIES,
//     payload: data
//   }
// }
//
//
// export const addCapability = (data: any): types.BaseAction => {
//   return {
//     type: types.ADD_CAPABILITY,
//     payload: data
//   }
// }
