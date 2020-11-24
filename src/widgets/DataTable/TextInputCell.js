/* eslint-disable no-unused-expressions */
/* eslint-disable react/forbid-prop-types */
import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, Keyboard } from 'react-native';

import Cell from './Cell';
import RefContext from './RefContext';

import { getAdjustedStyle } from './utilities';

/**
 * Renders a cell that on press or focus contains a TextInput for
 * editing values.
 *
 * @param {string|number} value      The value to render in cell
 * @param {string|number} rowKey     Unique key associated to row cell is in
 * @param {string|number} columnKey  Unique key associated to column cell is in
 * @param {bool} isDisabled          If `true` will render a plain Cell element with no interaction
 * @param {String} placeholderColor  Placeholder text color
 * @param {Object}  viewStyle        Style object for the wrapping View component
 * @param {Object}  textStyle        Style object for the inner Text component
 * @param {Object}  textInputStyle   Style object for TextInput component.
 * @param {Number}  width            Optional flex property to inject into styles.
 * @param {bool}    debug            Logs rendering of this component.
 * @param {string}  keyboardType     Type of keyboard for the TextInput.
 * @param {string}  placeholder      placeholder text
 * @param {Object} cellTextStyle     text style for the disabled Cell component.
 * @param {Bool}  isLastCell         Indicator if this cell is last in a row,
 *                                   removing the borderRight,
 * @param {Func}  onChangeText       Callback for the onChangeText event.
 * @param {String} underlineColor    Underline color of TextInput on Android.
 */
const TextInputCell = React.memo(
  ({
    value,
    rowKey,
    columnKey,
    isDisabled,
    placeholderColor,
    onChangeText,
    isLastCell,
    width,
    debug,
    keyboardType,
    placeholder,
    viewStyle,
    rowIndex,
    textInputStyle,
    cellTextStyle,
    underlineColor,
    onFocus,
  }) => {
    if (debug) console.log(`- TextInputCell: ${value}`);
    const usingPlaceholder = placeholder && !value;

    const { focusNextCell, getRefIndex, getCellRef, adjustToTop } = React.useContext(RefContext);
    const refIndex = getRefIndex(rowIndex, columnKey);
    const ref = getCellRef(refIndex);

    const onEdit = newValue => onChangeText(newValue, rowKey, columnKey);
    const focusNext = () => focusNextCell(refIndex);

    // Scrolls the parent scroll view such that this row is near the top of the data table,
    // which should ensure it is above the keyboard - without it, if the row is in a position
    // which will be behind the keyboard once it appears, the keyboard will show then disappear
    // jankily.
    const showAboveKeyboard = rowIdx => adjustToTop(rowIdx);

    const onFocusCell = useCallback(() => {
      onFocus?.(rowKey);
      showAboveKeyboard(rowIndex);
    }, [rowKey, rowIndex]);

    useEffect(() => {
      Keyboard.addListener('keyboardDidHide', () => ref?.current?.blur());
      return () => Keyboard.removeListener('keyboardDidHide', () => ref?.current?.blur());
    }, []);

    // Render a plain Cell if disabled.
    if (isDisabled) {
      return (
        <Cell
          key={columnKey}
          viewStyle={viewStyle}
          textStyle={cellTextStyle}
          value={value}
          width={width}
          isLastCell={isLastCell}
        />
      );
    }

    const internalViewStyle = getAdjustedStyle(viewStyle, width, isLastCell);
    const internalTextStyle = getAdjustedStyle(textInputStyle, width);

    // Render a Cell with a textInput.
    return (
      <View style={internalViewStyle}>
        <TextInput
          ref={ref}
          placeholder={placeholder}
          style={internalTextStyle}
          value={usingPlaceholder ? '' : String(value)}
          placeholderTextColor={placeholderColor}
          onChangeText={onEdit}
          onSubmitEditing={focusNext}
          underlineColorAndroid={underlineColor}
          keyboardType={keyboardType}
          blurOnSubmit={false}
          selectTextOnFocus
          onFocus={onFocusCell}
        />
      </View>
    );
  }
);

TextInputCell.propTypes = {
  onFocus: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  columnKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isDisabled: PropTypes.bool,
  placeholderColor: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  cellTextStyle: PropTypes.object,
  viewStyle: PropTypes.object,
  width: PropTypes.number,
  textInputStyle: PropTypes.object,
  isLastCell: PropTypes.bool,
  debug: PropTypes.bool,
  placeholder: PropTypes.string,
  rowIndex: PropTypes.number.isRequired,
  underlineColor: PropTypes.string,
  keyboardType: PropTypes.oneOf([
    'default',
    'number-pad',
    'decimal-pad',
    'numeric',
    'email-address',
    'phone-pad',
  ]),
};

TextInputCell.defaultProps = {
  value: '',
  isDisabled: false,
  viewStyle: {},
  cellTextStyle: {},
  textInputStyle: {},
  isLastCell: false,
  width: 0,
  debug: false,
  keyboardType: 'numeric',
  placeholder: '',
  placeholderColor: '#CDCDCD',
  underlineColor: '#CDCDCD',
  onFocus: null,
};

export default TextInputCell;
