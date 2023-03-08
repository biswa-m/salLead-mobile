import AsyncStorage from '@react-native-community/async-storage';
import CookieManager from '@react-native-cookies/cookies';
import PersistedActions from 'App/Stores/redux/Persisted/Actions';
import UnpersistedActions from 'App/Stores/redux/Unpersisted/Actions';
import {store} from '../../store';

const clearData = async store => {
  await AsyncStorage.removeItem('auth/user');

  if (store) {
    store.dispatch(UnpersistedActions.resetVState());
    store.dispatch(PersistedActions.resetPState());
  }
};

export const logout = async () => {
  console.info('Logging out');

  await CookieManager.clearAll();
  clearData(store);

  return null;
};
