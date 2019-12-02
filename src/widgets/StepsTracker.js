/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';

import { WHITE, SUSSOL_ORANGE, GREY, APP_FONT_FAMILY } from '../globalStyles';

const { height, width } = Dimensions.get('window');

const getLocalStyles = (step, numberOfSteps, currentStep) => ({
  stepContainer: {
    borderRadius: height / 20,
    borderWidth: 2,
    borderColor: step > currentStep ? GREY : SUSSOL_ORANGE,
    width: width / 33,
    height: height / 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: currentStep === step ? SUSSOL_ORANGE : WHITE,
  },
  stepNumber: {
    color: step > currentStep ? GREY : (step === currentStep && 'white') || SUSSOL_ORANGE,
    fontSize: 20,
    fontFamily: APP_FONT_FAMILY,
  },
  stepText: {
    color: step > currentStep ? GREY : SUSSOL_ORANGE,
    fontSize: 20,
    fontFamily: APP_FONT_FAMILY,
    paddingLeft: 20,
  },
  stepSeperator: {
    borderTopColor: step > currentStep ? GREY : SUSSOL_ORANGE,
    borderTopWidth: 2,
    marginHorizontal: 20,
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: step === numberOfSteps - 1 ? 0 : 1,
  },
});

const StepNumber = ({ step, numberOfSteps, currentStep, title, onPress }) => {
  const { stepContainer, stepNumber, stepText, stepSeperator, container } = getLocalStyles(
    step,
    numberOfSteps,
    currentStep
  );

  const lastStep = step === numberOfSteps - 1;
  const completedStep = currentStep > step;
  const Container = completedStep ? TouchableOpacity : View;

  const wrappedOnPress = () => onPress(step - 1);

  return (
    <Container onPress={wrappedOnPress} style={container}>
      <View style={stepContainer}>
        <Text style={stepNumber}>{step + 1}</Text>
      </View>

      <Text adjustsFontSizeToFit ellipsizeMode="tail" numberOfLines={1} style={stepText}>
        {title}
      </Text>

      {lastStep && <View style={stepSeperator} />}
    </Container>
  );
};

StepNumber.propTypes = {
  step: PropTypes.number.isRequired,
  numberOfSteps: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

export const StepsTracker = ({ numberOfSteps, currentStep, titles, onPress }) => (
  <View style={{ flexDirection: 'row' }}>
    {Array.from({ length: numberOfSteps }).map((_, i) => (
      <StepNumber
        onPress={onPress}
        step={i}
        numberOfSteps={numberOfSteps}
        currentStep={currentStep}
        title={titles[i]}
        key={`${i}`}
      />
    ))}
  </View>
);

StepsTracker.propTypes = {
  numberOfSteps: PropTypes.number.isRequired,
  currentStep: PropTypes.number.isRequired,
  titles: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired,
};
