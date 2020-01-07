/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { getItemLayout, getPageDispatchers } from './dataTableUtilities';

import { DataTable, DataTableHeaderRow, DataTableRow } from '../widgets/DataTable';

import globalStyles from '../globalStyles';
import { useSyncListener } from '../hooks';

import { DataTablePageView, SearchBar } from '../widgets';

import { ItemDetails } from '../widgets/modals/ItemDetails';

import { ROUTES } from '../navigation/constants';
import { generalStrings, tableStrings } from '../localization';

/**
 * Renders a mSupply mobile page with Items and their stock levels.
 *
 * State:
 * Uses a reducer to manage state with `backingData` being a realm results
 * of items to display. `data` is a plain JS array of realm objects. data is
 * hydrated from the `backingData` for displaying in the interface.
 * i.e: When filtering, data is populated from filtered items of `backingData`.
 *
 * dataState is a simple map of objects corresponding to a row being displayed,
 * holding the state of a given row. Each object has the shape :
 * { isSelected, isFocused, isDisabled },
 */
export const Stock = ({
  data,
  dataState,
  sortKey,
  isAscending,
  selectedRow,
  searchTerm,
  keyExtractor,
  columns,
  refreshData,
  onSelectRow,
  onDeselectRow,
  onFilterData,
  onSortColumn,
}) => {
  //  Refresh data on retrieving item or itembatch records from sync.
  useSyncListener(refreshData, ['Item', 'ItemBatch']);

  const renderRow = useCallback(
    listItem => {
      const { item, index } = listItem;
      const rowKey = keyExtractor(item);
      return (
        <DataTableRow
          rowData={data[index]}
          rowState={dataState.get(rowKey)}
          rowKey={rowKey}
          columns={columns}
          rowIndex={index}
          onPress={onSelectRow}
        />
      );
    },
    [data, dataState]
  );

  const renderHeader = () => (
    <DataTableHeaderRow
      columns={columns}
      onPress={onSortColumn}
      isAscending={isAscending}
      sortKey={sortKey}
    />
  );

  const { pageTopSectionContainer } = globalStyles;
  return (
    <DataTablePageView captureUncaughtGestures={false}>
      <View style={pageTopSectionContainer}>
        <SearchBar
          onChangeText={onFilterData}
          value={searchTerm}
          onFocusOrBlur={selectedRow && onDeselectRow}
          placeholder={`${generalStrings.search_by} ${tableStrings.name || tableStrings.item_code}`}
        />
      </View>

      <DataTable
        data={data}
        extraData={dataState}
        renderRow={renderRow}
        renderHeader={renderHeader}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        columns={columns}
      />

      <ItemDetails isOpen={!!selectedRow} item={selectedRow} onClose={onDeselectRow} />
    </DataTablePageView>
  );
};

const mapDispatchToProps = (dispatch, ownProps) =>
  getPageDispatchers(dispatch, ownProps, '', ROUTES.STOCK);

const mapStateToProps = state => {
  const { pages } = state;

  const { stock } = pages;
  return stock;
};

export const StockPage = connect(mapStateToProps, mapDispatchToProps)(Stock);

Stock.defaultProps = {
  selectedRow: null,
};

Stock.propTypes = {
  data: PropTypes.array.isRequired,
  dataState: PropTypes.object.isRequired,
  sortKey: PropTypes.string.isRequired,
  isAscending: PropTypes.bool.isRequired,
  selectedRow: PropTypes.object,
  searchTerm: PropTypes.string.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  refreshData: PropTypes.func.isRequired,
  onSelectRow: PropTypes.func.isRequired,
  onDeselectRow: PropTypes.func.isRequired,
  onFilterData: PropTypes.func.isRequired,
  onSortColumn: PropTypes.func.isRequired,
};
