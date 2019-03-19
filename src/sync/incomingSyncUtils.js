import {
  EXTERNAL_TO_INTERNAL,
  NAME_TYPES,
  RECORD_TYPES,
  REQUISITION_STATUSES,
  REQUISITION_TYPES,
  SEQUENCE_KEYS,
  STATUSES,
  SYNC_TYPES,
  TRANSACTION_TYPES,
} from './syncTranslators';
import { CHANGE_TYPES, generateUUID } from '../database';
import { deleteRecord, mergeRecords } from '../database/utilities';
import { SETTINGS_KEYS } from '../settings';

const { THIS_STORE_ID } = SETTINGS_KEYS;

/**
 * Returns the number string as a float, or null if none passed.
 *
 * @param   {string}  numberString  The string to convert to a number.
 * @return  {float}                 The numeric representation of the string.
 */
const parseNumber = numberString => {
  if (!numberString) return null;
  const result = parseFloat(numberString);
  return Number.isNaN(result) ? null : result;
};

/**
 * Return a Date object representing the given date, time.
 *
 * @param   {string}  ISODate  The date in ISO 8601 format.
 * @param   {string}  ISOTime  The time in ISO 8601 format. Optional.
 * @return  {Date}             The Date representing |ISODate| (and |ISOTime|).
 */
const parseDate = (ISODate, ISOTime) => {
  if (!ISODate || ISODate.length < 1 || ISODate === '0000-00-00T00:00:00') {
    return null;
  }
  const date = new Date(ISODate);
  if (ISOTime && ISOTime.length >= 6) {
    const hours = ISOTime.substring(0, 2);
    const minutes = ISOTime.substring(3, 5);
    const seconds = ISOTime.substring(6, 8);
    date.setHours(hours, minutes, seconds);
  }
  return date;
};

/**
 * Returns the boolean string as a boolean (false if none passed)
 * @param  {string} numberString The string to convert to a boolean
 * @return {boolean}               The boolean representation of the string
 */
const parseBoolean = booleanString => {
  const trueStrings = ['true', 'True', 'TRUE'];
  return booleanString && trueStrings.indexOf(booleanString) >= 0;
};

/**
 * Return a database Address object with the given address details (reuse if one
 * already exists).
 *
 * @param   {Realm}         database  The local database.
 * @param   {string}        line1     Line 1 of the address (can be undefined).
 * @param   {string}        line2     Line 2 of the address (can be undefined).
 * @param   {string}        line3     Line 3 of the address (can be undefined).
 * @param   {string}        line4     Line 4 of the address (can be undefined).
 * @param   {string}        zipCode   Zip code of the address (can be undefined).
 * @return  {Realm.object}            The Address object described by the params.
 */
const getOrCreateAddress = (database, line1, line2, line3, line4, zipCode) => {
  let results = database.objects('Address');
  if (typeof line1 === 'string') {
    results = results.filtered('line1 == $0', line1);
  }
  if (typeof line2 === 'string') {
    results = results.filtered('line2 == $0', line2);
  }
  if (typeof line3 === 'string') {
    results = results.filtered('line3 == $0', line3);
  }
  if (typeof line4 === 'string') {
    results = results.filtered('line4 == $0', line4);
  }
  if (typeof zipCode === 'string') {
    results = results.filtered('zipCode == $0', zipCode);
  }
  if (results.length > 0) return results[0];
  const address = { id: generateUUID() };
  if (typeof line1 === 'string') address.line1 = line1;
  if (typeof line2 === 'string') address.line2 = line2;
  if (typeof line3 === 'string') address.line3 = line3;
  if (typeof line4 === 'string') address.line4 = line4;
  if (typeof zipCode === 'string') address.zipCode = zipCode;
  return database.create('Address', address);
};

/**
 * Ensure the given record has the right data to create an internal record of the given
 * |recordType|. Check only that it is a recognised record type, and that it contains values
 * for all expected keys. Does not values (content of the record itself could be unexpected or
 * invalid, and would not be detected).
 *
 * @param   {string}  recordType  The internal record type this sync record should be used for.
 * @param   {object}  record      The data from the sync record.
 * @return  {boolean}             Whether the data is sufficient to create an internal record from.
 */
