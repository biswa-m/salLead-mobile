import React from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import navigationModule from '../../../Modules/navigationModule';
import LeadRow from '../../Components/LeadRow';
import LeadDetailsTabNavigator from './LeadDetailsTabNavigator';
import api from '../../../Services/Api/api';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import UnlockLead from './UnlockLead';
import update from 'immutability-helper';

class LeadDetailsScreen extends AppComponent {
  state = {loading: false, error: null, unlocking: false};

  componentDidMount() {
    this.onMount();
    this.load();
  }

  async load() {
    try {
      if (!this.props?.item?.leadid) {
        throw new Error('Loading Failed. Invalid lead id');
      }
      this.setAsyncState({loading: true, error: null});
      const {data: lead} = await api
        .get('/real-estate-lead-details/' + this.props.item?.leadid, {
          format: 'json',
        })
        .then(x => x.data);

      this.setAsyncState({loading: false});
      this.props.setScreenState({lead});
    } catch (e) {
      this.setAsyncState({error: e.message, loading: false});
      Alert.alert('Error', e.message);
    }
  }

  
 
  async unlock() {
    try {
      if (!this.props?.item?.leadid) {
        throw new Error('Loading Failed. Invalid lead id');
      }
      this.setAsyncState({unlocking: true, error: null});

      const {data: lead} = await api
        .get('/real-estate-lead-details/' + this.props.item?.leadid, {
          format: 'json',
        })
        .then(x => x.data);

      if (!lead) throw new Error('Loading Failed. Lead not found');
      this.props.setScreenState({lead});

      if (lead.currentUserOwnsLead) {
        throw new Error('You have already unlocked the lead');
      }

      if (lead?.shareBoxes.sharesLeft === 0) {
        throw new Error(
          'Sorry! This lead has already been claimed, and is no longer available.',
        );
      }

      const unlockData = await api
        .get('/leads/buy', {
          lead: this.props.item?.leadid,
          sharesRequested: 4,
          format: 'json',
        })
        .then(x => x.data);

      await this.setAsyncState({unlocking: false, unlockData});
      console.info({unlockData: JSON.stringify(unlockData, null, 4)});

      this.load();

      if (!['purchasecomplete'].includes(unlockData?.data?.claimStatus)) {
        if (unlockData?.data?.alertText)
          throw new Error(unlockData?.data?.alertText?.toString());
      } else {
        Alert.alert('Success', 'Lead Unlocked');
      }
    } catch (e) {
      this.setAsyncState({error: e.message, unlocking: false});
      Alert.alert('Error', e.message);
    }
  }

  onNoteUpdate(data) {
    this.load();
    const items = this.props.myLeadsLeadData?.rows;

    // if (items?.[this.props.index]?.leadid != this.props.item?.leadid) return

    const listIndex = this.props.index;
    const item = this.props.item;

    const itemFromMyLeads = items?.[listIndex];

    if (itemFromMyLeads?.leadid != item.leadid) {
      // both have differnt leadid so return
      return;
    }

    const updatedItem = {
      ...this.props.item,
      ...data,
    };

    const updatedLeadData = update(this.props.myLeadsLeadData, {
      rows: {$merge: {[this.props.index]: updatedItem}},
    });

    this.props.setScreenState(
      {leadData: updatedLeadData},
      false,
      'MY_LEADS_SCREEN',
    );

    console.log('Dummy function called');
  }

  render() {
    const {
      props: {item, index, lead},
      state: {loading, unlocking},
    } = this;

    return (
      <View style={styles.fill}>
        <View style={styles.bgGreenOnly}>
          <SafeAreaView
            edges={['top', 'left']}
            style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
                style={styles.backUnit}
                onPress={() => navigationModule.exec('goBack', [null])}>
                <Image
                  source={require('../../../Assets/img/local/back.png')}
                  style={styles.backIco}
                />
                <Text style={styles.backText}>Details</Text>
              </TouchableOpacity>
           
                <UnlockLead />
            </View>
          </SafeAreaView>
          <LeadRow
            {...{item, index, lead, onNoteUpdate: this.onNoteUpdate.bind(this)}}
            detail
          />
        </View>

        {loading && !lead ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.bgGreen}>
            <LeadDetailsTabNavigator />
          </View>
        )}
      </View>
    );
  }
}

const SCREEN_NAME = 'LEAD_DETAILS_SCREEN';
const mapStateToProps = state => ({
  item: state.vState[SCREEN_NAME]?.item,
  index: state.vState[SCREEN_NAME]?.index,
  lead: state.vState[SCREEN_NAME]?.lead,
  isLoggedIn: isLoggedIn(state),

  myLeadsLeadData: state.vState.MY_LEADS_SCREEN?.leadData,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetailsScreen);
