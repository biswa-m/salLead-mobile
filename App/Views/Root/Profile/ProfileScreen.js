import React from 'react';
import {ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';
import authModule from '../../../Modules/auth/auth';

class ProfileScreen extends AppComponent {
  render() {
    const {user} = this.props.AUTH || {};
    return (
      <View style={styles.bgFill}>
        <View style={[styles.qzHeader, styles.qzHeaderCurved]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.qzHeaderTop}>
              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity
                  onPress={() =>
                    navigationModule.exec('navigate', ['/main/alerts'])
                  }
                  style={styles.qzHeaderButtonSmall}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image
                    source={require('../../../Assets/img/local/alert.png')}
                    style={styles.qzHeaderButtonSmallIco}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.screenTitle}>Account</Text>
              <View style={styles.qzHeaderButtonSmall}>
                <View
                  style={styles.qzHeaderButtonSmall}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  {user?.photo ? (
                    <Image
                      source={{uri: user?.photo}}
                      style={styles.qzHeaderAvatarIco}
                    />
                  ) : (
                    <Text style={styles.qzUserLoggedText}>
                      {user && user.fullName
                        ? user.fullName.slice(0, 2).toUpperCase()
                        : 'MY'}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={[styles.qzBanner]}>
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
            </View>
            <View style={styles.qzHeaderSpaceP}>
              <View style={styles.qzProfileAvatar}>
                {user?.photo ? (
                  <Image
                    source={{uri: user?.photo}}
                    style={styles.qzProfileAvatarIco}
                  />
                ) : (
                  <Image
                    source={require('../../../Assets/img/profile/avatar.png')}
                    style={styles.qzProfileAvatarIco}
                  />
                )}
              </View>
              <View style={styles.qzProfileAvatarContext}>
                <Text style={styles.qzProfileAvatarTitle}>
                  {user?.fullName || 'Welcome to SalLead'}
                </Text>
                <Text style={styles.qzProfileAvatarSubline}>
                  {user?.email || 'You have not logged in yet.'}
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView style={styles.fill}>
          <View style={styles.profileSpacer}></View>

          <Text style={styles.qzVersion}>SalLead v.1.0.1</Text>

          {this.props.isLoggedIn ? (
            <View>
              <Text style={styles.profileSubTitle}>Personal</Text>

              <TouchableOpacity
                style={styles.profileUnit}
                disabled={!this.props.isLoggedIn}
                onPress={() =>
                  navigationModule.exec('navigate', ['/profileinformation'])
                }>
                <Image
                  source={require('../../../Assets/img/profile/personal.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>
                    Personal Information
                  </Text>
                  <Text style={styles.profileUnitSubline}>
                    View your account information
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileUnit}
                disabled={!this.props.isLoggedIn}
                onPress={() =>
                  navigationModule.exec('navigate', ['/userLimitsSettings'])
                }>
                <Image
                  source={require('../../../Assets/img/profile/userLimits.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>
                    User Limits Remaining
                  </Text>
                  <Text style={styles.profileUnitSubline}>
                    View your remaining SalLead credits
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>

              <Text style={styles.profileSubTitle}>Notifications</Text>

              <TouchableOpacity
                style={styles.profileUnit}
                disabled={!this.props.isLoggedIn}
                onPress={() =>
                  navigationModule.exec('navigate', ['/notificationSettings'])
                }>
                <Image
                  source={require('../../../Assets/img/profile/notifications.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>Notifications</Text>
                  <Text style={styles.profileUnitSubline}>
                    Manage push notification settings
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>

              <Text style={styles.profileSubTitle}>Security</Text>

              <TouchableOpacity
                style={styles.profileUnit}
                disabled={!this.props.isLoggedIn}
                onPress={() =>
                  navigationModule.exec('navigate', ['/passwordSettings'])
                }>
                <Image
                  source={require('../../../Assets/img/profile/password.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>Password</Text>
                  <Text style={styles.profileUnitSubline}>
                    Manage your account password
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileUnit}
                disabled={!this.props.isLoggedIn}
                onPress={authModule.confirmAndLogout}>
                <Image
                  source={require('../../../Assets/img/profile/signOut.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>Logout</Text>
                  <Text style={styles.profileUnitSubline}>
                    Signout from your SalLead account
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.profileSubTitle}>Account</Text>
              <TouchableOpacity
                style={styles.profileUnit}
                onPress={() =>
                  this.props.setScreenState(
                    {isVisible: true},
                    false,
                    'LOGIN_SCREEN',
                  )
                }>
                <Image
                  source={require('../../../Assets/img/profile/personal.png')}
                  style={styles.profileIco}
                />
                <View style={styles.profileContext}>
                  <Text style={styles.profileUnitTitle}>Sign In</Text>
                  <Text style={styles.profileUnitSubline}>
                    Login to view your profile information
                  </Text>
                </View>
                <Image
                  source={require('../../../Assets/img/profile/chevron.png')}
                  style={styles.profileChev}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const SCREEN_NAME = 'PROFILE_SCREEN';
const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
  AUTH: state.pState.AUTH,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
