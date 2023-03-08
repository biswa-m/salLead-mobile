import {put, call} from 'redux-saga/effects';

import PersistedActions from '../Stores/redux/Persisted/Actions';
import api from '../Services/Api/api';
import {logout} from '../Modules/auth/logout';

export function* fetchMyProfile() {
  try {
    const {data: res} = yield call(() => api.get('account?format=json'));
    const account = res.data;
    console.info({account});

    if (account) {
      if (account.isLoggedIn === false) {
        logout();
      } else {
        yield put(PersistedActions.setPScreenState('AUTH', {account}));
      }
    } else {
      throw new Error('Something went wrong');
    }
  } catch (error) {
    console.warn('Error fetching myProfile: ', error.message);
  }
}
