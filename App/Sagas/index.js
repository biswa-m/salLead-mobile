import {all, takeLeading} from 'redux-saga/effects';

import {StoreTypes as PersistedStoreTypes} from '../Stores/redux/Persisted/Actions';

export default function* root() {
  yield all([]);
}
