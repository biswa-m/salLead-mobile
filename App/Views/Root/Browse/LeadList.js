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
import apiModule from '../../../Modules/api/apiModule';

class LeadList extends AppComponent {
  state = {loading: false, reloading: false, error: null, firstTimeLoad: true};

  componentDidMount() {
    this.onMount();
    this.load().then(() => this.load({fromRemote: true}));
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
    if (
      prevProps.reloadSearch != this.props.reloadSearch ||
      prevProps.leads?.length != this.props.leads?.length
    ) {
      setTimeout(() => {
        this.load();
      }, 50);
    }
  }

  loadId = 0;
  async load(opt) {
    try {
      const loadId = this.loadId + 1;
      this.loadId = loadId;
      await this.setAsyncState({error: null, reloading: true});

      const {
        searchType,
        leads: leadProps,
        location,
        keyword,
        creditHistory,
        financing,
        buyerType,
      } = this.props;
      const lastSearchDetails = {
        searchType,
        location,
        keyword,
        creditHistory,
        financing,
        buyerType,
      };
      let count = 0;

      let leads = leadProps;
      if (opt?.fromRemote) {
        leads = await apiModule.loadLeads();
        this.props.setScreenState({leads}, true, 'APP_DATA');
      }

      const keywordRegex = keyword && new RegExp(`.*${keyword}.*`, 'i');
      const financingFilter = financing
        ? financing.split(',').map(x => parseFloat(x))
        : [];

      const result = leads?.filter(x => {
        return (
          (searchType === 'legacy' ? x.isLegacy : !x.isLegacy) &&
          (location
            ? ((!location.city || x.city == location.city) &&
                x.state == location.state) ||
              ((!location.city || x.lookingAtCity == location.city) &&
                x.lookingAtState == location.state)
            : 1) &&
          (keyword
            ? keywordRegex.test(x.name) ||
              keywordRegex.test(x.city) ||
              keywordRegex.test(x.state)
            : 1) &&
          (creditHistory ? x.creditHistory == creditHistory : 1) &&
          (financing
            ? (financingFilter[0] || 0) <= parseFloat(x.financing) &&
              (financingFilter[1] || Infinity) > parseFloat(x.financing)
            : 1) &&
          (buyerType ? x.consumerType == buyerType : 1) &&
          count++
        );
      });

      await this.setAsyncState({reloading: false, firstTimeLoad: false});

      if (loadId === this.loadId)
        this.props.setScreenState({
          leadData: {leads: result},
          page: 1,
        });
      this.props.setScreenState(
        {
          lastSearchDetails,
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
      return;
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
              onRefresh={() => this.load({fromRemote: true})}
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
          initialNumToRender={20}
          maxToRenderPerBatch={10}
        />
      </>
    );
  }
}

const SCREEN_NAME = 'BROWSE_SCREEN';
const mapStateToProps = state => ({
  leads: state.pState['APP_DATA']?.leads,
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
