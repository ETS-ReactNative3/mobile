/* @flow weak */

/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2016
 */

import React from 'react';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { BottomModal } from './BottomModal';
import
{
  DARK_GREY,
  PAGE_CONTENT_PADDING_HORIZONTAL,
} from '../../globalStyles';

/**
 * A modal that can be displayed over the page content container, rendering any children
 * about two thirds of the way up, and a cross in the top right to close
 * @prop {boolean}    isOpen    Whether the modal is open
 * @prop {function}   onClose   A function to call if the close x is pressed
 * @prop {element}    children  The components to render within the modal
 */
export class PageContentModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryText: '',
    };
  }

  render() {
    const {
      onClose,
      ...modalProps,
    } = this.props;

    return (
      <BottomModal {...modalProps}
        style={localStyles.modal}
      >
        <TouchableOpacity onPress={onClose} style={localStyles.closeButton}>
          <Icon name="md-close" style={localStyles.closeIcon} />
        </TouchableOpacity>
        <View style={localStyles.childrenContainer}>
          {this.props.children}
        </View>
      </BottomModal>
     );
  }
}

PageContentModal.propTypes = {
  children: React.PropTypes.element,
  isOpen: React.PropTypes.bool.isRequired,
  onClose: React.PropTypes.func,
};
PageContentModal.defaultProps = {
  style: {},
  swipeToClose: false, // negating the default.
  backdropPressToClose: false, // negating the default.
  position: 'bottom',
  backdrop: false,
};

const localStyles = StyleSheet.create({
  modal: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width - 2 * PAGE_CONTENT_PADDING_HORIZONTAL,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: DARK_GREY,
    opacity: 0.88,
  },
  childrenContainer: {
    flex: 1,
    position: 'absolute', // Otherwise it moves depending on size of autocomplete results
    top: 170,
    left: PAGE_CONTENT_PADDING_HORIZONTAL,
    right: PAGE_CONTENT_PADDING_HORIZONTAL - 7, // TODO get rid of -7
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  closeIcon: {
    fontSize: 36,
    color: 'white',
  },
});