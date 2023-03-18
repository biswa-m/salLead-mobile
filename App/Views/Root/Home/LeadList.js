import React from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import SearchInput from '../../../Components/Input/SearchInput';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import LeadRow from '../../Components/LeadRow';
import api from '../../../Services/Api/api';
import navigationModule from '../../../Modules/navigationModule';
import config from '../../../Config';

class LeadList extends AppComponent {
  componentDidMount() {
    this.onMount();
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps?.focused != this.props.focused) {
      if (!this.state.loading) this.load();
    }
  }

  async load() {
    try {
      this.setAsyncState({error: null, loading: true});
      const {searchType, leads} = this.props;

      let count = 0;
      const searchResult = leads?.filter(
        x =>
          count < 10 &&
          (searchType === 'legacy' ? x.isLegacy : !x.isLegacy) &&
          count++,
      );

      this.setAsyncState({loading: false, searchResult});
    } catch (error) {
      this.setAsyncState({error: error.message});
    }
  }

  goToLeadDetails(props) {
    this.props.setScreenState(
      {...props, lead: null},
      false,
      'LEAD_DETAILS_SCREEN',
    );
    navigationModule.exec('navigate', ['/leadDetails']);
  }

  renderItem(props) {
    return (
      <TouchableOpacity
        key={props.item?.leadid?.toString() + props.index?.toString()}
        onPress={() => this.goToLeadDetails(props)}
        style={styles.homeLeadsList}>
        <LeadRow
          {...props}
          styles={{
            relativeTime: {marginTop: -6, marginRight: -4},
          }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <>
        {this.state.searchResult?.map((item, index) =>
          this.renderItem({item, index}),
        )}
        {/* <FlatList
          style={styles.fill}
          keyExtractor={item => item?.leadid}
          data={this.props.leadData?.leads || []}
          renderItem={this.renderItem.bind(this)}
        /> */}
      </>
    );
  }
}

const SCREEN_NAME = 'HOME_SCREEN';
const mapStateToProps = state => ({
  leads: state.pState['APP_DATA']?.leads,
  leadData_daily: state.pState[SCREEN_NAME]?.leadData_daily,
  leadData_legacy: state.pState[SCREEN_NAME]?.leadData_legacy,
  // searchType: state.vState[SCREEN_NAME]?.searchType,
  focused: state.vState[SCREEN_NAME]?.focused,
  lastSearchDetails: state.pState['BROWSE_SCREEN']?.lastSearchDetails,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadList);