export const sanityCheckIncomingRecord = (recordType, record) => {
  if (!record.ID || record.ID.length < 1) return false; // Every record must have an ID.
  const requiredFields = {
    Item: {
      cannotBeBlank: ['code', 'item_name'],
      canBeBlank: ['default_pack_size'],
    },
    ItemCategory: {
      cannotBeBlank: [],
      canBeBlank: ['Description'],
    },
    ItemDepartment: {
      cannotBeBlank: [],
      canBeBlank: ['department'],
    },
    ItemBatch: {
      cannotBeBlank: ['item_ID', 'quantity'],
      canBeBlank: ['pack_size', 'batch', 'expiry_date', 'cost_price', 'sell_price'],
    },
    ItemStoreJoin: {
      cannotBeBlank: ['item_ID', 'store_ID'],
      canBeBlank: [],
    },
    LocalListItem: {
      cannotBeBlank: ['item_ID', 'list_master_name_join_ID'],
      canBeBlank: [],
    },
    MasterListNameJoin: {
      cannotBeBlank: ['name_ID', 'list_master_ID'],
      canBeBlank: ['description'],
    },
    MasterList: {
      cannotBeBlank: [],
      canBeBlank: ['description', 'programSettings', 'isProgram'],
    },
    MasterListItem: {
      cannotBeBlank: ['item_ID'],
      canBeBlank: [],
    },
    Name: {
      cannotBeBlank: ['type', 'customer', 'supplier', 'manufacturer'],
      canBeBlank: ['name', 'code'],
    },
    NameStoreJoin: {
      cannotBeBlank: ['name_ID', 'store_ID'],
      canBeBlank: ['name_ID', 'store_ID'],
    },
    NumberSequence: {
      cannotBeBlank: ['name', 'value'],
      canBeBlank: [],
    },
    NumberReuse: {
      cannotBeBlank: ['name', 'number_to_use'],
      canBeBlank: [],
    },
    Requisition: {
      cannotBeBlank: ['status', 'type', 'daysToSupply'],
      canBeBlank: ['date_entered', 'serial_number', 'requester_reference', 'programID', 'periodID'],
    },
    RequisitionItem: {
      cannotBeBlank: ['requisition_ID', 'item_ID'],
      canBeBlank: ['stock_on_hand', 'Cust_stock_order', 'optionID'],
    },
    Stocktake: {
      cannotBeBlank: ['status'],
      canBeBlank: ['Description', 'stock_take_created_date', 'serial_number', 'program'],
    },
    StocktakeBatch: {
      cannotBeBlank: [
        'stock_take_ID',
        'item_line_ID',
        'item_ID',
        'snapshot_qty',
        'snapshot_packsize',
      ],
      canBeBlank: ['expiry', 'Batch', 'cost_price', 'sell_price', 'optionID'],
    },
    Store: {
      cannotBeBlank: [],
      canBeBlank: [],
    },
    Transaction: {
      cannotBeBlank: ['name_ID', 'type', 'status', 'store_ID'],
      canBeBlank: ['invoice_num', 'entry_date'],
    },
    TransactionCategory: {
      cannotBeBlank: [],
      canBeBlank: ['category', 'code', 'type'],
    },
    TransactionBatch: {
      cannotBeBlank: [
        'item_ID',
        'item_line_ID',
        'expiry_date',
        'quantity',
        'cost_price',
        'sell_price',
      ],
      canBeBlank: ['item_name', 'batch', 'expiry_date', 'pack_size', 'cost_price', 'sell_price'],
    },
    Options: {
      cannotBeBlank: ['name', 'type', 'isActive'],
      canBeBlank: [],
    },
    PeriodSchedule: {
      cannotBeBlank: ['name'],
      canBeBlank: [],
    },
    Period: {
      cannotBeBlank: ['name', 'startDate', 'endDate', 'periodScheduleID'],
      canBeBlank: [],
    },
  };
  if (!requiredFields[recordType]) return false; // Unsupported record type
  const hasAllNonBlankFields = requiredFields[recordType].cannotBeBlank.reduce(
    (containsAllFieldsSoFar, fieldName) =>
      containsAllFieldsSoFar &&
      record[fieldName] !== null && // Key must exist.
      record[fieldName].length > 0, // Key must not be empty string.
    true
  );

  if (!hasAllNonBlankFields) return false; // Return early if record invalid.
  const hasRequiredFields = requiredFields[recordType].canBeBlank.reduce(
    (containsAllFieldsSoFar, fieldName) =>
      containsAllFieldsSoFar &&
      record[fieldName] !== null && // Key must exist.
      record[fieldName] !== undefined, // Field may be empty string.
    hasAllNonBlankFields
  ); // Initialise |containsAllFieldsSoFar| as result from |hasAllNonBlankFields|.
  return hasRequiredFields;
};

