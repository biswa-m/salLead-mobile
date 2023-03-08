import messaging from '@react-native-firebase/messaging';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.info('Authorization status:', authStatus);
  }
}

const pushNotificationModule = {
  init: async ({onChangeToken = console.log}) => {
    try {
      await requestUserPermission();
      await messaging().getToken().then(onChangeToken);

      messaging().onTokenRefresh(onChangeToken);
    } catch (e) {
      console.warn('Error init firebase', e);
    }
  },

  subscribe: callback => {
    const unsubscribe = messaging().onMessage(callback);
    return unsubscribe;
  },

  setBackgroundMessageHandler: callback => {
    messaging().setBackgroundMessageHandler(callback);
  },
};

export default pushNotificationModule;
