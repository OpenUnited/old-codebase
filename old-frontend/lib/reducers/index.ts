import { combineReducers } from 'redux';
import {
  userReducer,
  UserState,
} from './user.reducer';
import {
  workReducer,
  WorkState,
} from './work.reducer';

export interface State {
  user?: UserState;
  work: WorkState;
}

export const rootReducers = combineReducers<State>({
  user: userReducer,
  work: workReducer
});
