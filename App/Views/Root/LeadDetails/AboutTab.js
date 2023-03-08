import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  Touchable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import _ from 'lodash';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import UnlockLead from './UnlockLead';

class AboutTab extends AppComponent {
  rows = [
    {
      key: '',
      title: 'd',
    },
    {
      key: 'age',
      title: 'Added',
    },
  ];

  renderRow({key, title, getValue, render, value}) {
    const result = value
      ? value
      : getValue
      ? getValue(this.props.item)
      : this.props.item?.[key];

    if (!result) return null;

    return (
      <View style={styles.leadDetailContextRow} key={key}>
        
        {title == 'I Live In' ? (
          <Image
            source={require('../../../Assets/img/detail/pinIcon.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'My Preferred Area' ? (
          <Image
            source={require('../../../Assets/img/detail/mapIcon.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'My Credit History' ? (
          <Image
            source={require('../../../Assets/img/detail/creditIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'I Currently' ? (
          <Image
            source={require('../../../Assets/img/detail/homeIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'My Home Value' ? (
          <Image
            source={require('../../../Assets/img/detail/homeIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'My Income Range' ? (
          <Image
            source={require('../../../Assets/img/detail/incomeIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'Cashon Hand' ? (
          <Image
            source={require('../../../Assets/img/detail/incomeIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : title == 'Move Timeframe' ? (
          <Image
            source={require('../../../Assets/img/detail/homeIco.png')}
            style={styles.leadDetailContextIco}
          />
        ) : (
          <Image
            source={require('../../../Assets/img/detail/homeIco.png')}
            style={styles.leadDetailContextIco}
          />
        )}
        <View style={styles.LeadDetailContext}>
          <Text style={styles.leadDetailContextLabel}>{title}</Text>

          {title == 'My Home Value' ? (
            <Text
              style={[
                styles.leadDetailContextValue,
                styles.leadDetailValueGold,
              ]}>
              {render ? render(item) : result?.toString()}
            </Text>
          ) : (
            <Text style={styles.leadDetailContextValue}>
              {render ? render(item) : result?.toString()}
            </Text>
          )}
        </View>
      </View>
    );
  }

  render() {
    const {
      props: {lead},
    } = this;

    return (
      <View style={styles.tabContextParent}>
        <View style={styles.tabContextInner}>
          <ScrollView style={[styles.fill, styles.bgLight]}>
            <View style={styles.detailContextWrapperParent}>
              <View style={styles.detailContextWrapper}>
                {/* <View>
                  <Text>About Me</Text>
                </View> */}

                {lead?.aboutMe
                  ? Object.keys(lead?.aboutMe).map(key =>
                      this.renderRow({
                        key,
                        title: _.startCase(key),
                        value: lead?.aboutMe?.[key],
                      }),
                    )
                  : null}
              </View>
            </View>

            {lead?.lookingFor ?
            <View style={styles.contextCategoryBox}>
              <Text style={styles.contextCategoryLabel}>Looking For</Text>
            </View> : <View></View>
            }

            <View style={styles.detailContextWrapperParent}>
              <View style={styles.detailContextWrapper}>
                {lead?.lookingFor
                  ? Object.keys(lead?.lookingFor).map(key =>
                      this.renderRow({
                        key,
                        title: _.startCase(key),
                        value: lead?.lookingFor?.[key],
                      }),
                    )
                  : null}
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
  lead: state.vState[SCREEN_NAME]?.lead,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AboutTab);
