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
import {avatarColors} from '../../../Styles/colors';
import {DateTime} from 'luxon';

class LeadList extends AppComponent {
  state = {loading: false, reloading: false, error: null, firstTimeLoad: true};

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
    const avatarColor = avatarColors[(index || 0) % avatarColors.length];

    var matches = item.name?.match(/\b(\w)/g) || ['A', 'S'];
    var acronym = matches.join('');

    const share = item.shares?.find(x => x.user == this.props.user?.id);

    return (
      <TouchableOpacity
        style={styles.myLeadsItem}
        key={item?.leadid}
        onPress={() => this.goToLeadDetails(props)}>
        <View style={styles.myLeadsHeader}>
          <View
            style={[
              styles.leadAvatarDetail,
              {borderRadius: 999, backgroundColor: avatarColor},
            ]}>
            <Text style={styles.leadAvatarText}>{acronym}</Text>
          </View>
          <View style={styles.myLeadsContext}>
            <View style={styles.myLeadNameLine}>
              <Text style={styles.leadTopName}>{item.name}</Text>

              {item.isLegacy ? (
                <View style={styles.orangeCapsule}>
                  <Text style={styles.orangeCapsuleLabel}>
                    {DateTime.fromMillis(share?.ts).toFormat('dd LLL, yyyy')}
                  </Text>
                </View>
              ) : (
                <View style={styles.blueCapsule}>
                  <Text style={styles.blueCapsuleLabel}>
                    {DateTime.fromMillis(share?.ts).toFormat('dd LLL, yyyy')}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.leadTopLocationBar}>
              <Image
                source={require('../../../Assets/img/local/location.png')}
                style={styles.leadTopLocationIco}
              />
              <Text style={styles.leadTopLocation}>{item.city}, {item.state}</Text>
            </View>
          </View>
        </View>

        {item?.notes ? (
          <View style={{marginTop: 15, paddingVertical: 5}}>
            <Text style={{fontSize: 12, fontStyle: 'italic'}}>
              "{item?.notes}"
            </Text>
          </View>
        ) : (
          <View></View>
        )}

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
                {item.lookingAtCity}, {item.lookingAtState}
              </Text>
            </View>
          </View>
          <View style={styles.quadBox}>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.quadInner}
              onPress={() => sendEmail({to: item.email})}>
              <Image
                source={require('../../../Assets/img/myLeads/email.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                {item.email}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              style={styles.quadInner}
              onPress={() => callNumber(item.phone)}>
              <Image
                source={require('../../../Assets/img/myLeads/phone.png')}
                style={styles.myLeadsIco}
              />
              <Text numberOfLines={1} style={styles.quadLabel}>
                {formatPhoneNo(item.phone)}
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
    const leads = this.props.leads?.filter(x => x?.sharesUserOwns > 0);
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
                // onRefresh={() => this.load()}
              />
            }
            // onEndReached={this.loadMore.bind(this)}
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
  leads: state.pState.APP_DATA.leads,
  offset: state.vState[SCREEN_NAME]?.offset,
  reloadSearch: state.vState[SCREEN_NAME]?.reloadSearch,
  isLoggedIn: isLoggedIn(state),
  user: state.pState.AUTH?.user,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(LeadList);
