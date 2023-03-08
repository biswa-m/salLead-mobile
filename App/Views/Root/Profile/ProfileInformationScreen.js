import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {logout} from '../../../Modules/auth/logout';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';

class ProfileInformationScreen extends AppComponent {
  render() {
    if (!this.props.isLoggedIn) {
      navigationModule.exec('goBack', [null]);
    }

    const {user, account} = this.props.AUTH || {};

    return (
      <View style={[styles.fill, styles.bgLight]}>
        <View style={styles.qzHeaderMinimal}>
          <SafeAreaView edges={['top']}>
            <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.backUnit}
              onPress={() => navigationModule.exec('goBack', [null])}>
              <Image
                source={require('../../../Assets/img/local/back.png')}
                style={styles.backIco}
              />
              <Text style={styles.backText}>Personal Information</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.qzHeaderSpaceLight}>
          <View style={styles.qzProfileAvatar}>
            <Image source={{uri: account?.profileImageLargeUrl}} style={styles.qzProfileAvatarIco}/>
          </View>
          <View style={styles.qzProfileAvatarContext}>
            <Text style={styles.qzProfileAvatarTitleDark}>{user?.userName}</Text>
            <Text style={styles.qzProfileAvatarSublineDark}>{account?.email}</Text>
          </View>
        </View>

        <View style={{height:10,width:'100%'}}></View>

        <ScrollView style={styles.fill}>

          <Text style={styles.qzProfileSubtitle}>Personal Details</Text>

          <View style={styles.qzInputGroup}>
            <View style={styles.qzInputItem}>
              <Text style={styles.qzInputLabel}>Username:</Text>
              <Text style={styles.qzInputValue}>{user?.userName || 'Blank'}</Text>
            </View>
            <View style={styles.qzInputItem}>
              <Text style={styles.qzInputLabel}>First Name:</Text>
              <Text style={styles.qzInputValue}>{account?.firstName || 'Blank'}</Text>
            </View>
            <View style={[styles.qzInputItem, styles.qzNoBorderBottom]}>
              <Text style={styles.qzInputLabel}>Last Name:</Text>
              <Text style={styles.qzInputValue}>{account?.lastName || 'Blank'}</Text>
            </View>
          </View>

          <Text style={styles.qzProfileSubtitle}>More Information</Text>

          <View style={styles.qzInputGroup}>
            <View style={styles.qzInputItem}>
              <Text style={styles.qzInputLabel}>Email:</Text>
              <Text style={styles.qzInputValue}>{account?.email}</Text>
            </View>
            <View style={[styles.qzInputItem, styles.qzNoBorderBottom]}>
              <Text style={styles.qzInputLabel}>Phone Number:</Text>
              <Text style={styles.qzInputValue}>{account?.displayPhone || 'Blank'}</Text>
            </View>
          </View>
          {/* <Text> {JSON.stringify(this.props.AUTH, null, 4)}</Text> */}
        </ScrollView>     
      </View>
      
    );
  }
}

const SCREEN_NAME = 'PROFILE_INFORMATION_SCREEN';
const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
  AUTH: state.pState.AUTH,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
  fetchMyProfile: () => dispatch(PActions.fetchMyProfile()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileInformationScreen);
