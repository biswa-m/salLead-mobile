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
      const url =
        this.props.searchType === 'legacy'
          ? '/legacy-leads'
          : '/real-estate-lead';

      const {data} = await api.get(url, {
        page: 1,
        format: 'json',
        location:
          this.props.lastSearchDetails?.location ||
          config.initialLocation?.locationid,
      });

      this.setAsyncState({loading: false});
      this.props.setScreenState(
        {['leadData_' + this.props.searchType]: data?.data},
        true,
      );
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
        <LeadRow {...props} descriptionTextLim={90}/>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <>
        {this.props['leadData_' + this.props.searchType]?.leads?.map(
          (item, index) => this.renderItem({item, index}),
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
