import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import ClaimStats from '../../Components/ClaimStats';
import SearchBar from './SearchBar';
import LeadList from './LeadList';
import {ScrollView, Text, View} from 'react-native';

class BrowseScreen extends AppComponent {
  handleSearch(q) {
    console.log(q);
  }

  render() {
    return (
      <View style={styles.bgGreen}>
        <SafeAreaView edges={['top']} style={styles.fill}>
          <SearchBar />
          <View style={styles.browseListContainer}>
            <LeadList browse />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const SCREEN_NAME = 'BROWSE_SCREEN';
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrowseScreen);
