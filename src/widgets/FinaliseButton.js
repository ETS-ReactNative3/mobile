/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import globalStyles from '../globalStyles';
import { navStrings } from '../localization';

export const FinaliseButton = props => {
  const { isFinalised, onPress } = props;

  if (isFinalised) {
    return (
      <View style={[globalStyles.navBarRightContainer, localStyles.outerContainer]}>
        <Text style={[globalStyles.navBarText, localStyles.text]}>
          {navStrings.finalised_cannot_be_edited}
        </Text>
        <Icon name="lock" style={globalStyles.finalisedLock} />
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={[globalStyles.navBarRightContainer, localStyles.outerContainer]}
      onPress={onPress}
    >
      <Text style={[globalStyles.navBarText, localStyles.text]}>{navStrings.finalise}</Text>
      <Icon name="check-circle" style={globalStyles.finaliseButton} />
    </TouchableOpacity>
  );
};

export default FinaliseButton;

/* eslint-disable react/require-default-props, react/default-props-match-prop-types */
FinaliseButton.propTypes = {
  isFinalised: PropTypes.bool.isRequired,
  onPress: PropTypes.func,
};

FinaliseButton.defaultProps = {
  isFinalised: false,
};

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56; // Taken from NavigationExperimental
const localStyles = StyleSheet.create({
  outerContainer: {
    height: APPBAR_HEIGHT,
  },
  text: {
    bottom: 12,
  },
});
