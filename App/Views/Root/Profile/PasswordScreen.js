import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';

class PasswordScreen extends AppComponent {
  state = {
    password: '',
    confirmPassword: '',
    currentPassword: '',
    error: null,
    loading: false,
  };

  handleReset() {
    try {
      const {
        state: {password, confirmPassword, currentPassword},
        props: user,
      } = this;
    } catch (e) {
      this.setAsyncState({
        loading: false,
        error: null,
      });
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      navigationModule.exec('goBack', [null]);
    }

    const {user} = this.props.AUTH || {};

    const disabled =
      !this.state.password ||
      !this.state.confirmPassword ||
      !this.state.currentPassword;

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
              <Text style={styles.backText}>Password</Text>
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
          <Text style={styles.qzProfileSubtitle}>Reset Password</Text>

          <View style={styles.qzInputGroup}>
            <View style={[styles.qzInputItem]}>
              <Text style={styles.qzInputLabel}>New Password:</Text>
              <TextInput
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                placeholder={'New Password'}
                style={styles.qzInputValue}
                secureTextEntry
                value={this.state.password}
                onChangeText={x => this.setState({password: x})}
              />
            </View>
            <View style={[styles.qzInputItem]}>
              <Text style={styles.qzInputLabel}>Confirm New Password:</Text>
              <TextInput
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                placeholder={'Confirm New Password'}
                style={styles.qzInputValue}
                secureTextEntry
                value={this.state.confirmPassword}
                onChangeText={x => this.setState({confirmPassword: x})}
              />
            </View>
            <View style={[styles.qzInputItem, styles.qzNoBorderBottom]}>
              <Text style={styles.qzInputLabel}>Current Password:</Text>
              <TextInput
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                placeholder={'Current Password'}
                style={styles.qzInputValue}
                secureTextEntry
                value={this.state.currentPassword}
                onChangeText={x => this.setState({currentPassword: x})}
              />
            </View>
          </View>

          {this.state.error ? (
            <Text style={{textAlign: 'center', color: 'red'}}>
              {this.state.error}
            </Text>
          ) : null}

          <TouchableOpacity
            disabled={disabled}
            style={[
              styles.greenSubmit,
              {marginHorizontal: 20, marginTop: 0},
              disabled ? {opacity: 0.5} : null,
            ]}
            onPress={() => this.handleReset()}>
            <Text style={styles.greenSubmitText}>
              {this.state.loading ? 'Loading' : 'Reset Password'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const SCREEN_NAME = 'PROFILE_INFORMATION_SCREEN';
const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
  user: state.pState.AUTH?.user,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordScreen);
