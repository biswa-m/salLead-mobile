import React from 'react';
import {
  ScrollView,
  Text,
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
import UnlockLead from './UnlockLead';
import {callNumber, sendEmail} from '../../../Modules/linking/linking';

class DetailsTab extends AppComponent {
  render() {
    const {
      props: {item, lead},
    } = this;


    return (
      <View style={styles.tabContextParent}>
        <View style={styles.tabContextInner}>
          <ScrollView style={[styles.fill, styles.bgLight]}>
            <View style={styles.detailContextWrapperParent}>
              <View style={styles.detailContextWrapper}>
                <View style={styles.leadDetailContextRow}>
                  <View style={styles.LeadDetailContext}>
                    <Text style={styles.leadDetailContextLabel}>I am a</Text>
                    <Text style={styles.leadDetailContextValue}>
                      Home Buyer
                    </Text>
                  </View>
                  <Image
                    source={require('../../../Assets/img/detail/lock.png')}
                    style={styles.smallWhiteButtonIco}
                  />
                </View>

                <View style={styles.leadDetailContextRow}>
                  <View style={styles.LeadDetailContext}>
                    <Text style={styles.leadDetailContextLabel}>
                      I'm looking in
                    </Text>
                    <Text style={styles.leadDetailContextValue}>
                      {lead?.aboutMe?.myPreferredArea || 'My Area'}
                    </Text>
                  </View>
                  <Image
                    source={require('../../../Assets/img/detail/lock.png')}
                    style={styles.smallWhiteButtonIco}
                  />
                </View>

                <View style={styles.leadDetailContextRow}>
                  <TouchableOpacity hitSlop={{top: 12, bottom: 12, left: 20, right: 30}} style={styles.LeadDetailContext} onPress={() => {
                        const email = lead?.topInfo?.email || item?.topEmail;
                        sendEmail({to: email});
                      }}>
                    <Text style={styles.leadDetailContextLabel}>Email</Text>
                    <Text
                      style={styles.leadDetailContextValue}>
                      {lead?.topInfo?.email || item?.topEmail}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../../Assets/img/detail/lock.png')}
                    style={styles.smallWhiteButtonIco}
                  />
                </View>

                <View style={styles.leadDetailContextRow}>
                  <TouchableOpacity hitSlop={{top: 12, bottom: 12, left: 20, right: 30}} style={styles.LeadDetailContext} onPress={() =>
                        callNumber(lead?.topInfo?.phone || item?.topPhone)
                      }>
                    <Text style={styles.leadDetailContextLabel}>Phone</Text>
                    <Text
                      style={styles.leadDetailContextValue}
                      >
                      {lead?.topInfo?.phone || item?.topPhone}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../../Assets/img/detail/lock.png')}
                    style={styles.smallWhiteButtonIco}
                  />
                </View>
              </View>
            </View>

            <UnlockLead mode={'leadDetails'} />
          </ScrollView>
        </View>
      </View>
    );
  }
}

const SCREEN_NAME = 'LEAD_DETAILS_SCREEN';
const mapStateToProps = state => ({
  item: state.vState[SCREEN_NAME]?.item,
  lead: state.vState[SCREEN_NAME]?.lead,
});
const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsTab);
