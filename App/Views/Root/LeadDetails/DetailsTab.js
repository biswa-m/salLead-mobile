import React from 'react';
import {ScrollView, Text, TouchableOpacity, View, Image} from 'react-native';
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
      props: {item},
    } = this;

    const leadUnlocked = item?.sharesUserOwns > 0;

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
                      {item.consumerType}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadDetailContextRow}>
                  <View style={styles.LeadDetailContext}>
                    <Text style={styles.leadDetailContextLabel}>
                      I'm looking in
                    </Text>
                    <Text style={styles.leadDetailContextValue}>
                      {`${item.lookingAtCity}, ${item.lookingAtState}` ||
                        'My Area'}
                    </Text>
                  </View>
                </View>

                <View style={styles.leadDetailContextRow}>
                  <TouchableOpacity
                    hitSlop={{top: 12, bottom: 12, left: 20, right: 30}}
                    style={styles.LeadDetailContext}
                    disabled={!leadUnlocked}
                    onPress={() => {
                      sendEmail({to: item.email});
                    }}>
                    <Text style={styles.leadDetailContextLabel}>Email</Text>
                    <Text style={styles.leadDetailContextValue}>
                      {leadUnlocked ? item.email : ''}
                    </Text>
                  </TouchableOpacity>
                  <Image
                    source={require('../../../Assets/img/detail/lock.png')}
                    style={styles.smallWhiteButtonIco}
                  />
                </View>

                <View style={styles.leadDetailContextRow}>
                  <TouchableOpacity
                    hitSlop={{top: 12, bottom: 12, left: 20, right: 30}}
                    style={styles.LeadDetailContext}
                    disabled={!leadUnlocked}
                    onPress={() => callNumber(item.phone)}>
                    <Text style={styles.leadDetailContextLabel}>Phone</Text>
                    <Text style={styles.leadDetailContextValue}>
                      {leadUnlocked ? item.phone : ''}
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
});
const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsTab);
