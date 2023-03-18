import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import update from 'immutability-helper';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import LeadRow from '../../Components/LeadRow';
import api from '../../../Services/Api/api';
import navigationModule from '../../../Modules/navigationModule';
import config from '../../../Config';

class LeadList extends AppComponent {
  state = {loading: false, reloading: false, error: null, firstTimeLoad: true};

  componentDidMount() {
    console.log(this.props);
    console.log('Props above');
    this.onMount();
    this.props.setScreenState({leadData: this.props.homeScreen_leadData_daily});
    // if (this.props.location || this.props.keyword) this.load();
    // else
    //   this.load({
    //     defaultFilter: {
    //       location:
    //         this.props.lastSearchDetails?.location ||
    //         config.initialLocation?.locationid,
    //     },
    //   });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reloadSearch != this.props.reloadSearch) {
      this.load();
    }
  }

  loadId = 0;
  async load(opt) {
    try {
      const loadId = this.loadId + 1;
      this.loadId = loadId;
      this.setAsyncState({error: null, reloading: true});
      const url =
        this.props.searchType === 'legacy'
          ? '/legacy-leads'
          : '/real-estate-lead';

      const payload = {
        ...(opt?.defaultFilter || {}),
        p: 1,
        format: 'json',
        location:
          this.props.location?.locationid || opt?.defaultFilter?.location || '',
        keywords: `${this.props.keyword || ''} ${
          this.props.location?.state && !this.props.location?.locationid
            ? this.props.location?.state
            : ''
        } ${this.props.creditHistory || ''} ${
          this.props.financing ? `financing ${this.props.financing}` : ''
        } ${this.props.buyerType || ''}`.trim(),
      };

      console.warn({payload, url, location: this.props.location});

      const {data} = await api.get(url, payload);
      this.setAsyncState({reloading: false, firstTimeLoad: false});

      // console.warn({data});

      if (loadId === this.loadId)
        this.props.setScreenState({
          leadData: data?.data,
          page: 1,
        });
      this.props.setScreenState(
        {
          lastSearchDetails: payload,
        },
        true,
      );
    } catch (error) {
      this.setAsyncState({error: error.message, reloading: false});
      Alert.alert('Error', error.message);
    }
  }

  async loadMore() {
    try {
      if (
        this.state.reloading ||
        this.state.loading ||
        !this.props.lastSearchDetails
      )
        return;
      const loadId = this.loadId + 1;
      this.loadId = loadId;

      this.setAsyncState({error: null, loading: true});
      const url =
        this.props.searchType === 'legacy'
          ? '/legacy-leads'
          : '/real-estate-lead';

      const payload = {
        ...this.props.lastSearchDetails,
        p: this.props.lastSearchDetails.p + 1,
      };

      console.info({payload, url});

      const {data} = await api.get(url, payload);
      this.setAsyncState({loading: false, firstTimeLoad: false});

      // console.warn(data);

      if (loadId === this.loadId)
        this.props.setScreenState({
          leadData: {
            ...this.props.leadData,
            ...data?.data,
            leads: [
              ...(this.props.leadData?.leads || []),
              ...(data?.data?.leads || []),
            ],
          },
          page: payload.page,
        });
      this.props.setScreenState(
        {
          lastSearchDetails: payload,
        },
        true,
      );
    } catch (error) {
      this.setAsyncState({error: error.message, loading: false});
      Alert.alert('Error', error.message);
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

  updateItem({item, index}) {
    if (this.props.leadData?.leads) {
      const updatedData = update(this.props.leadData, {
        leads: {$merge: {[index]: item}},
      });

      this.props.setScreenState({leadData: updatedData});
    }
  }

  renderItem(props) {
    return (
      <TouchableOpacity
        key={props.item?.leadid?.toString() + props.index?.toString()}
        onPress={() => this.goToLeadDetails(props)}>
        <LeadRow
          {...props}
          style={styles.browseLeadsList}
          browse
          updateItem={this.updateItem.bind(this)}
          styles={{
            relativeTime: {marginTop: -6, marginRight: -4},
            leadContext: styles.leadContextIndented,
          }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    const leads = this.props.leadData?.leads;
    return (
      <>
        {/* {this.state.firstTimeLoad && this.state.reloading ? (
          <ActivityIndicator size={'large'} />
        ) : null} */}
        <FlatList
          style={styles.fill}
          keyExtractor={(item, index) =>
            item?.leadid?.toString() + index?.toString()
          }
          data={leads || []}
          renderItem={this.renderItem.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={!!this.state.reloading}
              onRefresh={() => this.load()}
            />
          }
          onEndReached={this.loadMore.bind(this)}
          ListEmptyComponent={() => (
            <View>{/* <Text>Nothing To Show]</Text> */}</View>
          )}
          ListFooterComponent={() => {
            return this.state.loading ? (
              <ActivityIndicator size={'large'} />
            ) : null;
          }}
        />
      </>
    );
  }
}

const SCREEN_NAME = 'BROWSE_SCREEN';
const mapStateToProps = state => ({
  leadData: state.vState[SCREEN_NAME]?.leadData,
  page: state.vState[SCREEN_NAME]?.page,
  searchType: state.vState[SCREEN_NAME]?.searchType,
  location: state.vState[SCREEN_NAME]?.location,
  keyword: state.vState[SCREEN_NAME]?.keyword,
  creditHistory: state.vState[SCREEN_NAME]?.creditHistory,
  financing: state.vState[SCREEN_NAME]?.financing,
  buyerType: state.vState[SCREEN_NAME]?.buyerType,
  reloadSearch: state.vState[SCREEN_NAME]?.reloadSearch,
  locationGroup: state.vState[SCREEN_NAME]?.locationGroup,
  lastSearchDetails: state.pState[SCREEN_NAME]?.lastSearchDetails,
  homeScreen_leadData_daily: state.pState['HOME_SCREEN']?.leadData_daily,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadList);
