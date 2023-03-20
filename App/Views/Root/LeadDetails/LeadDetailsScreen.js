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
import update from 'immutability-helper';

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
import apiModule from '../../../Modules/api/apiModule';

class LeadDetailsScreen extends AppComponent {
  state = {loading: false, error: null, unlocking: false};

  componentDidMount() {
    this.onMount();
    this.load();
  }

  async getLead(id) {
    return apiModule
      .loadLeads({
        where: {['data.id']: id},
      })
      .then(x => x?.[0]);
  }

  async load() {
    try {
      if (!this.props?.item?.id) {
        throw new Error('Loading Failed. Invalid lead id');
      }
      await this.setAsyncState({loading: true, error: null});

      const lead = await this.getLead(this.props.item.id);

      if (!lead?.id) {
        throw new Error('Loading Failed. Invalid lead id');
      }

      this.props.setScreenState({item: lead});

      const index = this.props.leads.findIndex(x => x.id == lead.id);
      if (index > -1)
        this.props.setScreenState(
          {
            leads: update(this.props.leads, {$merge: {[index]: lead}}),
          },
          true,
          'APP_DATA',
        );

      await this.setAsyncState({loading: false});
    } catch (e) {
      this.setAsyncState({error: e.message, loading: false});
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
      props: {item, index},
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
            {...{item, index, onNoteUpdate: this.onNoteUpdate.bind(this)}}
            detail
          />
        </View>

        <View style={{flex: 1}}>
          {item ? (
            <View style={styles.bgGreen}>
              <LeadDetailsTabNavigator />
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={'small'}
              style={{position: 'absolute', left: 0, right: 0, top: 69}}
              color="lightgreen"
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const SCREEN_NAME = 'LEAD_DETAILS_SCREEN';
const mapStateToProps = state => ({
  item: state.vState[SCREEN_NAME]?.item,
  index: state.vState[SCREEN_NAME]?.index,
  isLoggedIn: isLoggedIn(state),
  leads: state.pState['APP_DATA']?.leads,

  myLeadsLeadData: state.vState.MY_LEADS_SCREEN?.leadData,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadDetailsScreen);
