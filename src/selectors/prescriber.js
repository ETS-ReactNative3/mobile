/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */
import { createSelector } from 'reselect';

import { UIDatabase } from '../database';

export const selectSortKey = ({ prescriber }) => {
  const { sortKey } = prescriber;
  return sortKey;
};

export const selectIsAscending = ({ prescriber }) => {
  const { isAscending } = prescriber;
  return isAscending;
};

export const selectSearchTerm = ({ prescriber }) => {
  const { searchTerm } = prescriber;
  return searchTerm;
};

export const selectFilteredPrescribers = createSelector([selectSearchTerm], searchTerm => {
  const [lastName, firstName] = searchTerm.split(',').map(name => name.trim());

  const queryString = 'lastName BEGINSWITH[c] $0 AND firstName BEGINSWITH[c] $1';
  const newData = UIDatabase.objects('Prescriber').filtered(queryString, lastName, firstName);

  return newData;
});

export const selectSortedPrescribers = createSelector(
  [selectSortKey, selectIsAscending, selectFilteredPrescribers],
  (sortKey, isAscending, prescribers) => prescribers.sorted(sortKey, isAscending)
);

export const selectPrescriberModalOpen = ({ prescriber }) => {
  const { isCreatingPrescriber, isEditingPrescriber } = prescriber;
  return isCreatingPrescriber || isEditingPrescriber;
};