import React from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import _ from 'lodash';

import SearchInput from '../../../Components/Input/SearchInput';
import AppComponent from '../../../Components/RN/AppComponent';
import styles from '../../../Styles/styles';
import PActions from '../../../Stores/redux/Persisted/Actions';
import UnpActions from '../../../Stores/redux/Unpersisted/Actions';
import api from '../../../Services/Api/api';

const {height: HEIGHT} = Dimensions.get('window');
class SearchBar extends AppComponent {
  buyerTypeOptions = [
    {value: '', label: 'Any Buyer'},
    {value: 'Home Owner', label: 'Potential Listings'},
  ];

  creditHistoryOptions = [
    {value: '', label: 'Credit History'},
    {value: 'excellent credit', label: 'Excellent Credit'},
    {value: 'fair credit', label: 'Fair Credit'},
    {value: 'good credit', label: 'Good Credit'},
    {value: 'bad credit', label: 'Bad Credit'},
  ];

  financingOptions = [
    {value: '', label: 'All Financing'},
    {value: '$200,000 or less', label: 'Less Than $200,000'},
    {value: '$250,000', label: '$250,000'},
    {value: '$300,000', label: '$300,000'},
    {value: '$350,000', label: '$350,000'},
    {value: '$400,000', label: '$400,000'},
    {value: '$450,000', label: '$450,000'},
    {value: '$500,000', label: '$500,000'},
    {value: '$550,000', label: '$550,000'},
    {value: '$600,000', label: '$600,000'},
    {value: '$650,000', label: '$650,000'},
    {value: '$700,000', label: '$700,000'},
    {value: '$750,000', label: '$750,000'},
    {value: '$800,000', label: '$800,000'},
    {value: '$850,000', label: '$850,000'},
    {value: '$900,000', label: '$900,000'},
    {value: '$950,000', label: '$950,000'},
    {value: '$1,000,000 +', label: 'More Than $1,000,000'},
  ];

  searchId = 0;
  async handleSearch(q) {
    try {
      const searchId = this.searchId + 1;
      this.searchId = searchId;

      this.props.setScreenState({keyword: q || ''});

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
    this.props.setScreenState({searchType: x, reloadSearch: Date.now()});
  }

  searchKeyword(q) {
    this.props.setScreenState({
      keyword: q,
      reloadSearch: Date.now(),
      buyerType: '',
      creditHistory: '',
      financing: '',
    });
  }

  searchLocation({item, group}) {
    this.props.setScreenState({
      location: item,
      locationGroup: group,
      keyword: '',
      reloadSearch: Date.now(),
      searchSuggestions: null,
    });
  }

  renderSuggestion({item, group}) {
    return (
      <TouchableOpacity
        style={styles.suggestChildWrapper}
        key={item.locationid || item.statename}
        onPress={() => this.searchLocation({item, group})}>
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
      <View style={styles.suggestWrapper}>
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
      <View style={{zIndex: 1}}>
        <View style={styles.browseHeader}>
          <View style={styles.browseSearchContainer}>
            <Image
              source={require('../../../Assets/img/local/whiteSearch.png')}
              style={styles.browseSearchIco}
            />
            <SearchInput
              placeholderTextColor="#FFFFFF"
              key={this.props.reloadSearch}
              value={this.props.keyword}
              onChangeText={this.handleSearch.bind(this)}
              placeholder={'Search here'}
              onSubmitEditing={this.searchKeyword.bind(this)}
              style={styles.browseSearchInput}
              hitSlop={{top: 20, bottom: 10, left: 20, right: 10}}
            />
          </View>

          <View style={styles.qzFilterButton}>
            <TouchableOpacity
              hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}
              style={styles.qzFilterButton}
              onPress={() =>
                this.props.setScreenState({hideFilter: !this.props.hideFilter})
              }>
              <Image
                source={require('../../../Assets/img/local/filter.png')}
                style={styles.qzFilterIco}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.qzFilterRow,
            this.props.hideFilter ? {display: 'none'} : {},
          ]}>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={value =>
              this.props.setScreenState({
                creditHistory: value,
                // reloadSearch: Date.now(),
              })
            }
            onClose={() =>
              this.props.setScreenState({reloadSearch: Date.now()})
            }
            value={this.props.creditHistory || ''}
            items={this.creditHistoryOptions}>
            <View style={styles.qzSelect}>
              <Text style={styles.qzSelectLabel} numberOfLines={1}>
                {this.props.creditHistory
                  ? _.startCase(this.props.creditHistory)
                  : 'Credit History'}
              </Text>
              <Image
                source={require('../../../Assets/img/local/chevron.png')}
                style={styles.qzSelectIco}
              />
            </View>
          </RNPickerSelect>

          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={value =>
              this.props.setScreenState({
                financing: value,
                // reloadSearch: Date.now(),
              })
            }
            onClose={() =>
              this.props.setScreenState({reloadSearch: Date.now()})
            }
            value={this.props.financing || ''}
            items={this.financingOptions}>
            <View style={styles.qzSelect}>
              <Text style={styles.qzSelectLabel} numberOfLines={1}>
                {this.props.financing ? this.props.financing : 'All Financing'}
              </Text>
              <Image
                source={require('../../../Assets/img/local/chevron.png')}
                style={styles.qzSelectIco}
              />
            </View>
          </RNPickerSelect>

          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            onValueChange={value =>
              this.props.setScreenState({
                buyerType: value,
                // reloadSearch: Date.now(),
              })
            }
            onClose={() =>
              this.props.setScreenState({reloadSearch: Date.now()})
            }
            value={this.props.buyerType || ''}
            items={this.buyerTypeOptions}>
            <View style={styles.qzSelect}>
              <Text style={styles.qzSelectLabel} numberOfLines={1}>
                {this.buyerTypeOptions?.find(
                  x => x.value == this.props.buyerType,
                )?.label || 'Any Buyer'}
              </Text>
              <Image
                source={require('../../../Assets/img/local/chevron.png')}
                style={styles.qzSelectIco}
              />
            </View>
          </RNPickerSelect>
        </View>

