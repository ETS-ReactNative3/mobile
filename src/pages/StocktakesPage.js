/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import PropTypes from 'prop-types';

import { GenericPage } from './GenericPage';

import { buttonStrings, modalStrings, navStrings, tableStrings } from '../localization';
import { formatStatus } from '../utilities';
import { PageButton, BottomConfirmModal, ToggleBar } from '../widgets';

import globalStyles from '../globalStyles';

const DATA_TYPES_SYNCHRONISED = ['Stocktake'];

/**
 * Renders the page for displaying stocktakes.
 *
 * @prop  {Realm}         database    App wide database.
 * @prop  {func}          navigateTo  CallBack for navigation stack.
 * @state {Realm.Results} stocktakes  Result object containing all items.
 */
export class StocktakesPage extends React.Component {
  constructor(props) {
    super(props);
    this.dataFilters = {
      searchTerm: '',
      sortBy: 'createdDate',
      isAscending: false,
    };
    this.state = {
      showCurrent: true,
      selection: [],
    };
    this.stocktakes = props.database.objects('Stocktake');
  }

  onRowPress = stocktake => {
    const { navigateTo } = this.props;

    this.clearSelection();
    navigateTo('stocktakeEditor', navStrings.stocktake, {
      stocktake,
    });
  };

  onNewStockTake = () => {
    const { navigateTo } = this.props;

    this.clearSelection();
    navigateTo('stocktakeManager', navStrings.new_stocktake);
  };

  onDeleteConfirm = () => {
    const { selection } = this.state;
    const { database } = this.props;
    database.write(() => {
      const stocktakesToDelete = [];
      for (let i = 0; i < selection.length; i += 1) {
        const stocktake = this.stocktakes.find(s => s.id === selection[i]);
        if (stocktake.isValid() && !stocktake.isFinalised) {
          stocktakesToDelete.push(stocktake);
        }
      }
      database.delete('Stocktake', stocktakesToDelete);
    });
    this.clearSelection(true);
  };

  onToggleStatusFilter = isCurrent => {
    this.setState({ showCurrent: isCurrent }, this.refreshData);
  };

  onSelectionChange = newSelection => {
    this.setState({ selection: newSelection });
  };

  clearSelection = shouldRefreshData => {
    this.setState({ selection: [] }, () => shouldRefreshData && this.refreshData());
  };

  updateDataFilters = (newSearchTerm, newSortBy, newIsAscending) => {
    // (... != null) checks for null or undefined (implicitly type coerced to null).
    if (newSearchTerm != null) this.dataFilters.searchTerm = newSearchTerm;
    if (newSortBy != null) this.dataFilters.sortBy = newSortBy;
    if (newIsAscending != null) this.dataFilters.isAscending = newIsAscending;
  };

  /**
   * Returns updated data filtered by |searchTerm| and ordered by |sortBy| and |isAscending|.
   */
  refreshData = (newSearchTerm, newSortBy, newIsAscending) => {
    const { showCurrent } = this.state;

    this.updateDataFilters(newSearchTerm, newSortBy, newIsAscending);
    const { searchTerm, sortBy, isAscending } = this.dataFilters;
    const toggleFilter = showCurrent ? 'status != "finalised"' : 'status == "finalised"';
    const data = this.stocktakes
      .filtered(toggleFilter)
      .filtered('name BEGINSWITH[c] $0 OR serialNumber BEGINSWITH[c] $0', searchTerm)
      .sorted(sortBy, !isAscending); // |!isAscending| reverses sort order if |isAscending| is true.
    this.setState({ data });
  };

  renderCell = (key, stocktake) => {
    switch (key) {
      default:
      case 'name':
        return stocktake.name;
      case 'createdDate':
        return stocktake.createdDate.toDateString();
      case 'status':
        return formatStatus(stocktake.status);
      case 'selected':
        return {
          type: 'checkable',
          icon: 'md-remove-circle',
          isDisabled: stocktake.isFinalised,
        };
    }
  };

  renderToggleBar = () => {
    const { showCurrent } = this.state;

    return (
      <ToggleBar
        style={globalStyles.toggleBar}
        textOffStyle={globalStyles.toggleText}
        textOnStyle={globalStyles.toggleTextSelected}
        toggleOffStyle={globalStyles.toggleOption}
        toggleOnStyle={globalStyles.toggleOptionSelected}
        toggles={[
          {
            text: buttonStrings.current,
            onPress: () => this.onToggleStatusFilter(true),
            isOn: showCurrent,
          },
          {
            text: buttonStrings.past,
            onPress: () => this.onToggleStatusFilter(false),
            isOn: !showCurrent,
          },
        ]}
      />
    );
  };

  renderNewStocktakeButton = () => (
    <PageButton text={buttonStrings.new_stocktake} onPress={this.onNewStockTake} />
  );

  render() {
    const { database, genericTablePageStyles, topRoute } = this.props;
    const { data, selection, showCurrent } = this.state;

    return (
      <GenericPage
        data={data}
        refreshData={this.refreshData}
        renderCell={this.renderCell}
        renderTopLeftComponent={this.renderToggleBar}
        renderTopRightComponent={this.renderNewStocktakeButton}
        onRowPress={this.onRowPress}
        onSelectionChange={this.onSelectionChange}
        defaultSortKey={this.dataFilters.sortBy}
        defaultSortDirection={this.dataFilters.isAscending ? 'ascending' : 'descending'}
        columns={[
          {
            key: 'name',
            width: 6,
            title: tableStrings.name,
          },
          {
            key: 'createdDate',
            width: 2,
            title: tableStrings.created_date,
            sortable: true,
          },
          {
            key: 'status',
            width: 2,
            title: tableStrings.status,
            sortable: true,
          },
          {
            key: 'selected',
            width: 1,
            title: tableStrings.delete,
            alignText: 'center',
          },
        ]}
        dataTypesSynchronised={DATA_TYPES_SYNCHRONISED}
        database={database}
        selection={selection}
        {...genericTablePageStyles}
        topRoute={topRoute}
      >
        {selection.length > 0 && showCurrent && (
          <BottomConfirmModal
            isOpen={selection.length > 0 && showCurrent}
            questionText={modalStrings.delete_these_stocktakes}
            onCancel={() => this.clearSelection(true)}
            onConfirm={() => this.onDeleteConfirm()}
            confirmText={modalStrings.delete}
          />
        )}
      </GenericPage>
    );
  }
}

export default StocktakesPage;

/* eslint-disable react/forbid-prop-types, react/require-default-props */
StocktakesPage.propTypes = {
  database: PropTypes.object,
  genericTablePageStyles: PropTypes.object,
  topRoute: PropTypes.bool,
  navigateTo: PropTypes.func.isRequired,
};
