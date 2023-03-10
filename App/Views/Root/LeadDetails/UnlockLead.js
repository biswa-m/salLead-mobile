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

class UnlockLeadInner extends AppComponent {
  state = {loading: false, error: null};

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
      return lead;
    } catch (e) {
      this.setAsyncState({error: e.message, loading: false});
      Alert.alert('Error', e.message);
      return null;
    }
  }

  async unlock() {
    try {
      if (!this.props?.item?.leadid) {
        throw new Error('Loading Failed. Invalid lead id');
      }
      await this.setAsyncState({error: null});
      this.props.setScreenState({unlocking: true});

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

      const unlockPayload = {
        lead: this.props.item?.leadid,
        sharesRequested: 1,
        format: 'json',
        islegacy: lead.isLegacy,
      };

      console.warn({unlockPayload, lead});
      const unlockData = await api
        .get('/leads/buy', unlockPayload)
        .then(x => x.data);

      await this.setAsyncState({unlockData});
      this.props.setScreenState({unlocking: false});
      console.info({unlockData: JSON.stringify(unlockData, null, 4)});

      const updatedLead = await this.load();

      if (!['purchasecomplete'].includes(unlockData?.data?.claimStatus)) {
        if (unlockData?.data?.alertText)
          throw new Error(unlockData?.data?.alertText?.toString());
      } else {
        this.props.onSuccess?.({lead: updatedLead});
        this.props.setScreenState(
          {reloadSearch: Date.now()},
          false,
          'MY_LEADS_SCREEN',
        );

        Alert.alert('Success', 'Lead Unlocked');
      }
    } catch (e) {
      this.setAsyncState({error: e.message});
      this.props.setScreenState({unlocking: false});
      this.props.onFail?.(e);
      Alert.alert('Error', e.message);
    }
  }

  async flagLead() {
    try {
      const res = await api
        .post('leads/report-lead?leadid=' + this.props.item?.leadid + '&format=json', {
          leadid: this.props.item?.leadid,
          reporter_desc: 'Lead flagged from SalLead App.',
          // submit: 'Report This Profile'
        })
        .then(x => x.data);

      console.info(this.props.item?.leadid, 'Request passed');
      navigationModule.exec('goBack', [null])
    } catch (error) {
      // console.log(this.state.leadid, 'Request failed')
      console.log(error);
    }
  }

  flagAction() {
    Alert.alert('Flag Lead', 'Are you sure you would like to flag this lead?', [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
      },
      { text: "Confirm", onPress: () => this.flagLead() }
    ]);
  }

  render() {
    const {
      props: {unlocking, lead, mode = 0, item},
      state: {loading},
    } = this;

    const leadUnlocked = lead
      ? lead.currentUserOwnsLead
      : item
      ? item?.sharesUserOwns > 0
      : false;

      console.log(lead, 'THIS IS LEAD')

    if (mode == 'leadDetails') {
      if (lead?.currentUserOwnsLead && lead?.isValidLead == true) return (
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
                this.flagAction();
              }
            }}
            disabled={unlocking || loading}>
            <Image
              source={require('../../../Assets/img/detail/lockOrange.png')}
              style={styles.smallWhiteButtonIco}
            />
            <Text style={[styles.unlockLeadButtonLabel, {color:'#e67e22'}]}>
              Flag Data
            </Text>
          </TouchableOpacity>
        </View>
      );
      if (lead?.currentUserOwnsLead && lead?.isValidLead == false) return (
        <View style={styles.unlockLeadButton}>
          <TouchableOpacity disabled
            style={styles.unlockLeadButtonInner}
            hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
            
            >
            <Image
              source={require('../../../Assets/img/detail/lockOrange.png')}
              style={styles.smallWhiteButtonIco}
            />
            <Text style={[styles.unlockLeadButtonLabel, {color:'#e67e22'}]}>
              You have flagged this lead.
            </Text>
          </TouchableOpacity>
        </View>
      );
      if (lead?.currentUserOwnsLead) return (
        null
      );
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
          ) : lead?.currentUserOwnsLead ? (
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
          const lead = data?.lead;

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
              if (item?.leadid && item?.leadid === lead?.leadid) {
                updateObj = {
                  ...updateObj,
                  [i]: {
                    ...item,
                    lead: lead,
                    sharesUserOwns: (item.sharesUserOwns || 0) + 1,
                    topPhone: lead?.topInfo?.phone || item.topPhone,
                    topEmail: lead?.topInfo?.email || item.topEmail,
                  },
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
  }),
  dispatch => ({
    setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
      persist
        ? dispatch(PActions.setPScreenState(screenName, obj))
        : dispatch(UnpActions.setVScreenState(screenName, obj)),
  }),
)(UnlockLead);
