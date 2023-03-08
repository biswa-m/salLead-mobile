import {Alert, Linking, Platform} from 'react-native';

export const callNumber = phone => {
  if (!/\d/.test(phone)) return;
  console.log('callNumber ----> ', phone);
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel://${phone}`;
  }
  Linking.canOpenURL(phoneNumber)
    .then(supported => {
      if (!supported) {
        // Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch(err => console.log(err));
};

export const sendEmail = ({to}) => {
  if (/.+@.+/.test(to)) {
    const url = `mailto:${to}`;

    console.log('Opening email link: ' + url);
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          // Alert.alert('Email is not available');
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.log(err));
  }
};

export function sendSMS({phone}) {
  if (!/\d/.test(phone)) return;
  let url = `sms:${phone}`;
  console.log('opening sms link: '+ url);

  Linking.canOpenURL(url)
    .then(supported => {
      if (!supported) {
        // Alert.alert('Phone number is not available');
      } else {
        return Linking.openURL(url);
      }
    })
    .catch(err => console.log(err));
}
