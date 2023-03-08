import React from 'react';
import {ScrollView, View, Image, TouchableOpacity, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import ClaimStats from '../../Components/ClaimStats';
import LeadList from './LeadList';
import navigationModule from '../../../Modules/navigationModule';

class HomeScreen extends AppComponent {
  handleSearch(q) {
    console.log(q);
  }

  render() {
    const {user, account} = this.props.AUTH || {};
    return (
      <View style={styles.bgFill}>
        <View style={[styles.qzHeader, styles.qzHeaderCurved]}>
          <SafeAreaView edges={['top']}>
            <View style={styles.qzHeaderTop}>
              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity onPress={() => navigationModule.exec('navigate', ['/main/alerts']) } style={styles.qzHeaderButtonSmall} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  <Image source={require('../../../Assets/img/local/alert.png')} style={styles.qzHeaderButtonSmallIco}/>
                </TouchableOpacity>
              </View>
              <Text style={styles.screenTitle}>My Leads</Text>
              <View style={styles.qzHeaderButtonSmall}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigationModule.exec('navigate', ['/main/profile']) } style={styles.qzHeaderButtonSmall} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                  {
                    account?.profileImageLargeUrl ? 
                    <Image source={{uri: account?.profileImageLargeUrl}} style={styles.qzHeaderAvatarIco}/>
                    :
                    <Text style={styles.qzUserLoggedText}>{user && user.userName ? user.userName.slice(0, 2).toUpperCase() : 'MY'}</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.qzBanner}>
              <Image source={require('../../../Assets/img/local/banner.png')} style={styles.qzBannerIco}/>
              <Image source={require('../../../Assets/img/local/banner.png')} style={styles.qzBannerIco}/>
              <Image source={require('../../../Assets/img/local/banner.png')} style={styles.qzBannerIco}/>
              <Image source={require('../../../Assets/img/local/banner.png')} style={styles.qzBannerIco}/>
            </View>
            <View style={styles.qzHeaderSpaceMl}></View>
          </SafeAreaView>
        </View>

        <View style={styles.containerOffsetMl}>
          <View style={styles.pad20}>
            <View style={styles.shadowBox}>
              <ClaimStats />
            </View>
          </View>
        </View>

          <View style={styles.fill}>
            
            <LeadList />

          </View>
      
      </View>
    );
  }
}

const SCREEN_NAME = 'MY_LEADS_SCREEN';
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
