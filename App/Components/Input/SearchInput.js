import React from 'react';
import {TextInput, View, TouchableOpacity, Text} from 'react-native';
import styles from '../../Styles/styles';
import AppComponent from '../RN/AppComponent';

class SearchInput extends AppComponent {
  state = {q: this.props.value};

  timer = null;
  handleTextChange(text) {
    clearTimeout(this.timer);
    this.setState({q: text});

    this.timer = setTimeout(() => {
      this.props.onChangeText(text);
    }, 100);
  }

  inputRef = React.createRef(null);

  render() {
    const {
      state: {q},
    } = this;
    console.log('Find Right Below')
    console.log(this.props);

    return (
      <View style={styles.searchInputWrapperify}>
      <TextInput
        
        {...{
          returnKeyType: 'search',
          ...this.props,
          ref: this.inputRef,
          value: q || '',
          onChangeText: this.handleTextChange.bind(this),
          onSubmitEditing: () => this.props.onSubmitEditing?.(q || ''),
        }}
      />


      {
        this.props.fromScreen == 'home' && q ? 
        <TouchableOpacity hitSlop={{top: 15, bottom: 15, left: 15, right: 15}} style={[styles.clearInput, {right:0,backgroundColor:'#cccccc'}]} onPress={() => this.handleTextChange.bind(this)('')}>
          <View style={styles.clearInputDecor1}></View>
          <View style={styles.clearInputDecor2}></View>
        </TouchableOpacity>
        : 
        q ? 
          <TouchableOpacity hitSlop={{top: 15, bottom: 15, left: 15, right: 15}} style={styles.clearInput} onPress={() => this.handleTextChange.bind(this)('')}>
            <View style={styles.clearInputDecor1}></View>
            <View style={styles.clearInputDecor2}></View>
          </TouchableOpacity>
          :<View></View>
      }
        
      </View>
    );
  }
}

export default SearchInput;
