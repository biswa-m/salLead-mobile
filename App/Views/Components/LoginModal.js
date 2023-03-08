import React from 'react';
import {
  SliderComponent,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {connect} from 'react-redux';

import AppComponent from '../../Components/RN/AppComponent';
import styles from '../../Styles/styles';
import PActions from '../../Stores/redux/Persisted/Actions';
import UnpActions from '../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../Stores/redux/Persisted/Selectors';
import AppModal from '../../Components/Models/AppModal';
import api from '../../Services/Api/api';
import sleep from '../../Modules/etc/sleep';
import {initAuth} from '../../Modules/auth/startup';
import AsyncStorage from '@react-native-community/async-storage';

class LoginModal extends AppComponent {
  state = {
    loading: null,
    error: null,
    username: '',
    password: '',
    visibleScreen: 'login',
    success: '',
  };

  async handleLogin() {
    try {
      this.setAsyncState({loading: true, error: null});
      const res = await api
        .post('login?format=json&rememberme=true', {
          username: this.state.username,
          password: this.state.password,
          rememberme: 0,
          returnTo: '/login',
          login: 'Login',
          format: 'json',
        })
        .then(x => x.data);

      console.info(res);

      if (!res.data.loginSuccess) {
        throw new Error(res.data.loginMessage || 'Login Failed');
      }
      await AsyncStorage.setItem('auth/user', res.data?.userid?.toString());
      this.props.setScreenState({user: res.data}, true, 'AUTH');

      this.setAsyncState({loading: false, error: null});

      await sleep(200);
      initAuth();
    } catch (error) {
      this.setAsyncState({error: error.message, loading: null});
    }
  }

  closeModal() {
    this.props.setScreenState({isVisible: false});
  }

  modal() {
    const {
      props: {isVisible, isLoggedIn},
    } = this;
    return (
      <AppModal
        isVisible={!!isVisible && !isLoggedIn}
        close={this.closeModal.bind(this)}>
        <View style={[styles.modalWrapper, styles.modalSpaceBetween]}>
          <View style={styles.modalHeader}>
            <Image source={require('../../Assets/img/local/logoGreen.png')} style={styles.qzLogoGreen}/>
            <TouchableOpacity onPress={this.closeModal.bind(this)} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image source={require('../../Assets/img/local/modalClose.png')} style={styles.qzModalClose}/>
            </TouchableOpacity>
          </View>

          {this.inner()}
        </View>
      </AppModal>
    );
  }

  renderForgotPass() {
    const {
      state: {username, loading, error, success},
    } = this;

    const disableSubmit = loading || !username;

    return (
      <React.Fragment>
        <View style={styles.modalForm}>
          <View style={styles.modalFormMeta}>
            <Text style={styles.modalFormSubline}>Forgot Password?</Text>
            <Text style={styles.modalFormTitle}>Enter your username</Text>
          </View>

          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Username</Text>
            <TextInput
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              placeholder="Username"
              value={username}
              onChangeText={x => this.setState({username: x})}
              autoCapitalize="none"
              style={styles.modalInput}
            />
          </View>
          {error ? <Text style={{color: 'red'}}>{error}</Text> : null}
          {success ? <Text style={{color: 'green'}}>{success}</Text> : null}

          <TouchableOpacity
            onPress={() => this.setState({visibleScreen: 'login'})}
            disabled={loading}
            style={styles.fgPassWrapper}>
            <Text style={styles.fgPassText}>
              Remember Password? Continue to login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={disableSubmit}
            style={[disableSubmit ? styles.greenSubmit : styles.greenSubmit]}>
            <Text style={styles.greenSubmitText}>
              {loading ? 'Loading' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalFooterWrapper}>
          <Text style={styles.modalQzVersion}>Qazzoo v.1.0.1</Text>
          <View style={styles.qzModalBanner}>
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
          </View>
        </View>
      </React.Fragment>
    );
  }

  renderLogin() {
    const {
      state: {username, password, loading, error},
    } = this;

    const disableSubmit = loading || !username || !password;
    return (
      <React.Fragment>
        <View style={styles.modalForm}>
          <View style={styles.modalFormMeta}>
            <Text style={styles.modalFormSubline}>Hey there,</Text>
            <Text style={styles.modalFormTitle}>Login</Text>
          </View>
          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Login</Text>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={x => this.setState({username: x})}
              autoCapitalize="none"
              style={styles.modalInput}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            />
          </View>

          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Password</Text>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={x => this.setState({password: x})}
              secureTextEntry
              autoCapitalize="none"
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            />
          </View>
          {error ? <Text style={{color: 'red'}}>{error}</Text> : null}

          <TouchableOpacity
            onPress={() => this.setState({visibleScreen: 'forgotPass'})}
            disabled={loading}
            style={styles.fgPassWrapper}>
            <Text style={styles.fgPassText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleLogin.bind(this)}
            disabled={disableSubmit}
            style={[disableSubmit ? styles.greenSubmit : styles.greenSubmit]}>
            <Text style={styles.greenSubmitText}>
              {loading ? 'Loading' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.modalFooterWrapper}>
          <Text style={styles.modalQzVersion}>Qazzoo v.1.0.1</Text>
          <View style={styles.qzModalBanner}>
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
            <Image
              source={require('../../Assets/img/local/banner.png')}
              style={styles.qzBannerIco}
            />
          </View>
        </View>
      </React.Fragment>
    );
  }

  inner() {
    if (this.props.isLoggedIn) return null;
    else if (this.state.visibleScreen === 'forgotPass')
      return this.renderForgotPass();
    else return this.renderLogin();
  }

  render() {
    if (this.props.renderInner) return this.inner();
    else return this.modal();
  }
}

const SCREEN_NAME = 'LOGIN_SCREEN';
const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
  isVisible: state.vState[SCREEN_NAME].isVisible,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
