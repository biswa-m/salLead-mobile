import React from 'react';
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import update from 'immutability-helper';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import api from '../../../Services/Api/api';
import {isLoggedIn} from '../../../Stores/redux/Persisted/Selectors';
import navigationModule from '../../../Modules/navigationModule';
import apiModule from '../../../Modules/api/apiModule';

class UnlockLeadInner extends AppComponent {
  state = {loading: false, error: null};

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
      if (index > -1) {
        this.props.setScreenState(
          {
            leads: update(this.props.leads, {$merge: {[index]: lead}}),
          },
          true,
          'APP_DATA',
        );
      }

      await this.setAsyncState({loading: false});
      return lead;
    } catch (e) {
      this.setAsyncState({error: e.message, loading: false});
      Alert.alert('Error', e.message);
      return null;
    }
  }

  async unlock() {
    try {
      if (!this.props?.item?.id) {
        throw new Error('Loading Failed. Invalid lead id');
      }
      await this.setAsyncState({error: null});
      this.props.setScreenState({unlocking: true});

      const item = this.props.item;

      await apiModule.unlock(item);
      const updatedLead = await this.load();

      this.props.setScreenState({unlocking: false});

      this.props.onSuccess?.({item: updatedLead});
      this.props.setScreenState(
        {reloadSearch: Date.now()},
        false,
        'MY_LEADS_SCREEN',
      );

      Alert.alert('Success', 'Lead Unlocked');
    } catch (e) {
      this.setAsyncState({error: e.message});
      this.props.setScreenState({unlocking: false});
      this.props.onFail?.(e);
      this.load();
      Alert.alert('Error', e.message);
    }
  }

  async flagLead() {
    try {
      const res = await api
        .post(
          'leads/report-lead?leadid=' + this.props.item?.id + '&format=json',
          {
            id: this.props.item?.id,
            reporter_desc: 'Lead flagged from SalLead App.',
            // submit: 'Report This Profile'
          },
        )
        .then(x => x.data);

      console.info(this.props.item?.id, 'Request passed');
      navigationModule.exec('goBack', [null]);
    } catch (error) {
      // console.log(this.state.id, 'Request failed')
      console.log(error);
    }
  }

  flagAction() {
    Alert.alert('Flag Lead', 'Are you sure you would like to flag this lead?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {text: 'Confirm', onPress: () => this.flagLead()},
    ]);
  }

  render() {
    const {
      props: {unlocking, lead, mode = 0, item},
      state: {loading},
    } = this;

    const leadUnlocked = item?.sharesUserOwns > 0;

    if (mode == 'leadDetails') {
      // if (leadUnlocked && lead?.isValidLead == true)
      //   return (
      //     <View style={styles.unlockLeadButton}>
      //       <TouchableOpacity
      //         style={styles.unlockLeadButtonInner}
      //         hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
      //         onPress={() => {
      //           if (!this.props.isLoggedIn) {
      //             this.props.setScreenState(
      //               {isVisible: true},
      //               false,
      //               'LOGIN_SCREEN',
      //             );
      //           } else {
      //             this.flagAction();
      //           }
      //         }}
      //         disabled={unlocking || loading}>
      //         <Image
      //           source={require('../../../Assets/img/detail/lockOrange.png')}
      //           style={styles.smallWhiteButtonIco}
      //         />
      //         <Text style={[styles.unlockLeadButtonLabel, {color: '#e67e22'}]}>
      //           Flag Data
      //         </Text>
      //       </TouchableOpacity>
      //     </View>
      //   );
      // if (leadUnlocked && !lead?.isValidLead)
      //   return (
      //     <View style={styles.unlockLeadButton}>
      //       <TouchableOpacity
      //         disabled
      //         style={styles.unlockLeadButtonInner}
      //         hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
      //         <Image
      //           source={require('../../../Assets/img/detail/lockOrange.png')}
      //           style={styles.smallWhiteButtonIco}
      //         />
      //         <Text style={[styles.unlockLeadButtonLabel, {color: '#e67e22'}]}>
      //           You have flagged this lead.
      //         </Text>
      //       </TouchableOpacity>
      //     </View>
      //   );
      if (leadUnlocked) return null;
      return (
        <View style={styles.unlockLeadButton}>
          <TouchableOpacity
            style={styles.unlockLeadButtonInner}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            onPress={() => {
              if (!this.props.isLoggedIn) {
                this.props.setScreenState(
                  {isVisible: true},
                  false,
                  'LOGIN_SCREEN',
                );
              } else {
                this.unlock();
              }
            }}
            disabled={unlocking || loading}>
            <Image
              source={require('../../../Assets/img/detail/lock.png')}
              style={styles.smallWhiteButtonIco}
            />
            <Text style={styles.unlockLeadButtonLabel}>
              {unlocking ? 'Unlocking' : 'Unlock'} Contact Info
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (mode == 'browseScreen') {
      return (
        <>
          {!leadUnlocked ? (
            <TouchableOpacity
              style={[styles.qzLeadActionUnlock, styles.qzLeadAction]}
              hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}
              onPress={() => {
                if (!this.props.isLoggedIn) {
                  this.props.setScreenState(
                    {isVisible: true},
                    false,
                    'LOGIN_SCREEN',
                  );
                } else {
                  this.unlock();
                }
              }}
              disabled={unlocking || loading || leadUnlocked}>
              <Image
                source={require('../../../Assets/img/leads/unlockLight.png')}
                style={styles.qzLeadActionIco}
              />
              <Text style={[styles.qzLeadActionLabel]}>
                {unlocking ? 'Unlocking' : 'Unlock'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.qzLeadActionUnlock, styles.qzLeadAction]}
              disabled={unlocking || loading || leadUnlocked}>
              <Image
                source={require('../../../Assets/img/leads/unlockedLight.png')}
                style={styles.qzLeadActionIco}
              />

              <Text style={styles.qzLeadActionLabel}>View</Text>
            </TouchableOpacity>
          )}
        </>
      );
    } else
      return (
        <>
          {!this.props.isLoggedIn ? (
            <TouchableOpacity
              style={styles.smallWhiteButton}
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() =>
                !this.props.isLoggedIn &&
                this.props.setScreenState(
                  {isVisible: true},
                  false,
                  'LOGIN_SCREEN',
                )
              }>
              <Image
                source={require('../../../Assets/img/detail/lock.png')}
                style={styles.smallWhiteButtonIco}
              />
              <Text style={styles.smallWhiteButtonLabel}>Unlock</Text>
            </TouchableOpacity>
          ) : leadUnlocked ? (
            <TouchableOpacity style={styles.smallWhiteButton} disabled>
              <View style={styles.customCheckBox}>
                <View style={styles.check1}></View>
                <View style={styles.check2}></View>
              </View>
              <Text style={styles.smallWhiteButtonLabel}>Lead Unlocked</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.smallWhiteButton}
              disabled={unlocking || loading}
              onPress={this.unlock.bind(this)}>
              <Image
                source={require('../../../Assets/img/detail/lock.png')}
                style={styles.smallWhiteButtonIco}
              />
              <Text style={styles.smallWhiteButtonLabel}>
                {unlocking ? 'Unlocking' : loading ? 'Loading' : 'Unlock'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      );
  }
}

