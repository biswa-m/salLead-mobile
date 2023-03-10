import React from 'react';
import {
  SliderComponent,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import uuid from "react-native-uuid";
import _ from "lodash";

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
import validationModule from '../../Modules/etc/validationModule';
import authModule from '../../Modules/auth/auth';

class LoginModal extends AppComponent {
  initialState = {
    loading: null,
    error: null,
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    visibleScreen: 'login',
    success: '',
    currentScreen: 'login',
  };

  state = this.initialState;

  async handleLogin() {
    try {
      let {email, password} = this.state;
      email = email.toLowerCase();

      if (!validationModule.validateEmail(email)) {
        throw new Error('Please enter a correct email');
      }

      this.setAsyncState({loading: true, error: null});

      const existingUser = (
        await api.request({
          uri: '/v1/data/get',
          method: 'POST',
          body: {
            filter: {where: {type: 'user', 'data.email': email}, limit: 1},
          },
        })
      ).items?.map(x => ({...(x.data || {}), _id: x._id}))?.[0];

      if (!existingUser) {
        throw new Error("Your email doesn't exist.");
      }

      if (password && existingUser.password !== password) {
        throw new Error('Your password is incorrect.');
      }

      await authModule.login(existingUser);
      this.setAsyncState({...this.initialState});

      setTimeout(() => {
        initAuth();
      }, 100);
    } catch (e) {
      console.log(e);
      this.setAsyncState({
        loading: false,
        error: e.message,
      });
    }
  }

  async handleSignup() {
    try {
      let {name: fullName, email, password, confirmPassword} = this.state;

      email = email.toLowerCase();

      if (!validationModule.validateEmail(email)) {
        throw new Error('Please enter a correct email');
      }

      if (password !== confirmPassword) {
        throw new Error('Confirm password does not match');
      }

      this.setAsyncState({loading: true, error: null});

      const existingUser = (
        await api.request({
          uri: '/v1/data/get',
          method: 'POST',
          body: {
            filter: {where: {type: 'user', 'data.email': email}, limit: 1},
          },
        })
      ).items?.map(x => ({...(x.data || {}), _id: x._id}))?.[0];

      if (existingUser) {
        throw new Error('Your email already exists.');
      }

      let user = {
        id: uuid.v4(),
        fullName,
        email,
        password,
      };

      const apiresult = await api
        .request({
          uri: '/v1/data',
          method: 'POST',
          body: {
            type: 'user',
            data: user,
          },
        })
        .then(x => x.item);

      user = {
        ...apiresult.data,
        _id: apiresult._id,
      };

      await authModule.login(user);

      await this.setAsyncState({...this.initialState});

      setTimeout(() => {
        initAuth();
      }, 100);
    } catch (e) {
      this.setAsyncState({
        loading: false,
        error: e.message,
      });
    }
  }

  closeModal() {
    this.setAsyncState({...this.initialState});
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
        <View style={[styles.modalWrapper]}>
          <View style={styles.modalHeader}>
            <Text style={{fontSize: 25, color: 'green'}}>𝕊𝕒𝕝𝕃𝕖𝕒𝕕</Text>
            <TouchableOpacity
              onPress={this.closeModal.bind(this)}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Image
                source={require('../../Assets/img/local/modalClose.png')}
                style={styles.qzModalClose}
              />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            style={{flex: 1, justifyContent: 'center'}}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled>
            {this.renderFooter()}
            {this.inner()}
          </KeyboardAvoidingView>
        </View>
      </AppModal>
    );
  }

  renderFooter() {
    return (
      <View
        style={[styles.modalFooterWrapper, {position: 'absolute', bottom: 0}]}>
        <Text style={styles.modalQzVersion}>SalLead v.1.0.1</Text>
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
    );
  }

  renderLogin() {
    const {
      state: {email, password, loading, error},
    } = this;

    const disableSubmit = loading || !email || !password;
    return (
      <React.Fragment>
        <View style={styles.modalForm} key="login">
          <View style={styles.modalFormMeta}>
            <Text style={styles.modalFormSubline}>Hey there,</Text>
            <Text style={styles.modalFormTitle}>Login</Text>
          </View>
          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Login</Text>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={x => this.setState({email: x})}
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
            onPress={() => this.setState({visibleScreen: 'signup'})}
            disabled={loading}
            style={styles.fgPassWrapper}>
            <Text style={styles.fgPassText}>Do not have account ? Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleLogin.bind(this)}
            disabled={disableSubmit}
            style={[styles.greenSubmit, disableSubmit && {opacity: 0.4}]}>
            <Text style={styles.greenSubmitText}>
              {loading ? 'Loading' : 'Log In'}
            </Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }

  renderSingup() {
    const {
      state: {email, password, confirmPassword, name, loading, error},
    } = this;

    const disableSubmit =
      loading || !email || !password || !name || !confirmPassword;
    return (
      <React.Fragment>
        <View style={styles.modalForm} key="signup">
          <View style={styles.modalFormMeta}>
            <Text style={styles.modalFormSubline}>Hey there,</Text>
            <Text style={styles.modalFormTitle}>Sign Up</Text>
          </View>
          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Full Name</Text>
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={x => this.setState({name: x})}
              autoCapitalize="none"
              style={styles.modalInput}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            />
          </View>

          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Email</Text>
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={x => this.setState({email: x})}
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

          <View style={styles.modalInputItem}>
            <Text style={styles.modalInputLabel}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={x => this.setState({confirmPassword: x})}
              secureTextEntry
              autoCapitalize="none"
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            />
          </View>

          {error ? <Text style={{color: 'red'}}>{error}</Text> : null}

          <TouchableOpacity
            onPress={() => this.setState({visibleScreen: 'login'})}
            disabled={loading}
            style={styles.fgPassWrapper}>
            <Text style={styles.fgPassText}>Have an account ? Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={this.handleSignup.bind(this)}
            disabled={disableSubmit}
            style={[styles.greenSubmit, disableSubmit && {opacity: 0.4}]}>
            <Text style={styles.greenSubmitText}>
              {loading ? 'Loading' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </React.Fragment>
    );
  }

  inner() {
    if (this.props.isLoggedIn) return null;
    else if (this.state.visibleScreen === 'signup') return this.renderSingup();
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
