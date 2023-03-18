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
import leadModule from '../../../Modules/lead/leadModule';

const {height: HEIGHT} = Dimensions.get('window');
class SearchBar extends AppComponent {
  buyerTypeOptions = [
    {value: 'Home Buyer', label: 'Any Buyer'},
    {value: 'Home Owner', label: 'Potential Listings'},
  ];

  creditHistoryOptions = [
    {value: '', label: 'Credit History'},
    {value: 'excellent', label: 'Excellent Credit'},
    {value: 'fair', label: 'Fair Credit'},
    {value: 'good', label: 'Good Credit'},
    {value: 'bad', label: 'Bad Credit'},
  ];

  financingOptions = [
    {value: '', label: 'All Financing'},
    {value: '0,200000', label: 'Less Than $200,000', miniLabel: '$200,000'},
    {value: '200000,250000', label: '$250,000', miniLabel: '$250,000'},
    {value: '250000,300000', label: '$300,000', miniLabel: '$300,000'},
    {value: '300000,350000', label: '$350,000', miniLabel: '$350,000'},
    {value: '350000,400000', label: '$400,000', miniLabel: '$400,000'},
    {value: '400000,450000', label: '$450,000', miniLabel: '$450,000'},
    {value: '450000,500000', label: '$500,000', miniLabel: '$500,000'},
    {value: '500000,550000', label: '$550,000', miniLabel: '$550,000'},
    {value: '550000,600000', label: '$600,000', miniLabel: '$600,000'},
    {value: '600000,650000', label: '$650,000', miniLabel: '$650,000'},
    {value: '650000,700000', label: '$700,000', miniLabel: '$700,000'},
    {value: '700000,750000', label: '$750,000', miniLabel: '$750,000'},
    {value: '750000,800000', label: '$800,000', miniLabel: '$800,000'},
    {value: '800000,850000', label: '$850,000', miniLabel: '$850,000'},
    {value: '850000,900000', label: '$900,000', miniLabel: '$900,000'},
    {value: '900000,950000', label: '$950,000', miniLabel: '$950,000'},
    {
      value: '1000000,0',
      label: 'More Than $1,000,000',
      miniLabel: '$1,000,000',
    },
  ];

  searchId = 0;
  async handleSearch(q) {
    try {
      const searchId = this.searchId + 1;
      this.searchId = searchId;

      this.props.setScreenState({keyword: q || ''});

      if (!q) {
        this.props.setScreenState({searchSuggestions: null});
      } else {
        const locations = await leadModule.searchLocation(q);

        if (this.searchId === searchId)
          this.props.setScreenState({
            searchSuggestions: locations,
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
        key={item.address}
        onPress={() => this.searchLocation({item, group})}>
        <View style={styles.suggestDecor}>
          <View style={styles.suggestDecorInner}></View>
        </View>
        <Text style={styles.suggestChild}>{item.address}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const {
      props: {searchSuggestions},
    } = this;

    const searchSuggestionList = (
      <View style={styles.suggestWrapper}>
        <View style={{width: '100%', height: 15}}></View>
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
                {this.props.financing
                  ? this.financingOptions.find(
                      x => x.value == this.props.financing,
                    )?.miniLabel
                  : 'All Financing'}
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
                )?.label || 'Select'}
              </Text>
              <Image
                source={require('../../../Assets/img/local/chevron.png')}
                style={styles.qzSelectIco}
              />
            </View>
          </RNPickerSelect>
        </View>

        {this.props.location ? (
          <View
            style={{flexDirection: 'row', paddingLeft: 20, paddingBottom: 20}}>
            <Text style={{color: '#d5eed1'}}>
              <Text>Location: </Text>
              <Text>{this.props.location?.address}</Text>
            </Text>
          </View>
        ) : null}

        {searchSuggestions ? (
          <View
            style={{
              position: 'absolute',
              backgroundColor: '#FFF',
              width: '100%',
              height: HEIGHT,
              marginTop: 65,
              zIndex: 999,
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
