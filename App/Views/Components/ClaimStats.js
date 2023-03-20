import React from 'react';
import {Text, TouchableWithoutFeedback, View, Image} from 'react-native';
import {connect} from 'react-redux';

import AppComponent from '../../Components/RN/AppComponent';
import styles from '../../Styles/styles';
import PActions from '../../Stores/redux/Persisted/Actions';
import UnpActions from '../../Stores/redux/Unpersisted/Actions';
import {isLoggedIn} from '../../Stores/redux/Persisted/Selectors';

class ClaimStats extends AppComponent {
  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          !this.props.isLoggedIn &&
          this.props.setScreenState({isVisible: true}, false, 'LOGIN_SCREEN')
        }>
        <View style={styles.creditBox}>
          <View style={styles.creditItem}>
            <View>
              <Text style={styles.legacyCount}>
                {this.props.user?.credit?.legacy || 0}
              </Text>
              <Text style={styles.creditLabel}>Legacy</Text>
            </View>
            <Image
              source={require('../../Assets/img/local/legacy.png')}
              style={styles.qzCreditIco}
            />
          </View>

          <View style={styles.creditSeperator}></View>

          <View style={styles.creditItem}>
            <View>
              <Text style={styles.creditCount}>
                {this.props.user?.credit?.credit || 0}
              </Text>
              <Text style={styles.creditLabel}>Credits</Text>
            </View>
            <Image
              source={require('../../Assets/img/local/credits.png')}
              style={styles.qzCreditIco}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const SCREEN_NAME = 'APP_DATA';
const mapStateToProps = state => ({
  user: state.pState['AUTH']?.user,
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClaimStats);