        {this.props.location ? (
          <View style={{flexDirection:'row',paddingLeft:20,paddingBottom:20,}}>
            <Text style={{color:'#d5eed1',}}>
            <Text>Location: </Text>
            <Text>{`${
              this.props.location?.city ||
              this.props.location?.county ||
              this.props.location?.statename
            }${
              this.props.location?.state ? `, ${this.props.location.state}` : ''
            }`}</Text>
            </Text>
          </View>
        ) : null}

        {searchSuggestions ? (
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#FFF',
              width: '100%',
              height:HEIGHT,
              marginTop:65,
              zIndex:999,
            }}>
            <ScrollView>{searchSuggestionList}</ScrollView>
          </View>
        ) : null}

        <View style={styles.fullTabsContainer}>
          <View style={styles.fullTabs}>
            <TouchableOpacity
              onPress={() => this.handleSearchTypeChange('daily')}
              style={[
                styles.fullTabItem,
                this.props.searchType === 'daily' ? styles.fullTabActive : {},
              ]}>
              <Text
                style={[
                  styles.fullTabText,
                  this.props.searchType === 'daily' ? {fontWeight: '600'} : {},
                ]}>
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.handleSearchTypeChange('legacy')}
              style={[
                styles.fullTabItem,
                this.props.searchType === 'legacy' ? styles.fullTabActive : {},
              ]}>
              <Text
                style={[
                  styles.fullTabText,
                  this.props.searchType === 'legacy' ? {fontWeight: '600'} : {},
                ]}>
                Legacy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const SCREEN_NAME = 'BROWSE_SCREEN';
const mapStateToProps = state => ({
  hideFilter: state.vState[SCREEN_NAME]?.hideFilter,
  searchType: state.vState[SCREEN_NAME]?.searchType || 'daily',
  keyword: state.vState[SCREEN_NAME]?.keyword,
  creditHistory: state.vState[SCREEN_NAME]?.creditHistory,
  financing: state.vState[SCREEN_NAME]?.financing,
  buyerType: state.vState[SCREEN_NAME]?.buyerType,
  location: state.vState[SCREEN_NAME]?.location,
  reloadSearch: state.vState[SCREEN_NAME]?.reloadSearch,
  searchSuggestions: state.vState[SCREEN_NAME]?.searchSuggestions,
});

let some = true;

const mapDispatchToProps = dispatch => ({
  setScreenState: (obj, persist = false, screenName = SCREEN_NAME) =>
    persist
      ? dispatch(PActions.setPScreenState(screenName, obj))
      : dispatch(UnpActions.setVScreenState(screenName, obj)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
