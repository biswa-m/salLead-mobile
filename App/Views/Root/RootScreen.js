import React, {Component} from 'react';
import {connect} from 'react-redux';

import AppNavigator from '../../Navigators/AppNavigator';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginModal from '../Components/LoginModal';
import {initAuth, startup} from '../../Modules/auth/startup';
import {isLoggedIn} from '../../Stores/redux/Persisted/Selectors';
import apiModule from '../../Modules/api/apiModule';
import PActions from '../../Stores/redux/Persisted/Actions';
import UnpActions from '../../Stores/redux/Unpersisted/Actions';

class RootScreen extends Component {
  componentDidMount() {
    startup()
      .then(
        ({unsubscrivePushNotification}) =>
          (this.unsubscrivePushNotification = unsubscrivePushNotification),
      )
      .catch(console.warn);

    if (this.props.isLoggedIn) {
      initAuth().catch(console.warn);
    }

    apiModule
      .loadLeads()
      .then(leads => this.props.setScreenState({leads}, true))
      .catch(console.warn);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn != this.props.isLoggedIn) {
      apiModule
        .loadLeads()
        .then(leads => this.props.setScreenState({leads}, true));
    }
  }

  render() {
    return (
      <SafeAreaProvider>
        <AppNavigator />
        <LoginModal />
      </SafeAreaProvider>
    );
  }
}

const SCREEN_NAME = 'APP_DATA';
const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
});
const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
