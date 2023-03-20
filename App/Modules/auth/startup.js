import AsyncStorage from '@react-native-community/async-storage';
import PersistedActions from 'App/Stores/redux/Persisted/Actions';
import UnpersistedActions from 'App/Stores/redux/Unpersisted/Actions';
import {Alert, Platform} from 'react-native';
import api from '../../Services/Api/api';
import {store} from '../../store';
import apiModule from '../api/apiModule';
import pushNotificationModule from '../pushNotification/push-notification-module';

const onChangeToken = token => {
  console.info('firebase token: ', token);
};

const onRemoteMessage = async remoteMessage => {
  console.info('Remote Message', JSON.stringify(remoteMessage, null, 4));
  // Alert.alert('Remote Message!', JSON.stringify(remoteMessage, null, 4));
  await saveNotification(remoteMessage);
};

const onBGMessage = async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  await saveNotification(remoteMessage);
};

const saveNotification = async remoteMessage => {
  const app_notificaitonsStr = await AsyncStorage.getItem('app_notifications');
  const app_notificaitons = app_notificaitonsStr
    ? JSON.parse(app_notificaitonsStr)
    : {};

  const userid = store.getState()?.pState.AUTH?.user?.id;
  const updated = {
    ...app_notificaitons,
    [userid.toString()]: [
      remoteMessage,
      ...(app_notificaitons?.[userid.toString()] || []),
    ],
  };

  await AsyncStorage.setItem('app_notifications', JSON.stringify(updated));

  console.info(JSON.stringify(updated, null, 2));
};

export const fetchMyProfile = async () => {
  const {user} = await apiModule.fetchMyProfile();
  // console.warn(user, Math.random());
  store.dispatch(
    PersistedActions.setPScreenState('AUTH', {
      user,
    }),
  );
};

export const initAuth = async () => {
  await fetchMyProfile();

  pushNotificationModule.init({onChangeToken});
};

export const startup = async () => {
  const unsubscrivePushNotification =
    pushNotificationModule.subscribe(onRemoteMessage);
  pushNotificationModule.setBackgroundMessageHandler(onBGMessage);

  return {unsubscrivePushNotification};
};
