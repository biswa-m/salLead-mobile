import React, {Component} from 'react';
import {connect} from 'react-redux';

import AppNavigator from '../../Navigators/AppNavigator';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import LoginModal from '../Components/LoginModal';
import {initAuth, startup} from '../../Modules/auth/startup';
import {isLoggedIn} from '../../Stores/redux/Persisted/Selectors';

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

const mapStateToProps = state => ({
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
