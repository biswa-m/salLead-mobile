import { all, takeLeading} from 'redux-saga/effects';

import {StoreTypes as PersistedStoreTypes} from '../Stores/redux/Persisted/Actions';
import {fetchMyProfile} from './UserSaga';

export default function* root() {
  yield all([
    takeLeading(PersistedStoreTypes.FETCH_MY_PROFILE, fetchMyProfile),
  ]);
}
