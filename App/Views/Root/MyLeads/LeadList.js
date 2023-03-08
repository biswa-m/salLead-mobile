import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import SearchInput from '../../../Components/Input/SearchInput';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import LeadRow from '../../Components/LeadRow';
import api from '../../../Services/Api/api';
import navigationModule from '../../../Modules/navigationModule';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import {callNumber, sendEmail} from '../../../Modules/linking/linking';
import formatPhoneNo from '../../../Modules/etc/formatPhoneNo';
import { avatarColors } from '../../../Styles/colors';

class LeadList extends AppComponent {
  state = {loading: false, reloading: false, error: null, firstTimeLoad: true};

  componentDidMount() {
    this.onMount();
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.reloadSearch != this.props.reloadSearch ||
      prevProps.isLoggedIn != this.props.isLoggedIn
    ) {
      this.load();
    }
  }

  loadId = 0;
  async load() {
    try {
      const loadId = this.loadId + 1;
      this.loadId = loadId;
      this.setAsyncState({error: null, reloading: true});
      const url = 'account/myleads/ajxleads';

      const payload = {
        // showarchived:0,
        // showignored:0,
        // search:'',
        offset: 0,
        order: 'asc',
        limit: 20,
        // format: 'json',
      };

      console.info({payload, url});

      const data = await api.get(url, payload).then(x => x.data);
      console.info({data});
      this.setAsyncState({reloading: false, firstTimeLoad: false});

      // console.warn(data);

      if (loadId === this.loadId)
        this.props.setScreenState({
          leadData: data,
          offset: payload.offset,
        });
    } catch (error) {
      this.setAsyncState({error: error.message, reloading: false});
      Alert.alert('Error', error.message);
    }
  }

  async loadMore() {
    try {
      console.info('load more');
      if (this.state.reloading || this.state.loading || this.state.endReached)
        return;
      const loadId = this.loadId + 1;
      this.loadId = loadId;

      this.setAsyncState({error: null, loading: true});
      const url = 'account/myleads/ajxleads';

      const payload = {
        offset: this.props.offset + 20,
        order: 'asc',
        limit: 20,
        format: 'json',
      };

      console.info({payload, url});

      const data = await api.get(url, payload).then(x => x.data);
      this.setAsyncState({
        loading: false,
        firstTimeLoad: false,
        endReached: !data?.rows?.length,
      });

      // console.warn(data);

      if (loadId === this.loadId)
        this.props.setScreenState({
          leadData: {
            ...this.props.leadData,
            ...data,
            rows: [...(this.props.leadData?.rows || []), ...(data?.rows || [])],
          },
          offset: payload.offset,
        });
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

  renderItem(props) {
    const {item, index} = props;
    // sampleData = {
    //   leadid: 7913391,
    //   fullname: 'Vernice Laldee',
    //   notes: '',
    //   topEmail: 'Vern.laldee@gmail.com',
    //   topPhone: '7188641217',
    //   location: 'Kings (Northeast), NY',
    //   dateClaimed: '08/09/2022 10:28:59',
    //   dateAdded: '08/08/2022 16:24:42',
    //   priceRange: '$150,000 - $450,000',
    //   priority: 4,
    //   profileurl: 'https://m.qazzoo.com/real-estate-lead-details/7913391',
    // };
    const avatarColor = avatarColors[(index || 0) % avatarColors.length];

    var matches = item.topName
      ? item.topName.match(/\b(\w)/g)
      : item.fullname
      ? item.fullname.match(/\b(\w)/g)
      : ['A', 'S']; // ['J','S','O','N']
    var acronym = matches.join(''); // JSON
    console.log(item)
    console.log('CHECK HERE ABOVE NOW')
    return (
      <TouchableOpacity
        style={styles.myLeadsItem}
        key={item?.leadid}
        onPress={() => this.goToLeadDetails(props)}>
        <View style={styles.myLeadsHeader}>
          <View style={[styles.leadAvatarDetail, {borderRadius: 999}]}>
            <Text style={styles.leadAvatarText}>{acronym}</Text>
          </View>
          <View style={styles.myLeadsContext}>
            <View style={styles.myLeadNameLine}>
              <Text style={styles.leadTopName}>{item.fullname}</Text>

              {
                item.dateAdded.includes("Legacy") ?
                <View style={styles.orangeCapsule}>
                  <Text style={styles.orangeCapsuleLabel}>{item.dateAdded.substring(0,10)}</Text>
                </View> 
                : 
                <View style={styles.blueCapsule}>
                  <Text style={styles.blueCapsuleLabel}>{item.dateAdded.substring(0,10)}</Text>
                </View> 
              }

           
            </View>
            <View style={styles.leadTopLocationBar}>
              <Image
                source={require('../../../Assets/img/local/location.png')}
                style={styles.leadTopLocationIco}
              />
              <Text style={styles.leadTopLocation}>{item.location}</Text>
            </View>
          </View>
        </View>

        {item?.notes ?
        <View style={{marginTop:15,paddingVertical:5,}}>
          <Text style={{fontSize:12,fontStyle:'italic',}}>"{item?.notes}"</Text>
        </View> 
        :
        <View></View>
      }
        

        <View style={styles.myLeadBody}>
          <View style={styles.quadBox}>
            <View style={styles.quadInner}>
              <Image
                source={require('../../../Assets/img/myLeads/homeBuyer.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                Home Buyer
              </Text>
            </View>
            <View style={styles.quadInner}>
              <Image
                source={require('../../../Assets/img/myLeads/location.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                {item.location}
              </Text>
            </View>
          </View>
          <View style={styles.quadBox}>
            <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.quadInner}
              onPress={() => sendEmail({to: item.topEmail})}>
              <Image
                source={require('../../../Assets/img/myLeads/email.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                {item.topEmail}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.quadInner}
              onPress={() => callNumber(item.topPhone)}>
              <Image
                source={require('../../../Assets/img/myLeads/phone.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                {formatPhoneNo(item.topPhone)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <Text>Date Claimed: {item.dateClaimed}</Text>
        <Text>Date Added: {item.dateAdded}</Text> */}
      </TouchableOpacity>
    );
  }

  render() {
    const leads = this.props.leadData?.rows;
    return (
      <>
        {!leads?.length && this.state.reloading ? (
          <ActivityIndicator size={'large'} />
        ) : (
          <FlatList
            style={styles.fill}
            keyExtractor={item => item?.leadid}
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
              <View style={styles.nothingBox}>
                <View style={styles.nothingBoxDecor}>
                  <View style={styles.nothingBoxDecorInner}></View>
                </View>
                <Text style={styles.nothingBoxLabel}>Nothing To Show</Text>
              </View>
            )}
            ListFooterComponent={() => {
              return this.state.loading ? (
                <ActivityIndicator size={'large'} />
              ) : null;
            }}
          />
        )}
      </>
    );
  }
}

const SCREEN_NAME = 'MY_LEADS_SCREEN';
const mapStateToProps = state => ({
  leadData: state.vState[SCREEN_NAME]?.leadData,
  offset: state.vState[SCREEN_NAME]?.offset,
  reloadSearch: state.vState[SCREEN_NAME]?.reloadSearch,
  isLoggedIn: isLoggedIn(state),
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadList);
