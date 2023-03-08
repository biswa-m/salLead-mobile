import React from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import {connect} from 'react-redux';
import SearchInput from '../../../Components/Input/SearchInput';

import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import api from '../../../Services/Api/api';
import navigationModule from '../../../Modules/navigationModule';

const {height: HEIGHT} = Dimensions.get('window');
const {width} = Dimensions.get('window');

class SearchBar extends AppComponent {
  searchId = 0;
  async handleSearch(q) {
    try {
      const searchId = this.searchId + 1;
      this.searchId = searchId;

      this.props.setScreenState({keyword: q});
      if (!q) {
        this.props.setScreenState({searchSuggestions: null});
      } else if (q.length >= 3) {
        const {
          data: {AjaxSearchCompleteRowSet},
        } = await api.get('index/ajxsrch', {s: q});

        if (this.searchId === searchId)
          this.props.setScreenState({
            searchSuggestions: AjaxSearchCompleteRowSet,
          });
      }
    } catch (e) {
      console.warn(e);
    }
  }

  handleSearchTypeChange(x) {
    this.props.setScreenState({searchType: x});
  }

  searchLeadsFromLocation({item, group}) {
    try {
      this.props.setScreenState(
        {
          location: item,
          locationGroup: group,
          keyword: '',
          searchType: this.props.searchType,
          reloadSearch: Date.now(),
        },
        false,
        'BROWSE_SCREEN',
      );
      navigationModule.exec('navigate', ['/main/browse']);
      this.props.setScreenState({
        searchSuggestions: null,
      });
    } catch (e) {
      console.warn(e);
    }
  }

  searchLeadsFromKeyword(keyword){
    this.props.setScreenState(
      {
        location: null,
        locationGroup: null,
        keyword: keyword,
        searchType: this.props.searchType,
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

  renderSuggestion({item, group}) {
    return (
      <TouchableOpacity
        style={styles.suggestChildWrapper}
        key={item.locationid || item.statename}
        onPress={() => this.searchLeadsFromLocation({item, group})}>
        <View style={styles.suggestDecor}>
          <View style={styles.suggestDecorInner}></View>
        </View>
        <Text style={styles.suggestChild}>{`${
          group === 'strongcity'
            ? `${item.city || ''}, ${item.state || ''}`
            : group === 'county'
            ? `${item.county || ''}, ${item.state || ''}`
            : group === 'state'
            ? `${item.statename || ''}`
            : ''
        }`}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      props: {searchSuggestions},
    } = this;

    const searchSuggestionList = (
      <View style={[styles.suggestWrapper, {}]}>
        <View style={{width:'100%',height:15,}}></View>
        {searchSuggestions?.strongcity?.length ? (
          <View style={styles.suggestSection}>
            <View style={[styles.suggestTitleWrapper]}>
              <Text style={styles.suggestTitle}>City Hits</Text>
            </View>
            {searchSuggestions?.strongcity?.map(item =>
              this.renderSuggestion({item, group: 'strongcity'}),
            )}
          </View>
        ) : null}
        {searchSuggestions?.county?.length ? (
          <View style={styles.suggestSection}>
            <View style={styles.suggestTitleWrapper}>
              <Text style={styles.suggestTitle}>County Hits</Text>
            </View>
            {searchSuggestions?.county?.map(item =>
              this.renderSuggestion({item, group: 'county'}),
            )}
          </View>
        ) : null}
        {searchSuggestions?.state?.length ? (
          <View style={styles.suggestSection}>
            <View style={styles.suggestTitleWrapper}>
              <Text style={styles.suggestTitle}>State Hits</Text>
            </View>
            {searchSuggestions?.state?.map(item =>
              this.renderSuggestion({item, group: 'state'}),
            )}
          </View>
        ) : null}
      </View>
    );

    return (
      <View style={styles.searchUnitMain}>
        <View style={styles.bionicTabs}>
          <TouchableOpacity
            hitSlop={{top: 20, bottom: 20, left: 20, right: 10}}
            onPress={() => this.handleSearchTypeChange('daily')}
            style={[{width:80,height:27,alignItems:'center',justifyContent:'center',borderRadius:6,marginRight:15,}, this.props.searchType === 'daily' ? {backgroundColor:'#20A40D'} : {backgroundColor:'#d5eed1'}]}>
            <Text
              style={[
                {fontWeight: '500',fontSize:10,},
                this.props.searchType === 'daily' ? {color:'#FFFFFF'} : {color:'#20A40D'},
              ]}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}
            onPress={() => this.handleSearchTypeChange('legacy')}
            style={[{width:80,height:27,alignItems:'center',justifyContent:'center',borderRadius:6,}, this.props.searchType === 'legacy' ? {backgroundColor:'#20A40D'} : {backgroundColor:'#d5eed1'}]}>
            <Text
              style={[
                {fontWeight: '500',fontSize:10,},
                this.props.searchType === 'legacy' ? {color:'#FFFFFF'} : {color:'#20A40D'},
              ]}>
              Legacy
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputContainer}>
          <Image source={require('../../../Assets/img/local/search.png')} style={styles.qzInputIco}/>
          <SearchInput
            placeholderTextColor='#A0B2C8'
            onChangeText={this.handleSearch.bind(this)}
            placeholder="Search Here"
            onSubmitEditing={this.searchLeadsFromKeyword.bind(this)}
            style={styles.searchInput}
            hitSlop={{top: 3, bottom: 20, left: 20, right: 300}}
            fromScreen={'home'}
          />
        </View>

        {searchSuggestions ? (
          <View
            style={{
              position: 'absolute',
              marginHorizontal:-20,
              width:width-40,
              maxHeight: HEIGHT / 2,
              marginTop:93,
              backgroundColor:'#FFFFFF',
              shadowColor: '#000000',
              shadowOffset: {width: 0, height: 3},
              shadowOpacity: 0.16,
              shadowRadius: 4,
              borderBottomLeftRadius:10,
              borderBottomRightRadius:10,
            }}>
            <ScrollView>{searchSuggestionList}</ScrollView>
          </View>
        ) : null}
      </View>
    );
  }
}

const SCREEN_NAME = 'HOME_SCREEN';
const mapStateToProps = state => ({
  searchType: state.vState[SCREEN_NAME]?.searchType,
  searchSuggestions: state.vState[SCREEN_NAME]?.searchSuggestions,
});

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
