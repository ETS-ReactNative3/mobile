/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';

import { Button } from 'react-native-ui-components';

import globalStyles, { SHADOW_BORDER, BACKGROUND_COLOR } from '../globalStyles';
import { gotoPrescriptions, gotoPrescribers, gotoPatients } from '../navigation/actions';

const Dispensing = ({ toPrescriptions, toPrescribers, toPatients }) => {
  const { menuButton, menuButtonText: buttonText } = globalStyles;
  const { flexOne, middleColumn, mainContainer, buttonContainer } = localStyles;

  const MenuButton = useCallback(
    props => <Button style={menuButton} textStyle={buttonText} {...props} />,
    []
  );

  return (
    <View style={mainContainer}>
      <View style={flexOne} />
      <View style={middleColumn}>
        <View style={flexOne} />
        <View style={buttonContainer}>
          <MenuButton text="Prescriptions" onPress={toPrescriptions} />
          <MenuButton text="Prescribers" onPress={toPrescribers} />
          <MenuButton text="Patients" onPress={toPatients} />
        </View>
        <View style={flexOne} />
      </View>
      <View style={flexOne} />
    </View>
  );
};

const mapDispatchToProps = dispatch => ({
  toPrescriptions: () => dispatch(gotoPrescriptions()),
  toPrescribers: () => dispatch(gotoPrescribers()),
  toPatients: () => dispatch(gotoPatients()),
});

export const DispensingPage = connect(null, mapDispatchToProps)(Dispensing);

Dispensing.propTypes = {
  toPrescriptions: PropTypes.func.isRequired,
  toPrescribers: PropTypes.func.isRequired,
  toPatients: PropTypes.func.isRequired,
};

const localStyles = {
  flexOne: { flex: 1 },
  middleColumn: { flex: 0.75, flexDirection: 'column' },
  mainContainer: { backgroundColor: BACKGROUND_COLOR, flexDirection: 'row', flex: 1 },
  buttonContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SHADOW_BORDER,
    backgroundColor: 'white',
  },
};