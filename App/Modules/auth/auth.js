import {Alert} from 'react-native';
import {store} from '../../store';
import PersistedActions from '../../Stores/redux/Persisted/Actions';
import UnpersistedActions from '../../Stores/redux/Unpersisted/Actions';
import navigationModule from '../navigationModule';

const authModule = {};

authModule.login = user => {
  console.log(JSON.stringify({user}, null, 2));

  store.dispatch(
    PersistedActions.setPScreenState('AUTH', {
      user,
    }),
  );
};

authModule.logout = async () => {
  console.info('Logging out');

  if (store) {
    store.dispatch(UnpersistedActions.resetVState());
    store.dispatch(PersistedActions.resetPState());
  }
};

authModule.confirmAndLogout = async () => {
  Alert.alert('Confirm Logout', 'Are you sure, you want to logout ?', [
    {
      text: 'Logout',
      onPress: () => {
        authModule.logout();
      },
      style: 'destructive',
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);
};

export default authModule;
