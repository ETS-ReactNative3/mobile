/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React, { useState, useCallback } from 'react';
import { View, VirtualizedList, Text, StyleSheet } from 'react-native';

import { UIDatabase } from '../database/index';
import { schema } from '../database/schema';

import { SearchBar } from '../widgets';

import globalStyles from '../globalStyles';

const TYPES = {
  BOOLEAN: 'boolean',
  DATE: 'date',
  NUMBER: 'number',
  STRING: 'string',
  ARRAY: 'array',
  OBJECT: 'object',
};

const REALM_TYPES = {
  BOOL: 'bool',
  DATE: 'date',
  DOUBLE: 'double',
  FLOAT: 'float',
  INT: 'int',
  LIST: 'list',
  OBJECT: 'object',
  STRING: 'string',
};

const TYPE_MAPPINGS = {
  [TYPES.BOOLEAN]: [REALM_TYPES.BOOL],
  [TYPES.DATE]: [REALM_TYPES.DATE],
  [TYPES.NUMBER]: [REALM_TYPES.INT, REALM_TYPES.FLOAT, REALM_TYPES.DOUBLE],
  [TYPES.STRING]: [REALM_TYPES.STRING],
  [TYPES.ARRAY]: [REALM_TYPES.LIST],
  [TYPES.OBJECT]: [REALM_TYPES.OBJECT],
};

const typeMapper = new Map(
  Object.entries(TYPE_MAPPINGS)
    .map(([type, realmTypes]) => realmTypes.map(realmType => [realmType, type]))
    .flat()
);

const parseType = realmType => {
  const { type } = realmType;
  if (type) return parseType(type);
  return typeMapper.get(realmType) || TYPES.OBJECT;
};

const getRealmObjects = ({ schema: objectSchemas }) =>
  objectSchemas.map(({ schema: objectSchema }) => objectSchema.name);

const getRealmObjectsFields = ({ schema: objectSchemas }) =>
  objectSchemas
    .map(({ schema: objectSchema }) => {
      const { name, properties } = objectSchema;
      const fields = Object.entries(properties)
        .map(([field, type]) => ({
          [field]: parseType(type),
        }))
        .reduce((acc, field) => ({ ...acc, ...field }), {});
      return { [name]: fields };
    })
    .reduce((acc, object) => ({ ...acc, ...object }));

const REALM_OBJECTS = getRealmObjects(schema);
const REALM_OBJECTS_FIELDS = getRealmObjectsFields(schema);

const toCapitalCase = value => value.charAt(0).toUpperCase() + value.slice(1);

const parseString = value => String(value);
const parseNumber = value => String(value);
const parseObject = value => value.id;
const parseArray = value => value.length;
const parseBoolean = value => toCapitalCase(String(value));
const parseDate = value => value.toString();

const parseCell = (value, type) => {
  if (value === null || value === undefined) return 'N/A';
  switch (type) {
    case TYPES.STRING:
      return parseString(value);
    case TYPES.NUMBER:
      return parseNumber(value);
    case TYPES.OBJECT:
      return parseObject(value);
    case TYPES.ARRAY:
      return parseArray(value);
    case TYPES.BOOLEAN:
      return parseBoolean(value);
    case TYPES.DATE:
      return parseDate(value);
    default:
      return '';
  }
};

const getRealmData = objectString =>
  REALM_OBJECTS.indexOf(objectString) >= 0 ? UIDatabase.objects(objectString) : [];

const getInitialState = () => {
  const objectString = '';
  const searchData = getRealmData(objectString);
  return { searchData, objectString, filterString: objectString, filteredData: searchData };
};

const searchData = (newObjectString, state) => {
  const { objectString } = state;
  const updateObjectString = newObjectString !== objectString;
  if (!updateObjectString) return { ...state };
  const newSearchData = getRealmData(newObjectString);
  return {
    ...state,
    searchData: newSearchData,
    objectString: newObjectString,
    filteredData: newSearchData,
  };
};

