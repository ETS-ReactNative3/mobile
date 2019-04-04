/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import { SETTINGS_KEYS } from '../settings';

/**
 * Generic helper methods to handle usage of MasterLists which
 * are programs and program based requisitions and stock takes.
 */

/**
 * Finds all MasterList objects which are programs usable by this store.
 * A program: A master list which satisfies the following:
 * -- associated with this store,
 * -- masterList.isProgram = true,
 * -- has a store tag in programSettings, with a key which matches a tag
 * in this stores store tags
 * @param  {Object} settings
 * @param  {Realm}  database
 * @return {array}  MasterLists which are programs usable by this store.
 */
const getAllPrograms = (settings, database) => {
  const thisStoresNameID = settings.get(SETTINGS_KEYS.THIS_STORE_NAME_ID);
  const thisStoresTags = settings.get(SETTINGS_KEYS.THIS_STORE_TAGS);
  return database
    .objects('MasterListNameJoin')
    .filtered('name.id = $0 && masterList.isProgram = $1', thisStoresNameID, true)
    .filter(({ masterList }) => masterList.getStoreTagObject(thisStoresTags))
    .map(({ masterList }) => masterList);
};

/**
 * Finds all periods which are available for use for the current
 * store given the program, periodSchedule and orderType.
 * @param  {Realm}              database
 * @param  {Object/MasterList}  program             An object consisting of a programID
 * @param  {string}             periodScheduleName  the name of a periodSchedule
 * @param  {Object}             orderType           an order Type object
 * @return {array}
 */
const getAllPeriodsForProgram = (database, program, periodScheduleName, orderType) =>
  database
    .objects('PeriodSchedule')
    .filtered('name = $0', periodScheduleName)[0]
    .getPeriodsForOrderType(program, orderType);

export { getAllPrograms, getAllPeriodsForProgram };
