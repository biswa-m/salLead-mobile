import React from 'react';
import {
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import _ from 'lodash';

import PureAppComponent from '../../Components/RN/PureAppComponent';
import {callNumber, sendEmail, sendSMS} from '../../Modules/linking/linking';
import {avatarColors} from '../../Styles/colors';
import styles from '../../Styles/styles';
import UnlockLead from '../Root/LeadDetails/UnlockLead';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../../Services/Api/api';

class LeadRow extends PureAppComponent {
  state = {
    loading: null,
    error: null,
    leadid: null,
    noteText: null,

    editMode: null,
    editView: null,
    editSubmitValue: null,
  };

  async makeNote() {
    try {
      this.setAsyncState({loading: true, error: null});
      const res = await api
        .post('real-estate-lead-detail/qazzoo-homebuyer/' + this.state.leadid, {
          lead_notes: this.state.noteText,
          format: 'json',
        })
        .then(x => x.data);

      console.info(res);

      this.setAsyncState({
        editSubmitValue: this.state.noteText,
        editMode: false,
      });

      if (this.props.onNoteUpdate)
        this.props.onNoteUpdate({notes: this.state.noteText});
    } catch (error) {
      this.setAsyncState({error: error.message, loading: null});
      console.log(error);
    }
  }

  async makeEditMode() {
    try {
      this.setAsyncState({editMode: true});
    } catch (error) {
      console.log(error);
    }
  }

  async makeEditView() {
    try {
      this.setAsyncState({editView: true, editMode: true});
    } catch (error) {
      console.log(error);
    }
  }

  async setText(text) {
    try {
      this.setAsyncState({noteText: text});
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {
      props: {item, descriptionTextLim, lead, browse, detail, index, addStyle},
    } = this;

    var matches = item.topName
      ? item.topName.match(/\b(\w)/g)
      : item.fullname
      ? item.fullname.match(/\b(\w)/g)
      : ['A', 'S']; // ['J','S','O','N']
    var acronym = matches.join(''); // JSON

    const avatarColor = avatarColors[(index || 0) % avatarColors.length];

    const leadUnlocked = item?.sharesUserOwns > 0 || lead?.currentUserOwnsLead;
    const lockIcon = require('../../Assets/img/leads/unlockLight.png');

    this.setAsyncState({leadid: item.leadid});

    console.log(item);
    console.log('Check above ITEM');
    console.log(item.age);

    var ageNumber = item.age?.match(/\d+/)[0]; // "3"

    console.log(ageNumber);

    var dayChecker = item.age?.includes('days ago');
    console.log(dayChecker, ': contains days ago?');

    console.log(item.isLegacy, ': is it legacy?');

    console.log(addStyle,'Check above LEAD');

    return (
      <View style={ageNumber == 119 && addStyle ? styles.pink : addStyle ? styles.browseLeadsList : styles.none}>
        {this.props.detail ? (
          <View style={styles.leadContainer}>
            <View style={styles.leadTopDetail}>
              <View
                style={[
                  styles.leadAvatarDetail,
                  {backgroundColor: avatarColor},
                ]}>
                <Text style={styles.leadAvatarText}>{acronym}</Text>
              </View>
              <View style={styles.leadTopContext}>
                <Text style={styles.leadTopNameDetail}>
                  {item.topName || item.fullname}
                </Text>
                <View style={styles.leadTopLocationBar}>
                  <Text style={styles.leadTopLocationDetail}>
                    {item.topLocation || item.location}
                  </Text>
                </View>
                <Text style={styles.leadTopLocationDetail}>Home Buyer</Text>
              </View>
            </View>
            {
              lead?.description || item?.description ?
            <View style={styles.leadContextContainerDetail}>
              <Text style={styles.leadContextLabelDetail}>Description</Text>
              <Text style={styles.leadContextDetail}>
                {/* {descriptionTextLim &&
                (lead?.description || item.description)?.length >
                  descriptionTextLim
                  ? (lead?.description || item.description).substr(
                      0,
                      descriptionTextLim,
                    ) + '...'
                  : lead?.description || item.description} */}
                {lead?.description || item?.description}
              </Text>
            </View> : <View style={{height:20,width:'100%',}}></View>
            }

            {leadUnlocked && !lead?.notes && !this.state.editView ? (
              <TouchableOpacity
                onPress={this.makeEditView.bind(this)}
                style={[
                  styles.leadContextContainerDetail,
                  {
                    flexDirection: 'row',
                    marginTop: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                  },
                ]}>
                <View style={styles.iconPlus}>
                  <View style={styles.iconPlus1}></View>
                  <View style={styles.iconPlus2}></View>
                </View>
                <Text style={styles.leadContextDetail}>Add Notes</Text>
              </TouchableOpacity>
            ) : lead?.notes ? (
              console.log(item.topPhone !== 'Phone Available', 'JOESAL')
            ) : (
              <View></View>
            )}

            {this.state.editView || lead?.notes ? (
              <View style={[styles.leadContextContainerDetail, {marginTop: 0}]}>
                <Text style={styles.leadContextLabelDetail}>Notes</Text>
                {this.state.editMode ? (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={this.makeNote.bind(this)}>
                    <Text style={{color: '#FFFFFF', fontSize: 12}}>Save</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={this.makeEditMode.bind(this)}>
                    <Text style={{color: '#FFFFFF', fontSize: 12}}>Edit</Text>
                  </TouchableOpacity>
                )}

                {this.state.editMode == true ? (
                  <TextInput
                    multiline
                    defaultValue={this.state.editSubmitValue || lead?.notes}
                    placeholder={'Start typing'}
                    placeholderTextColor={'#CAF8C3'}
                    onChangeText={text => this.setText(text)}
                    style={[styles.leadContextDetail, styles.notesInput]}
                  />
                ) : (
                  <Text style={styles.leadContextDetail}>
                    {this.state.editSubmitValue ||
                      lead?.notes ||
                      'Press edit to begin'}{' '}
                  </Text>
                )}
              </View>
            ) : (
              <View></View>
            )}
          </View>
        ) : (
          <View style={styles.leadContainer}>
            <View style={styles.leadTop}>
              <View style={[styles.leadAvatar, {backgroundColor: avatarColor}]}>
                <Text style={styles.leadAvatarText}>{acronym}</Text>
              </View>
              <View style={[styles.leadTopContext, {flex: 1}]}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={[styles.leadTopName, {flex: 1}]}
                    numberOfLines={1}>
                    {item.topName || item.fullname}
                  </Text>

                  {this.props.browse ? (
                    <View style={styles.orangeCapsule}>
                      <Text style={styles.orangeCapsuleLabel}>
                        {item.age.replace(/about /g, '')}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.orangeCapsule,
                        {marginTop: -6, marginRight: -4},
                      ]}>
                      <Text style={styles.orangeCapsuleLabel}>
                        {item.age.replace(/about /g, '')}
                      </Text>
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.leadTopLocationBar,
                    {flex: 1, flexDirection: 'row'},
                  ]}>
                  <Image
                    source={require('../../Assets/img/local/location.png')}
                    style={styles.leadTopLocationIco}
                  />
                  <Text
                    style={[styles.leadTopLocation, {flex: 1}]}
                    numberOfLines={1}>
                    {item.topLocation || item.location}
                  </Text>
                </View>
              </View>
            </View>
            {this.props.browse ? (
              <Text style={styles.leadContextIndented}>
                {/* {descriptionTextLim &&
                (lead?.description || item.description)?.length >
                  descriptionTextLim
                  ? (lead?.description || item.description).substr(
                      0,
                      descriptionTextLim,
                    ) + '...'
                  : lead?.description || item.description} */}
                {item?.description}
              </Text>
            ) : (
              <Text style={styles.leadContext}>
                {/* {descriptionTextLim &&
                (lead?.description || item.description)?.length >
                  descriptionTextLim
                  ? (lead?.description || item.description).substr(
                      0,
                      descriptionTextLim,
                    ) + '...'
                  : lead?.description || item.description} */}
                {item?.description}
              </Text>
            )}
          </View>
        )}

        {this.props.browse ? (
          <View style={styles.qzLeadActionRow}>
            <View style={styles.qzLeadActionRowContext}>
              <TouchableOpacity
                style={[styles.qzLeadActionCall, styles.qzLeadAction]}
                hitSlop={{top: 20, bottom: 20, left: 20, right: 5}}
                onPress={() => callNumber(item?.topPhone)}
                // disabled={!leadUnlocked}
              >
                <Image
                  source={
                    leadUnlocked
                      ? require('../../Assets/img/leads/callLight.png')
                      : lockIcon
                  }
                  style={styles.qzLeadActionIco}
                />
                <Text style={styles.qzLeadActionLabel}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qzLeadActionMessage, styles.qzLeadAction]}
                // disabled={!leadUnlocked}
                hitSlop={{top: 20, bottom: 20, left: 5, right: 5}}
                onPress={() => sendSMS({phone: item?.topPhone})}>
                <Image
                  source={
                    leadUnlocked
                      ? require('../../Assets/img/leads/messageLight.png')
                      : lockIcon
                  }
                  style={styles.qzLeadActionIco}
                />
                <Text style={styles.qzLeadActionLabel}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.qzLeadActionEmail, styles.qzLeadAction]}
                // disabled={!leadUnlocked}
                hitSlop={{top: 20, bottom: 20, left: 5, right: 10}}
                onPress={() => sendEmail({to: item.topEmail})}>
                <Image
                  source={
                    leadUnlocked
                      ? require('../../Assets/img/leads/emailLight.png')
                      : lockIcon
                  }
                  style={styles.qzLeadActionIco}
                />
                <Text style={styles.qzLeadActionLabel}>Email</Text>
              </TouchableOpacity>
            </View>
            <UnlockLead
              mode="browseScreen"
              {..._.pick(this.props, ['lead', 'item', 'index'])}
              onSuccess={({lead}) => {
                if (!lead) return;
                const item = {
                  ...this.props.item,
                  lead: lead,
                  sharesUserOwns: (this.props.item.sharesUserOwns || 0) + 1,
                  topPhone: lead?.topInfo?.phone || this.props.item.topPhone,
                  topEmail: lead?.topInfo?.email || this.props.item.topEmail,
                };
                this.props.updateItem?.({item, index: this.props.index});
              }}
            />
          </View>
        ) : (
          <View></View>
        )}
      </View>
    );
  }
}

export default LeadRow;