const getSearchBarRenderer = onSearchChange => ({ objectString }) => (
  <SearchBar value={objectString} onChangeText={onSearchChange} placeholder="Object string" />
);

const filterData = (newFilterString, state) => {
  const { searchData } = state;
  try {
    const newFilteredData =
      newFilterString === '' ? searchData : searchData.filtered(newFilterString);
    return { ...state, filterString: newFilterString, filteredData: newFilteredData };
  } catch (err) {
    return { ...state, filterString: newFilterString };
  }
};

const getFilterBarRenderer = onFilterChange => ({ filterString }) => (
  <SearchBar value={filterString} onChangeText={onFilterChange} placeholder="Filter string" />
);

const getHeaderRenderer = realmObjectFields => () => {
  if (!realmObjectFields) return null;
  const headerCells = Object.keys(realmObjectFields).map(columnKey => (
    <View key={columnKey} style={styles.cell}>
      <Text style={styles.cellText}>{columnKey}</Text>
    </View>
  ));
  return <View style={styles.row}>{headerCells}</View>;
};

const getRowRenderer = realmObjectFields => ({ item }) => {
  if (!realmObjectFields) return null;
  const cells = Object.entries(realmObjectFields).map(([columnKey, columnType]) => {
    const cell = item[columnKey];
    const cellValue = parseCell(cell, columnType);
    return (
      <View key={columnKey} style={styles.cell}>
        <Text style={styles.cellText}>{cellValue}</Text>
      </View>
    );
  });
  return <View style={styles.row}>{cells}</View>;
};

const getItem = (data, index) => data[index];
const getItemCount = data => data.length;
const keyExtractor = ({ id }) => id;

const getTableRenderer = realmObjectFields => ({ data }) => {
  if (!realmObjectFields) return null;
  const TableHeader = getHeaderRenderer(realmObjectFields);
  const TableRow = getRowRenderer(realmObjectFields);
  return (
    <VirtualizedList
      ListHeaderComponent={TableHeader}
      data={data}
      getItem={getItem}
      getItemCount={getItemCount}
      keyExtractor={keyExtractor}
      renderItem={TableRow}
    />
  );
};

/**
 * A page for displaying objects in the local database. Includes search and filtering functionality.
 *
 * @prop   {UIDatabase}     database      App wide database.
 * @state  {string}         objectString  Current search string. Used to update current object.
 * @state  {string}         filterString  Current filter string. Used to update filtered data.
 * @state  {Realm.Results}  objectData    Reference to current database object results. Used to roll
 *                                        back filter state when filter is reset.
 * @state  {Realm.Results}  filteredData  Reference to current database object results after filter
 *                                        has been applied. Displayed to the user.
 */
export const RealmExplorer = () => {
  const [state, setState] = useState(getInitialState());

  const onSearchChange = useCallback(
    newObjectString => setState(prevState => searchData(newObjectString, prevState)),
    []
  );
  const onFilterChange = useCallback(
    newFilterString => setState(prevState => filterData(newFilterString, prevState)),
    []
  );

  const { objectString, filterString, filteredData } = state;
  const realmObjectFields = REALM_OBJECTS_FIELDS[objectString];

  const RealmSearchBar = useCallback(getSearchBarRenderer(onSearchChange), [onSearchChange]);
  const RealmFilterBar = useCallback(getFilterBarRenderer(onFilterChange), [onFilterChange]);
  const RealmTable = useCallback(getTableRenderer(realmObjectFields), [realmObjectFields]);

  return (
    <View style={[globalStyles.container]}>
      <RealmSearchBar searchString={objectString} />
      <RealmFilterBar filterString={filterString} />
      <RealmTable data={filteredData} />
    </View>
  );
};

const styles = StyleSheet.create({
  cell: {
    flex: 1,
  },
  cellText: {
    textAlign: 'center',
  },
  row: {
    flex: 1,
    flexBasis: 0,
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
});

export default RealmExplorer;
