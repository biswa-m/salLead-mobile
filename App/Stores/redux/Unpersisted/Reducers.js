import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {StoreTypes} from './Actions';

export const setVState = (state, {data}) => {
  return {
    ...state,
    ...data,
  };
};

export const resetVState = (state) => {
  return INITIAL_STATE;
};

export const setVScreenState = (state, {screen, data}) => {
  // console.warn('unp',screen, data,)
  return {
    ...state,
    [screen]: {
      ...(state[screen] || {}),
      ...data,
    },
  };
};

export const reducer = createReducer(INITIAL_STATE, {
  [StoreTypes.SET_V_STATE]: setVState,
  [StoreTypes.RESET_V_STATE]: resetVState,
  [StoreTypes.SET_V_SCREEN_STATE]: setVScreenState,
});
