import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import ClaimStats from '../../Components/ClaimStats';
import SearchBar from './SearchBar';
import LeadList from './LeadList';
import {ScrollView, Text, View, Image, TouchableOpacity} from 'react-native';
import navigationModule from '../../../Modules/navigationModule';
import {fetchMyProfile} from '../../../Modules/auth/startup';

class HomeScreen extends AppComponent {
  constructor(props) {
    super(props);

    this._onFocus = this._onFocus.bind(this);
  }
  seeMoreLeads(searchType) {
    this.props.setScreenState(
      {
        keyword: '',
        searchType,
        reloadSearch: Date.now(),
      },
      false,
      'BROWSE_SCREEN',
    );
    navigationModule.exec('navigate', ['/main/browse']);
    this.props.setScreenState({
      searchSuggestions: null,
    });
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', this._onFocus);
    this.onMount();
  }

  componentWillUnmount() {
    this.props.navigation.removeListener('focus', this._onFocus);
    this.onUnmount();
  }

  _onFocus() {
    this.props.setScreenState({focused: Date.now()});
    fetchMyProfile().catch(console.warn);
  }

  render() {
    const {user, account} = this.props.AUTH || {};
    return (
      <View style={styles.bgFill}>
        <View style={[styles.qzHeader, styles.qzHeaderCurved]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.qzHeaderTop}>
              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity
                  onPress={() =>
                    navigationModule.exec('navigate', ['/main/alerts'])
                  }
                  style={styles.qzHeaderButtonSmall}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image
                    source={require('../../../Assets/img/local/alert.png')}
                    style={styles.qzHeaderButtonSmallIco}
                  />
                </TouchableOpacity>
              </View>

              <Text style={{fontSize: 25, color: 'white', fontWeight: '700'}}>
                𝕊𝕒𝕝𝕃𝕖𝕒𝕕
              </Text>

              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigationModule.exec('navigate', ['/main/profile'])
                  }
                  style={styles.qzHeaderButtonSmall}
                  hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  {account?.photo ? (
                    <Image
                      source={{uri: account?.photo}}
                      style={styles.qzHeaderAvatarIco}
                    />
                  ) : (
                    <Text style={styles.qzUserLoggedText}>
                      {user && user.fullName
                        ? user.fullName.slice(0, 2).toUpperCase()
                        : 'MY'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.qzBanner}>
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
              <Image
                source={require('../../../Assets/img/local/banner.png')}
                style={styles.qzBannerIco}
              />
            </View>
            <View style={styles.qzHeaderSpace}></View>
          </SafeAreaView>
        </View>
        <View style={[styles.containerOffset, {zIndex: 1}]}>
          <View style={styles.pad20}>
            <View style={styles.shadowBox}>
              <SearchBar />
              <ClaimStats />
            </View>
          </View>
        </View>

        <ScrollView nestedScrollEnabled bounces={false}>
          <View style={styles.categoryBox}>
            <Text style={styles.categoryLabel}>Daily Leads</Text>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
              <Text
                style={styles.categoryLink}
                onPress={() => this.seeMoreLeads('daily')}>
                See More
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LeadList searchType="daily" />
          </ScrollView>

          <View style={styles.categoryBox}>
            <Text style={styles.categoryLabel}>Legacy Leads</Text>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
              onPress={() => this.seeMoreLeads('legacy')}>
              <Text style={styles.categoryLink}>See More</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LeadList searchType="legacy" />
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

const SCREEN_NAME = 'HOME_SCREEN';
const mapStateToProps = state => ({
  AUTH: state.pState.AUTH,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
