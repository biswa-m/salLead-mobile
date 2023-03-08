import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

class AppModal extends Component {
  render() {
    const {
      props: {close},
    } = this;

    return (
      <Modal
        onSwipeComplete={close}
        swipeDirection={['down']}
        onBackdropPress={close}
        style={styles.modal}
        {...this.props}>
        {this.props.children}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    // justifyContent: 'flex-end',
    margin: 0,
  },
});

export default AppModal;
