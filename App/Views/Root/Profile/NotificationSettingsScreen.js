import React from 'react';
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';

class NotificationSettingsScreen extends AppComponent {
  render() {
    // if (!this.props.isLoggedIn) {
    //   navigationModule.exec('goBack', [null]);
    // }
    const {user} = this.props.AUTH || {};
    return (
      <View style={[styles.fill, styles.bgLight]}>
        <View style={styles.qzHeaderMinimal}>
          <SafeAreaView edges={['top']}>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.backUnit}
              onPress={() => navigationModule.exec('goBack', [null])}>
              <Image
                source={require('../../../Assets/img/local/back.png')}
                style={styles.backIco}
              />
              <Text style={styles.backText}>Notifications</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.qzHeaderSpaceLight}>
          <View style={styles.qzProfileAvatar}>
            <Image
              source={
                user?.photo
                  ? {uri: user?.photo}
                  : require('../../../Assets/img/profile/avatar.png')
              }
              style={styles.qzProfileAvatarIco}
            />
          </View>
          <View style={styles.qzProfileAvatarContext}>
            <Text style={styles.qzProfileAvatarTitleDark}>
              {user?.fullName}
            </Text>
            <Text style={styles.qzProfileAvatarSublineDark}>
              {user?.email}
            </Text>
          </View>
        </View>

        <View style={{height: 10, width: '100%'}}></View>

        <ScrollView style={styles.fill}>
          <Text style={styles.qzProfileSubtitle}>Notification Settings</Text>

          <View style={styles.qzInputGroup}>
            <View
              style={[
                styles.qzInputItem,
                styles.qzNoBorderBottom,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}>
              <Text style={[styles.qzInputLabel]}>Push Notification</Text>
              <Switch
                value={!!this.props.enablePushNotification}
                onValueChange={value =>
                  this.props.setScreenState(
                    {
                      enablePushNotification:
                        !this.props.enablePushNotification,
                    },
                    true,
                  )
                }
              />
            </View>
          </View>

          <Text
            style={[
              styles.qzProfileSubtitle,
              {paddingTop: 0, fontWeight: '400'},
            ]}>
            Manage all notification options and areas in your SalLead web
            dashboard.
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const SCREEN_NAME = 'NOTIFICATION_SETTINGS_SCREEN';
const mapStateToProps = state => ({
  enablePushNotification: state.pState[SCREEN_NAME]?.enablePushNotification,
  isLoggedIn: isLoggedIn(state),
  AUTH: state.pState.AUTH,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationSettingsScreen);
