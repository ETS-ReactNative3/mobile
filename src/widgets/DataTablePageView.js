/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';

import { newPageStyles } from '../globalStyles';

const { newPageContentContainer, newContainer } = newPageStyles;

const dismiss = () => Keyboard.dismiss();
/**
 * Simple container for a standard data table page.
 */
export const DataTablePageView = props => {
  const { children } = props;
  return (
    <TouchableWithoutFeedback onPress={dismiss}>
      <View style={newPageContentContainer}>
        <View style={newContainer}>{children}</View>
      </View>
    </TouchableWithoutFeedback>
  );
};

DataTablePageView.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DataTablePageView;
