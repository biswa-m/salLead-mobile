import {combineReducers} from 'redux';

import rootSaga from '../../Sagas';
import configureStore from './CreateStore';
import {reducer as unpReducer} from './Unpersisted/Reducers';
import {reducer as pReducer} from './Persisted/Reducers';

export default () => {
  const rootReducer = combineReducers({
    pState: pReducer,
    vState: unpReducer,
  });

  return configureStore(rootReducer, rootSaga);
};
