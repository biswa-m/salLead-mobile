import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';

class UserLimitsScreen extends AppComponent {
  render() {
    if (!this.props.isLoggedIn) {
      navigationModule.exec('goBack', [null]);
    }

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
              <Text style={styles.backText}>User Limits Remaining</Text>
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
            <Text style={styles.qzProfileAvatarSublineDark}>{user?.email}</Text>
          </View>
        </View>

        <View style={{height: 10, width: '100%'}}></View>

        <ScrollView style={styles.fill}>
          <Text style={styles.qzProfileSubtitle}>Credit Balance</Text>

          <View style={styles.qzInputGroup}>
            <View style={styles.qzInputItem}>
              <Text style={styles.qzInputLabel}>Legacy</Text>
              <Text style={styles.qzInputValue}>
                {user?.claimStats?.legacy_claims_available || '0'}
              </Text>
            </View>
            <View style={[styles.qzInputItem, styles.qzNoBorderBottom]}>
              <Text style={styles.qzInputLabel}>Credits</Text>
              <Text style={styles.qzInputValue}>
                {user?.claimStats?.claims_available || '0'}
              </Text>
            </View>
          </View>

          {/* <Text> {JSON.stringify(this.props.AUTH, null, 4)}</Text> */}
        </ScrollView>
      </View>
    );
  }
}

const SCREEN_NAME = 'USERLIMITS_SCREEN';
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

export default connect(mapStateToProps, mapDispatchToProps)(UserLimitsScreen);
