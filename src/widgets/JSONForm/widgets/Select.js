/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Picker } from '@react-native-picker/picker';

import { SUSSOL_ORANGE } from '../../../globalStyles/colors';

export const Select = ({ disabled, readonly, onChange, placeholder, options, value }) => {
  let pickers = options.enumOptions.map(({ label, value: enumValue }) => (
    <Picker.Item key={label} label={label} value={enumValue} color={SUSSOL_ORANGE} />
  ));

  const placeholderItem = (
    <Picker.Item key={placeholder} label={placeholder} value={placeholder} color={SUSSOL_ORANGE} />
  );

  pickers = [placeholderItem, ...pickers];

  return (
    <Picker
      mode="dropdown"
      enabled={!(disabled || readonly)}
      selectedValue={value}
      onValueChange={chosenValue => {
        // There is a requirement for 'empty'/placeholder entries to call on change with
        // undefined: https://github.com/rjsf-team/react-jsonschema-form/pull/451/files
        // however the placeholder value is passed by default as an empty string.
        if (chosenValue === '') onChange(undefined);
        else onChange(chosenValue);
      }}
    >
      {pickers}
    </Picker>
  );
};

Select.defaultProps = {
  readonly: false,
  value: '',
};

Select.propTypes = {
  options: PropTypes.object.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  readonly: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
};
