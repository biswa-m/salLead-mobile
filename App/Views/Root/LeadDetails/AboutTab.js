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
import {DateTime} from 'luxon';

class AboutTab extends AppComponent {
  renderRow({title, value, ico, render}) {
    if (!value) return null;

    return (
      <View style={styles.leadDetailContextRow} key={title}>
        <Image source={ico} style={styles.leadDetailContextIco} />

        <View style={styles.LeadDetailContext}>
          <Text style={styles.leadDetailContextLabel}>{title}</Text>
          {render ? (
            render(item)
          ) : (
            <Text style={styles.leadDetailContextValue}>
              {value?.toString()}
            </Text>
          )}
        </View>
      </View>
    );
  }

  render() {
    const {
      props: {item},
    } = this;

    const aboutMeCoulumns = [
      {
        title: 'I Live In',
        ico: require('../../../Assets/img/detail/pinIcon.png'),
        value: `${item.city}, ${item.state}`,
      },
      {
        title: 'My Preferred Area',
        ico: require('../../../Assets/img/detail/mapIcon.png'),
        value: `${item.lookingAtCity}, ${item.lookingAtState}`,
      },
      {
        title: 'My Credit History',
        ico: require('../../../Assets/img/detail/creditIco.png'),
        value: item.creditHistory,
      },
      {
        title: 'I Currently',
        ico: require('../../../Assets/img/detail/homeIco.png'),
        value: '',
      },
      {
        title: 'My Home Value',
        ico: require('../../../Assets/img/detail/homeIco.png'),
        value: '',
      },
      {
        title: 'My Income Range',
        ico: require('../../../Assets/img/detail/incomeIco.png'),
        value: '$' + item.income + 'K',
      },
      {
        title: 'Cashon Hand',
        ico: require('../../../Assets/img/detail/incomeIco.png'),
        value: '',
      },
      {
        title: 'Move Timeframe',
        ico: require('../../../Assets/img/detail/homeIco.png'),
        value: '',
      },
      {
        title: 'Date Added',
        ico: require('../../../Assets/img/detail/homeIco.png'),
        value: DateTime.fromMillis(parseInt(item.ts)).toFormat('LLL dd yyyy, hh:mm a'),
      },
    ];
    const lookingForColumns = [
      {
        title: 'Purchase Price',
        ico: require('../../../Assets/img/detail/incomeIco.png'),
        value: `${
          item.minBudget
            ? `$${item.minBudget?.toLocaleString()}-$${item.budget?.toLocaleString()}`
            : `less than $${item.budget?.toLocaleString()}`
        }`,
      },
    ];

    return (
      <View style={styles.tabContextParent}>
        <View style={styles.tabContextInner}>
          <ScrollView style={[styles.fill, styles.bgLight]}>
            <View style={styles.detailContextWrapperParent}>
              <View style={styles.detailContextWrapper}>
                {/* <View>
                  <Text>About Me</Text>
                </View> */}

                {aboutMeCoulumns.map(x => this.renderRow(x))}
              </View>
            </View>

            <View style={styles.contextCategoryBox}>
              <Text style={styles.contextCategoryLabel}>Looking For</Text>
            </View>

            <View style={styles.detailContextWrapperParent}>
              <View style={styles.detailContextWrapper}>
                {lookingForColumns.map(x => this.renderRow(x))}
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutTab);
