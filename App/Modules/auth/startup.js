import AsyncStorage from '@react-native-community/async-storage';
import PersistedActions from 'App/Stores/redux/Persisted/Actions';
import UnpersistedActions from 'App/Stores/redux/Unpersisted/Actions';
import {Alert, Platform} from 'react-native';
import api from '../../Services/Api/api';
import {store} from '../../store';
import pushNotificationModule from '../pushNotification/push-notification-module';

const onChangeToken = token => {
  console.info('firebase token: ', token);
  api.get('account/index/appcel-id-submit', {
    appcelid: `FCM_${Platform.OS}_ENABLE:${token}`,
    format: 'json',
  });
  // api
  //   .put(
  //     'v1/user/fcm',
  //     {token, platform: Platform.OS},
  //     {
  //       noRedirect: true,
  //     },
  //   )
  //   .catch((e) => console.warn('error syncing firebase token: ', e));
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

  const userid = (await AsyncStorage.getItem('auth/user')) || 'unknown';
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

export const initAuth = async () => {
  let state = store?.getState();

  if (store) {
    store.dispatch(PersistedActions.fetchMyProfile());
  }

  pushNotificationModule.init({onChangeToken});
};

export const startup = async () => {
  const unsubscrivePushNotification =
    pushNotificationModule.subscribe(onRemoteMessage);
  pushNotificationModule.setBackgroundMessageHandler(onBGMessage);

  return {unsubscrivePushNotification};
};