class UnlockLeadLeadDetailsScreenInner extends AppComponent {
  render() {
    return (
      <UnlockLeadInner
        {...this.props}
        onSuccess={data => {
          const lead = data?.item;

          if (this.props.onSuccess) {
            this.props.onSuccess(data);
          } else if (lead && this.props.browseScreenLeadData?.leads?.length) {
            let updateObj = {};

            // Check all leads in browse screen leads and prepare the updates
            for (
              let i = 0;
              i < this.props.browseScreenLeadData.leads.length;
              i++
            ) {
              const item = this.props.browseScreenLeadData.leads[i];
              if (item?.id && item?.id === lead?.id) {
                updateObj = {
                  ...updateObj,
                  [i]: lead,
                };
              }
            }

            // If matching lead found, execute the update
            if (Object.keys(updateObj).length) {
              let newLeadData = update(this.props.browseScreenLeadData, {
                leads: {$merge: updateObj},
              });

              // Store on browse screen redux store
              this.props.setScreenState(
                {leadData: newLeadData},
                false,
                'BROWSE_SCREEN',
              );
            }
          }
        }}
      />
    );
  }
}

const SCREEN_NAME = 'LEAD_DETAILS_SCREEN';
const mapStateToProps = state => ({
  browseScreenLeadData: state.vState['BROWSE_SCREEN']?.leadData,
  item: state.vState[SCREEN_NAME]?.item,
  index: state.vState[SCREEN_NAME]?.index,
  lead: state.vState[SCREEN_NAME]?.lead,
  unlocking: state.vState[SCREEN_NAME]?.unlocking,
  isLoggedIn: isLoggedIn(state),
  leads: state.pState['APP_DATA']?.leads,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

const UnlockLeadLeadDetailsScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnlockLeadLeadDetailsScreenInner);

class UnlockLead extends AppComponent {
  render() {
    const {
      props: {mode},
    } = this;

    if (['browseScreen'].includes(mode)) {
      return (
        <UnlockLeadInner
          {...this.props}
          unlocking={this.state.unlocking}
          setScreenState={(obj, persist, screenName) => {
            if (['LOGIN_SCREEN'].includes(screenName)) {
              this.props.setScreenState(obj, persist, screenName);
            } else {
              this.setAsyncState(obj);
            }
          }}
        />
      );
    } else {
      return <UnlockLeadLeadDetailsScreen {...this.props} />;
    }
  }
}

export default connect(
  state => ({
    isLoggedIn: isLoggedIn(state),
    leads: state.pState['APP_DATA']?.leads,
  }),
  dispatch => ({
    setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
      persist
        ? dispatch(PActions.setPScreenState(screenName, obj))
        : dispatch(UnpActions.setVScreenState(screenName, obj)),
  }),
)(UnlockLead);
