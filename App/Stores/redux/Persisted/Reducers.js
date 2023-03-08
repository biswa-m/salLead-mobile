import {INITIAL_STATE} from './InitialState';
import {createReducer} from 'reduxsauce';
import {StoreTypes} from './Actions';

export const setPState = (state, {data}) => {
  return {...state, ...data};
};

export const resetPState = (state) => {
  return INITIAL_STATE;
};

export const setPScreenState = (state, {screen, data}) => {
  return {
    ...state,
    [screen]: {
      ...(state[screen] || {}),
      ...data,
    },
  };
};


export const reducer = createReducer(INITIAL_STATE, {
  [StoreTypes.SET_P_STATE]: setPState,
  [StoreTypes.RESET_P_STATE]: resetPState,
  [StoreTypes.SET_P_SCREEN_STATE]: setPScreenState,
});
