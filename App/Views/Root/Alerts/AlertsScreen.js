import React from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import AsyncStorage from '@react-native-community/async-storage';
import navigationModule from '../../../Modules/navigationModule';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';

class AlertsScreen extends AppComponent {
  componentDidMount() {
    this.onMount();
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn != this.props.isLoggedIn) {
      this.load();
    }
  }

  defaultNotif = {
    notification: {
      title: 'Hello Qazzoo',
      body: 'Welcome to Qazzoo. On this screen you can view alerts for your account!',
    },
  };

  async load() {
    await this.setAsyncState({refreshing: true});
    try {
      const userid = this.props.user?.userid;
      if (!userid) {
        this.setAsyncState({notifications: [this.defaultNotif]});
      } else {
        const allNotificationsStr = await AsyncStorage.getItem(
          'app_notifications',
        );
        const allNotifications = allNotificationsStr
          ? JSON.parse(allNotificationsStr)
          : {};

        const notifications = allNotifications?.[userid?.toString()] || [];
        await this.setAsyncState({
          notifications: [...notifications, this.defaultNotif],
        });
      }
    } catch (e) {
      console.warn(e);
      Alert.alert('Error', e.message);
    }
    await this.setAsyncState({refreshing: false});
  }

  renderItem = ({item}) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item?.notification?.title}</Text>
      <Text style={styles.notificationBody}>{item?.notification?.body}</Text>
    </View>
  );

  render() {
    const {user, account} = this.props.AUTH || {};
    return (
      <View style={styles.bgFill}>
        <View style={[styles.qzHeader, styles.qzHeaderCurved]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.qzHeaderTop}>
              {/* <View style={[styles.qzHeaderButtonSmall, {opacity:0,}]}>
                <TouchableOpacity style={styles.qzHeaderButtonSmall}>
                  <Image source={require('../../../Assets/img/local/alert.png')} style={styles.qzHeaderButtonSmallIco}/>
                </TouchableOpacity>
              </View> */}
              <Text style={[styles.screenTitle]}>Alerts</Text>
              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigationModule.exec('navigate', ['/main/profile'])
                  }
                  style={styles.qzHeaderButtonSmall}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  {
                    account?.profileImageLargeUrl ? 
                    <Image source={{uri: account?.profileImageLargeUrl}} style={styles.qzHeaderAvatarIco}/>
                    :
                    <Text style={styles.qzUserLoggedText}>{user && user.userName ? user.userName.slice(0, 2).toUpperCase() : 'MY'}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.qzBanner, {opacity: 1}]}>
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={[styles.qzBannerIco, styles.qzBannerAlertsAdjust]}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={[styles.qzBannerIco, styles.qzBannerAlertsAdjust]}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={[styles.qzBannerIco, styles.qzBannerAlertsAdjust]}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={[styles.qzBannerIco, styles.qzBannerAlertsAdjust]}
              />
            </View>
            <View style={styles.qzHeaderSpaceA}></View>
          </SafeAreaView>
        </View>
        <View style={{marginTop: -40, flex: 1}}>
          <FlatList
            onRefresh={this.load.bind(this)}
            refreshing={!!this.state.refreshing}
            data={this.state.notifications || []}
            renderItem={this.renderItem.bind(this)}
          />
        </View>
      </View>
    );
  }
}

const SCREEN_NAME = 'ALERTS_SCREEN';
const mapStateToProps = state => ({
  user: state.pState.AUTH?.user,
  isLoggedIn: isLoggedIn(state),
  AUTH: state.pState.AUTH,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertsScreen);
