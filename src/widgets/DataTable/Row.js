/* eslint-disable react/forbid-prop-types */

import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';

import { TouchableOpacity } from 'react-native';

import TouchableNoFeedback from './TouchableNoFeedback';

import RefContext from './RefContext';

/**
 * Renders a row of children as outputted by renderCells render prop
 * Tap gesture events will be captured in this component for any taps
 * on cells within this container which do not handle the event themselves.
 *
 * onFocus on a child will scroll the underlying list to this row.
 *
 * Passes two functions to cells to handle focusing the next editable
 * cell.
 * - `getRef(refIndex)` returns a reference to use in an editable cell.
 * - `focusNextCell(refIndex)` - focuses the next editable cell.
 *
 * refIndex: (RowIndex * NumberOfEditableCells) + EditableCellIndexInRow
 *
 * Example, where C = non editable, E = editable.
 * Row1: C C E C C E
 * Row2: C C E C C E
 * Row3: C C E C C E
 *
 * Last editable cell in Row 3 = 2 * 2 + 1
 * First editable cell in Row 2 = 1 * 2 + 0
 *
 * @param {object} rowData Data to pass to renderCells callback
 * @param {string|number} rowKey Unique key associated to row
 * @param {object} rowState State to pass to renderCells callBack
 * @param {func} onPress function to call on pressing the row.
 * @param {object} viewStyle Style object for the wrapping View component
 * @param {boolean} debug Set to `true` to console.log(`Row: ${rowKey}`)
 * @param {number}  rowIndex  index of this row within DataTable.
 * @param {func} renderCells renderProp callBack for rendering cells based on rowData and rowState
 *                          `(rowKey, columnKey) => {...}`
 */
const Row = React.memo(
  ({ rowData, rowState, rowKey, renderCells, style, onPress, debug, rowIndex }) => {
    if (debug) {
      console.log('=================================');
      console.log(`Row: ${rowKey}`);
    }

    const { adjustToTop } = useContext(RefContext);
    const onPressRow = useCallback(onPress ? () => onPress(rowData) : () => {}, [onPress]);
    const onFocus = () => adjustToTop(rowIndex);

    const Container = onPress ? TouchableOpacity : TouchableNoFeedback;
    return (
      <Container onPress={onPressRow} style={style} onFocus={onFocus}>
        {renderCells(rowData, rowState, rowKey, rowIndex)}
      </Container>
    );
  }
);

Row.propTypes = {
  rowData: PropTypes.any.isRequired,
  rowState: PropTypes.any,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  renderCells: PropTypes.func.isRequired,
  style: PropTypes.object,
  onPress: PropTypes.func,
  debug: PropTypes.bool,
  rowIndex: PropTypes.number.isRequired,
};

Row.defaultProps = {
  rowState: null,
  style: {},
  onPress: null,
  debug: true,
};

export default Row;