/**
 * Update an existing record or create a new one based on the sync record.
 *
 * @param   {Realm}  database    The local database.
 * @param   {object} settings    Access to app settings.
 * @param   {string} recordType  Internal record type.
 * @param   {object} record      Data from sync representing the record.
 * @return  {none}
 */
export const createOrUpdateRecord = (database, settings, recordType, record) => {
  if (!sanityCheckIncomingRecord(recordType, record)) return; // Unsupported or malformed record.
  let internalRecord;
  switch (recordType) {
    case 'Item': {
      const packSize = parseNumber(record.default_pack_size);
      internalRecord = {
        id: record.ID,
        category: database.getOrCreate('ItemCategory', record.category_ID),
        code: record.code,
        defaultPackSize: 1, // Every item batch in mobile should be pack-to-one.
        defaultPrice: packSize ? parseNumber(record.buy_price) / packSize : 0,
        department: database.getOrCreate('ItemDepartment', record.department_ID),
        description: record.description,
        name: record.item_name,
        crossReferenceItem: database.getOrCreate('Item', record.cross_ref_item_ID),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'ItemCategory': {
      internalRecord = {
        id: record.ID,
        name: record.Description,
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'ItemDepartment': {
      internalRecord = {
        id: record.ID,
        name: record.department,
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'ItemBatch': {
      const item = database.getOrCreate('Item', record.item_ID);
      const packSize = parseNumber(record.pack_size);
      internalRecord = {
        id: record.ID,
        item,
        packSize: 1, // Every item batch in mobile should be pack-to-one.
        numberOfPacks: parseNumber(record.quantity) * packSize,
        expiryDate: parseDate(record.expiry_date),
        batch: record.batch,
        costPrice: packSize ? parseNumber(record.cost_price) / packSize : 0,
        sellPrice: packSize ? parseNumber(record.sell_price) / packSize : 0,
        supplier: database.getOrCreate('Name', record.name_ID),
      };
      const itemBatch = database.update(recordType, internalRecord);
      item.addBatchIfUnique(itemBatch);
      database.save('Item', item);
      break;
    }
    case 'ItemStoreJoin': {
      const joinsThisStore = record.store_ID === settings.get(THIS_STORE_ID);
      internalRecord = {
        id: record.ID,
        itemId: record.item_ID,
        joinsThisStore,
      };
      database.update(recordType, internalRecord);
      if (joinsThisStore) {
        // If it joins this store, set the item's visibility.
        const item = database.getOrCreate('Item', record.item_ID);
        item.isVisible = !parseBoolean(record.inactive);
        database.save('Item', item);
      }
      break;
    }
    // 'LocalListItem' is not a class defined in the app's realm. The structure from mSupply
    // will be replaced by storing equivalent infomation in a MasterList. 'LocalListItem'
    // objects will be mapped to 'MasterListItem' in sync.
    case 'LocalListItem': {
      const item = database.getOrCreate('Item', record.item_ID);
      // Get masterList by 'list_master_name_join_ID' as the join's id is used in mobile
      // to mimic the local list join with a MasterList.
      const masterList = database.getOrCreate('MasterList', record.list_master_name_join_ID);

      internalRecord = {
        id: record.ID,
        item,
        imprestQuantity: parseNumber(record.imprest_quantity),
        masterList,
      };
      const localListItem = database.update('MasterListItem', internalRecord);
      masterList.addItemIfUnique(localListItem);
      break;
    }
    case 'MasterListNameJoin': {
      const name = database.getOrCreate('Name', record.name_ID);
      let masterList;
      if (!record.list_master_ID) {
        // mSupply 'list_local_line' do not have a 'list_master_ID', map the join to a 'MasterList'
        masterList = database.getOrCreate('MasterList', record.ID);
        masterList.name = record.description;
        database.save('MasterList', masterList);
      } else {
        // Regular 'MasterListNameJoin'.
        masterList = database.getOrCreate('MasterList', record.list_master_ID);
        internalRecord = {
          id: record.ID,
          name,
          masterList,
        };
        database.update(recordType, internalRecord);
      }

      name.addMasterListIfUnique(masterList);
      database.save('Name', name);
      break;
    }
    case 'MasterList': {
      internalRecord = {
        id: record.ID,
        name: record.description,
        note: record.note,
        isProgram: parseBoolean(record.isProgram),
        programSettings: JSON.stringify(record.programSettings),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'MasterListItem': {
      const masterList = database.getOrCreate('MasterList', record.item_master_ID);
      internalRecord = {
        id: record.ID,
        item: database.getOrCreate('Item', record.item_ID),
        imprestQuantity: parseNumber(record.imprest_quan),
        masterList,
      };
      const masterListItem = database.update(recordType, internalRecord);
      masterList.addItemIfUnique(masterListItem);
      break;
    }
    case 'Name': {
      internalRecord = {
        id: record.ID,
        name: record.name,
        code: record.code,
        phoneNumber: record.phone,
        billingAddress: getOrCreateAddress(
          database,
          record.bill_address1,
          record.bill_address2,
          record.bill_address3,
          record.bill_address4,
          record.bill_postal_zip_code
        ),
        emailAddress: record.email,
        type: NAME_TYPES.translate(record.type, EXTERNAL_TO_INTERNAL),
        isCustomer: parseBoolean(record.customer),
        isSupplier: parseBoolean(record.supplier),
        isManufacturer: parseBoolean(record.manufacturer),
        supplyingStoreId: record.supplying_store_id,
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'NameStoreJoin': {
      const joinsThisStore = record.store_ID === settings.get(THIS_STORE_ID);
      internalRecord = {
        id: record.ID,
        nameId: record.name_ID,
        joinsThisStore,
      };
      database.update(recordType, internalRecord);
      if (joinsThisStore) {
        // If it joins this store, set the name's visibility.
        const name = database.getOrCreate('Name', record.name_ID);
        name.isVisible = !parseBoolean(record.inactive);
        database.save('Name', name);
      }
      break;
    }
    case 'NumberSequence': {
      const thisStoreId = settings.get(THIS_STORE_ID);
      const sequenceKey = SEQUENCE_KEYS.translate(record.name, EXTERNAL_TO_INTERNAL, thisStoreId);
      // Don't accept updates to number sequences.
      if (
        database.objects('NumberSequence').filtered('sequenceKey == $0', sequenceKey).length > 0
      ) {
        break;
      }
      if (!sequenceKey) break; // If translator returns a null key, sequence is not for this store.
      internalRecord = {
        id: record.ID,
        sequenceKey,
        highestNumberUsed: parseNumber(record.value),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'NumberToReuse': {
      const thisStoreId = settings.get(THIS_STORE_ID);
      const sequenceKey = SEQUENCE_KEYS.translate(record.name, EXTERNAL_TO_INTERNAL, thisStoreId);
      if (!sequenceKey) break; // If translator returns a null key, sequence is not for this store.
      const numberSequence = database.getOrCreate('NumberSequence', sequenceKey, 'sequenceKey');
      internalRecord = {
        id: record.ID,
        numberSequence,
        number: parseNumber(record.number_to_use),
      };
      const numberToReuse = database.update(recordType, internalRecord);
      // Attach the number to reuse to the number sequence.
      numberSequence.addNumberToReuse(numberToReuse);
      break;
    }
    case 'Requisition': {
      let status = REQUISITION_STATUSES.translate(record.status, EXTERNAL_TO_INTERNAL);
      // If not a special 'wp' or 'wf' status, use the normal status translation.
      if (!status) {
        status = STATUSES.translate(record.status, EXTERNAL_TO_INTERNAL);
      }
      internalRecord = {
        id: record.ID,
        status: REQUISITION_STATUSES.translate(record.status, EXTERNAL_TO_INTERNAL),
        entryDate: parseDate(record.date_entered),
        daysToSupply: parseNumber(record.daysToSupply),
        serialNumber: record.serial_number,
        requesterReference: record.requester_reference,
        comment: record.comment,
        enteredBy: database.getOrCreate('User', record.user_ID),
        type: REQUISITION_TYPES.translate(record.type, EXTERNAL_TO_INTERNAL),
        otherStoreName: database.getOrCreate('Name', record.name_ID),
        program: database.getOrCreate('MasterList', record.programID),
        period: database.getOrCreate('Period', record.periodID),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'RequisitionItem': {
      const requisition = database.getOrCreate('Requisition', record.requisition_ID);
      internalRecord = {
        id: record.ID,
        requisition,
        item: database.getOrCreate('Item', record.item_ID),
        stockOnHand: parseNumber(record.stock_on_hand),
        dailyUsage: parseNumber(record.daily_usage),
        requiredQuantity: parseNumber(record.Cust_stock_order),
        suppliedQuantity: parseNumber(record.actualQuan),
        comment: record.comment,
        sortIndex: parseNumber(record.line_number),
        period: database.getOrCreate('Option', record.optionID),
      };
      const requisitionItem = database.update(recordType, internalRecord);
      // requisitionItem will be an orphan record if it's not unique?
      requisition.addItemIfUnique(requisitionItem);
      database.save('Requisition', requisition);
      break;
    }
    case 'Stocktake': {
      internalRecord = {
        id: record.ID,
        name: record.Description,
        createdDate: parseDate(record.stock_take_created_date),
        stocktakeDate: parseDate(record.stock_take_date, record.stock_take_time),
        status: STATUSES.translate(record.status, EXTERNAL_TO_INTERNAL),
        createdBy: database.getOrCreate('User', record.created_by_ID),
        finalisedBy: database.getOrCreate('User', record.finalised_by_ID),
        comment: record.comment,
        serialNumber: record.serial_number,
        additions: database.getOrCreate('Transaction', record.invad_additions_ID),
        reductions: database.getOrCreate('Transaction', record.invad_reductions_ID),
        program: database.getOrCreate('MasterList', record.programID),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'StocktakeBatch': {
      const stocktake = database.getOrCreate('Stocktake', record.stock_take_ID);
      const packSize = parseNumber(record.snapshot_packsize);
      const itemBatch = database.getOrCreate('ItemBatch', record.item_line_ID);
      const item = database.getOrCreate('Item', record.item_ID);
      itemBatch.item = item;
      item.addBatchIfUnique(itemBatch);
      internalRecord = {
        id: record.ID,
        stocktake,
        itemBatch,
        snapshotNumberOfPacks: parseNumber(record.snapshot_qty) * packSize,
        packSize: 1, // Pack to one all mobile data
        expiryDate: parseDate(record.expiry),
        batch: record.Batch,
        costPrice: packSize ? parseNumber(record.cost_price) / packSize : 0,
        sellPrice: packSize ? parseNumber(record.sell_price) / packSize : 0,
        countedNumberOfPacks: parseNumber(record.stock_take_qty) * packSize,
        sortIndex: parseNumber(record.line_number),
        option: database.getOrCreate('Option', record.optionID),
      };
      const stocktakeBatch = database.update(recordType, internalRecord);
      stocktake.addBatchIfUnique(database, stocktakeBatch);
      database.save('Stocktake', stocktake);
      break;
    }
    case 'Transaction': {
      if (record.store_ID !== settings.get(THIS_STORE_ID)) break; // Not for this store
      const otherParty = database.getOrCreate('Name', record.name_ID);
      const enteredBy = database.getOrCreate('User', record.user_ID);
      const linkedRequisition = record.requisition_ID
        ? database.getOrCreate('Requisition', record.requisition_ID)
        : null;
      const category = database.getOrCreate('TransactionCategory', record.category_ID);
      internalRecord = {
        id: record.ID,
        serialNumber: record.invoice_num,
        comment: record.comment,
        entryDate: parseDate(record.entry_date),
        type: TRANSACTION_TYPES.translate(record.type, EXTERNAL_TO_INTERNAL),
        status: STATUSES.translate(record.status, EXTERNAL_TO_INTERNAL),
        confirmDate: parseDate(record.confirm_date),
        theirRef: record.their_ref,
        category,
        enteredBy,
        otherParty,
        linkedRequisition,
      };
      const transaction = database.update(recordType, internalRecord);
      if (linkedRequisition) {
        database.update('Requisition', {
          id: linkedRequisition.id,
          linkedTransaction: transaction,
        });
      }
      otherParty.addTransactionIfUnique(transaction);
      database.save('Name', otherParty);
      break;
    }
    case 'TransactionCategory': {
      internalRecord = {
        id: record.ID,
        name: record.category,
        code: record.code,
        type: TRANSACTION_TYPES.translate(record.type, EXTERNAL_TO_INTERNAL),
      };
      database.update(recordType, internalRecord);
      break;
    }
    case 'TransactionBatch': {
      const transaction = database.getOrCreate('Transaction', record.transaction_ID);
      const itemBatch = database.getOrCreate('ItemBatch', record.item_line_ID);
      const item = database.getOrCreate('Item', record.item_ID);
      itemBatch.item = item;
      item.addBatchIfUnique(itemBatch);
      const packSize = parseNumber(record.pack_size);
      internalRecord = {
        id: record.ID,
        itemId: record.item_ID,
        itemName: record.item_name,
        itemBatch,
        packSize: 1, // Pack to one all mobile data.
        numberOfPacks: parseNumber(record.quantity) * packSize,
        numberOfPacksSent: parseNumber(record.quantity) * packSize,
        transaction,
        note: record.note,
        costPrice: packSize ? parseNumber(record.cost_price) / packSize : 0,
        sellPrice: packSize ? parseNumber(record.sell_price) / packSize : 0,
        sortIndex: parseNumber(record.line_number),
        expiryDate: parseDate(record.expiry_date),
        batch: record.batch,
      };
      const transactionBatch = database.update(recordType, internalRecord);
      transaction.addBatchIfUnique(database, transactionBatch);
      database.save('Transaction', transaction);
      itemBatch.addTransactionBatchIfUnique(transactionBatch);
      database.save('ItemBatch', itemBatch);
      break;
    }
    default:
      break; // Silently ignore record types which are not used by mobile.
  }
};

/**
 * Take the data from a sync record, and integrate it into the local database as
 * the given |recordType|. If create or update and the id mathces, will update an
 * existing record, otherwise create a new one if not. If delete, clean up/delete.
 *
 * @param   {Realm}   database    The local database.
 * @param   {object}  settings    Access to app settings.
 * @param   {string}  syncType    The type of change that created this sync record.
 * @param   {object}  syncRecord  Data representing the sync record.
 * @return  {none}
 */
export const integrateRecord = (database, settings, syncRecord) => {
  // Ignore sync record if missing data, record type, sync type, or record ID.
  if (!syncRecord.RecordType || !syncRecord.SyncType) return;
  const syncType = syncRecord.SyncType;
  const recordType = syncRecord.RecordType;
  const changeType = SYNC_TYPES.translate(syncType, EXTERNAL_TO_INTERNAL);
  const internalRecordType = RECORD_TYPES.translate(recordType, EXTERNAL_TO_INTERNAL);

  switch (changeType) {
    case CHANGE_TYPES.CREATE:
    case CHANGE_TYPES.UPDATE:
      if (!syncRecord.data) return; // Ignore if missing data.
      createOrUpdateRecord(database, settings, internalRecordType, syncRecord.data);
      break;
    case CHANGE_TYPES.DELETE:
      if (!syncRecord.RecordID) return; // Ignore if missing record id.
      deleteRecord(database, internalRecordType, syncRecord.RecordID);
      break;
    case 'merge':
      mergeRecords(database, settings, internalRecordType, syncRecord);
      break;
    default:
    // Handle unexpected |changeType|.
  }
};
