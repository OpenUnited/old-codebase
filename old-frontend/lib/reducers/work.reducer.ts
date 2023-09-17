import * as types from '../types';

export type WorkState = {
  tags: Array<any>;
  currentProduct: any;
  userRole: string;
  repositories: Array<any>;
};

export const workReducer = (
  state: any = {
    tags: [],
    userRole: '',
    currentProduct: null,
    repositories: [],
    allTags: [],
    allCategories: [],
    allUsers: [],
    loginUrl: null,
    registerUrl: null
  },
  action: types.BaseAction
) => {
  switch (action.type) {
    case types.SAVE_TAGS:
    case types.SAVE_USERS:
    case types.SAVE_CATEGORIES:
    case types.SET_CURRENT_PROJECT:
    case types.SET_USER_ROLE:
    case types.SET_LOGIN_URL:
    case types.SET_REGISTER_URL:
      return { ...state, ...action.payload };
    case types.ADD_REPOSITORY:
      const newRepositories = Object.assign([], state.repositories);
      newRepositories.push(action.payload);
      return { ...state, repositories: newRepositories };
    case types.SET_CAPABILITIES:
      const currentProduct = Object.assign({}, state.currentProduct);
      currentProduct.capabilitySet = action.payload;
      return { ...state, currentProduct: currentProduct };
    case types.ADD_CAPABILITY:
      const newCurrentProduct = Object.assign({}, state.currentProduct);
      newCurrentProduct.capabilitySet.push(action.payload);
      return { ...state, currentProduct: newCurrentProduct };
    default:
      return state;
  }
  return state;
};
