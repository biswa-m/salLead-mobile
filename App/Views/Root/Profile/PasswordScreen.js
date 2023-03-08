import React from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {logout} from '../../../Modules/auth/logout';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';

class PasswordScreen extends AppComponent {
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
              <Text style={styles.backText}>Password</Text>
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

          <Text style={styles.qzProfileSubtitle}>Reset Password</Text>

          <View style={styles.qzInputGroup}>
            <View style={[styles.qzInputItem, styles.qzNoBorderBottom]}>
              <Text style={styles.qzInputLabel}>Username:</Text>
              <TextInput hitSlop={{top: 20, bottom: 20, left: 20, right: 20}} placeholder={'Enter your username'} style={styles.qzInputValue}/>
            </View>
          </View>

          <TouchableOpacity style={[styles.greenSubmit, {marginHorizontal:20,marginTop:0,}]}>
            <Text style={styles.greenSubmitText}>Reset Password</Text>
          </TouchableOpacity>

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
)(PasswordScreen);
