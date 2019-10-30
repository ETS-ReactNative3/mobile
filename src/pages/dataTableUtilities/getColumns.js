/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2016
 */

import { tableStrings } from '../../localization';
import { COLUMN_TYPES, COLUMN_NAMES, COLUMN_KEYS } from './constants';

import { ROUTES } from '../../navigation/constants';

const PAGE_COLUMN_WIDTHS = {
  [ROUTES.CUSTOMER_INVOICE]: [2, 4, 2, 2, 1],
  [ROUTES.SUPPLIER_INVOICE]: [2, 4, 2, 2, 1],
  [ROUTES.SUPPLIER_INVOICES]: [1.5, 2.5, 2, 1.5, 3, 1],
  [ROUTES.CUSTOMER_INVOICES]: [1.5, 2.5, 2, 1.5, 3, 1],
  [ROUTES.SUPPLIER_REQUISITIONS]: [1.5, 2, 1, 1, 1, 1],
  [ROUTES.SUPPLIER_REQUISITION]: [1.4, 3.5, 2, 1.5, 2, 2, 1],
  [ROUTES.SUPPLIER_REQUISITION_WITH_PROGRAM]: [1.5, 4, 1.5, 1, 2, 1.5, 2, 2],
  [ROUTES.STOCKTAKES]: [6, 2, 2, 1],
  [ROUTES.STOCKTAKE_MANAGER]: [2, 6, 1],
  [ROUTES.STOCKTAKE_EDITOR]: [1, 2.8, 1.2, 1.2, 1, 0.8],
  [ROUTES.STOCKTAKE_EDITOR_WITH_REASONS]: [1, 2.8, 1.2, 1.2, 1, 1, 0.8],
  [ROUTES.CUSTOMER_REQUISITIONS]: [1.5, 2, 1, 1, 1],
  [ROUTES.CUSTOMER_REQUISITION]: [2, 4, 1.5, 1.5, 2, 2, 2, 2],
  [ROUTES.STOCK]: [1, 4, 1],
  stocktakeBatchEditModal: [1, 1, 1, 1, 1],
  stocktakeBatchEditModalWithReasons: [1, 1, 1, 1, 1, 1],
  regimenDataModal: [4, 1, 5],
};

const PAGE_COLUMNS = {
  [ROUTES.CUSTOMER_INVOICE]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.AVAILABLE_QUANTITY,
    COLUMN_NAMES.EDITABLE_TOTAL_QUANTITY,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.CUSTOMER_INVOICES]: [
    COLUMN_NAMES.INVOICE_NUMBER,
    COLUMN_NAMES.CUSTOMER,
    COLUMN_NAMES.ENTRY_DATE,
    COLUMN_NAMES.STATUS,
    COLUMN_NAMES.COMMENT,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.SUPPLIER_INVOICE]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.EDITABLE_TOTAL_QUANTITY,
    COLUMN_NAMES.EDITABLE_EXPIRY_DATE,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.SUPPLIER_INVOICES]: [
    COLUMN_NAMES.INVOICE_NUMBER,
    COLUMN_NAMES.SUPPLIER,
    COLUMN_NAMES.ENTRY_DATE,
    COLUMN_NAMES.STATUS,
    COLUMN_NAMES.COMMENT,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.SUPPLIER_REQUISITIONS]: [
    COLUMN_NAMES.REQUISITION_NUMBER,
    COLUMN_NAMES.SUPPLIER,
    COLUMN_NAMES.NUMBER_OF_ITEMS,
    COLUMN_NAMES.ENTRY_DATE,
    COLUMN_NAMES.STATUS,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.SUPPLIER_REQUISITION]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.OUR_STOCK_ON_HAND,
    COLUMN_NAMES.MONTHLY_USAGE,
    COLUMN_NAMES.SUGGESTED_QUANTITY,
    COLUMN_NAMES.EDITABLE_REQUIRED_QUANTITY,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.SUPPLIER_REQUISITION_WITH_PROGRAM]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.UNIT,
    COLUMN_NAMES.PRICE,
    COLUMN_NAMES.OUR_STOCK_ON_HAND,
    COLUMN_NAMES.MONTHLY_USAGE,
    COLUMN_NAMES.SUGGESTED_QUANTITY,
    COLUMN_NAMES.EDITABLE_REQUIRED_QUANTITY,
  ],
  [ROUTES.STOCKTAKES]: [
    COLUMN_NAMES.NAME,
    COLUMN_NAMES.CREATED_DATE,
    COLUMN_NAMES.STATUS,
    COLUMN_NAMES.REMOVE,
  ],
  [ROUTES.STOCKTAKE_MANAGER]: [COLUMN_NAMES.CODE, COLUMN_NAMES.NAME, COLUMN_NAMES.SELECTED],
  [ROUTES.STOCKTAKE_EDITOR]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.SNAPSHOT_TOTAL_QUANTITY,
    COLUMN_NAMES.COUNTED_TOTAL_QUANTITY,
    COLUMN_NAMES.DIFFERENCE,
    COLUMN_NAMES.BATCHES,
  ],
  [ROUTES.STOCKTAKE_EDITOR_WITH_REASONS]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.SNAPSHOT_TOTAL_QUANTITY,
    COLUMN_NAMES.COUNTED_TOTAL_QUANTITY,
    COLUMN_NAMES.DIFFERENCE,
    COLUMN_NAMES.REASON,
    COLUMN_NAMES.BATCHES,
  ],
  [ROUTES.CUSTOMER_REQUISITIONS]: [
    COLUMN_NAMES.REQUISITION_NUMBER,
    COLUMN_NAMES.CUSTOMER,
    COLUMN_NAMES.NUMBER_OF_ITEMS,
    COLUMN_NAMES.ENTRY_DATE,
    COLUMN_NAMES.STATUS,
  ],
  [ROUTES.CUSTOMER_REQUISITION]: [
    COLUMN_NAMES.ITEM_CODE,
    COLUMN_NAMES.ITEM_NAME,
    COLUMN_NAMES.OUR_STOCK_ON_HAND,
    COLUMN_NAMES.THEIR_STOCK_ON_HAND,
    COLUMN_NAMES.MONTHLY_USAGE,
    COLUMN_NAMES.SUGGESTED_QUANTITY,
    COLUMN_NAMES.REQUIRED_QUANTITY,
    COLUMN_NAMES.SUPPLIED_QUANTITY,
  ],
  [ROUTES.STOCK]: [COLUMN_NAMES.CODE, COLUMN_NAMES.NAME, COLUMN_NAMES.TOTAL_QUANTITY],
  stocktakeBatchEditModal: [
    COLUMN_NAMES.BATCH_NAME,
    COLUMN_NAMES.EDITABLE_EXPIRY_DATE,
    COLUMN_NAMES.SNAPSHOT_TOTAL_QUANTITY,
    COLUMN_NAMES.COUNTED_TOTAL_QUANTITY,
    COLUMN_NAMES.DIFFERENCE,
  ],
  stocktakeBatchEditModalWithReasons: [
    COLUMN_NAMES.BATCH_NAME,
    COLUMN_NAMES.EDITABLE_EXPIRY_DATE,
    COLUMN_NAMES.SNAPSHOT_TOTAL_QUANTITY,
    COLUMN_NAMES.COUNTED_TOTAL_QUANTITY,
    COLUMN_NAMES.DIFFERENCE,
    COLUMN_NAMES.REASON,
  ],
  regimenDataModal: [
    COLUMN_NAMES.QUESTION,
    COLUMN_NAMES.EDITABLE_VALUE,
    COLUMN_NAMES.EDITABLE_COMMENT,
  ],
};

const COLUMNS = () => ({
  // CODE COLUMNS
  [COLUMN_NAMES.INVOICE_NUMBER]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.SERIAL_NUMBER,
    title: tableStrings.invoice_number,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.REQUISITION_NUMBER]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.SERIAL_NUMBER,
    title: tableStrings.requisition_number,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.ITEM_CODE]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.ITEM_CODE,
    title: tableStrings.item_code,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.CODE]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.CODE,
    title: tableStrings.code,
    alignText: 'left',
    sortable: true,
    editable: false,
  },

  // STRING COLUMNS

  [COLUMN_NAMES.ITEM_NAME]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.ITEM_NAME,
    title: tableStrings.item_name,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.NAME]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.NAME,
    title: tableStrings.name,
    alignText: 'left',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.SUPPLIER]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.OTHER_PARTY_NAME,
    title: tableStrings.supplier,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.CUSTOMER]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.OTHER_PARTY_NAME,
    title: tableStrings.customer,
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.COMMENT]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.COMMENT,
    title: tableStrings.comment,
    lines: 2,
    editable: false,
  },
  [COLUMN_NAMES.UNIT]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.UNIT,
    title: tableStrings.unit,
    alignText: 'center',
    sortable: false,
    editable: false,
  },
  [COLUMN_NAMES.STATUS]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.STATUS,
    title: tableStrings.status,
    sortable: false,
    editable: false,
  },
  [COLUMN_NAMES.QUESTION]: {
    type: COLUMN_TYPES.STRING,
    key: COLUMN_KEYS.NAME,
    title: 'question',
    textAlign: 'left',
    sortable: false,
    editable: false,
  },

  // EDITABLE STRING COLUMNS

  [COLUMN_NAMES.BATCH_NAME]: {
    type: COLUMN_TYPES.EDITABLE_STRING,
    key: COLUMN_KEYS.BATCH,
    title: tableStrings.batch_name,
    alignText: 'center',
    editable: true,
  },
  [COLUMN_NAMES.EDITABLE_COMMENT]: {
    type: COLUMN_TYPES.EDITABLE_STRING,
    key: COLUMN_KEYS.COMMENT,
    title: tableStrings.comment,
    textAlign: 'right',
    sortable: false,
    editable: true,
  },
  [COLUMN_NAMES.EDITABLE_VALUE]: {
    type: COLUMN_TYPES.EDITABLE_STRING,
    key: COLUMN_KEYS.VALUE,
    title: 'value',
    textAlign: 'right',
    sortable: false,
    editable: true,
  },

  // NUMERIC COLUMNS

  [COLUMN_NAMES.AVAILABLE_QUANTITY]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.AVAILABLE_QUANTITY,
    title: tableStrings.available_stock,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.NUMBER_OF_ITEMS]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.NUMBER_OF_ITEMS,
    title: tableStrings.items,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.OUR_STOCK_ON_HAND]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.OUR_STOCK_ON_HAND,
    title: tableStrings.current_stock,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.THEIR_STOCK_ON_HAND]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.STOCK_ON_HAND,
    title: tableStrings.their_stock,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.SUGGESTED_QUANTITY]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.SUGGESTED_QUANTITY,
    title: tableStrings.suggested_quantity,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.REQUIRED_QUANTITY]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.REQUIRED_QUANTITY,
    title: tableStrings.required_quantity,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.DIFFERENCE]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.DIFFERENCE,
    title: tableStrings.difference,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.SNAPSHOT_TOTAL_QUANTITY]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.SNAPSHOT_TOTAL_QUANTITY,
    title: tableStrings.snapshot_quantity,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.PRICE]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.PRICE,
    title: tableStrings.price,
    alignText: 'center',
    editable: false,
    sortable: false,
  },
  [COLUMN_NAMES.MONTHLY_USAGE]: {
    type: COLUMN_TYPES.NUMERIC,
    key: COLUMN_KEYS.MONTHLY_USAGE,
    title: tableStrings.monthly_usage,
    alignText: 'right',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.TOTAL_QUANTITY]: {
    type: 'numeric',
    key: 'totalQuantity',
    title: tableStrings.quantity,
    alignText: 'right',
    sortable: true,
    editable: false,
  },

  // EDITABLE NUMERIC COLUMNS

  [COLUMN_NAMES.EDITABLE_REQUIRED_QUANTITY]: {
    type: COLUMN_TYPES.EDITABLE_NUMERIC,
    key: COLUMN_KEYS.REQUIRED_QUANTITY,
    title: tableStrings.required_quantity,
    alignText: 'right',
    sortable: true,
    editable: true,
  },
  [COLUMN_NAMES.COUNTED_TOTAL_QUANTITY]: {
    type: COLUMN_TYPES.EDITABLE_NUMERIC,
    key: COLUMN_KEYS.COUNTED_TOTAL_QUANTITY,
    title: tableStrings.actual_quantity,
    alignText: 'right',
    sortable: true,
    editable: true,
  },
  [COLUMN_NAMES.EDITABLE_TOTAL_QUANTITY]: {
    type: COLUMN_TYPES.EDITABLE_NUMERIC,
    key: COLUMN_KEYS.TOTAL_QUANTITY,
    title: tableStrings.quantity,
    alignText: 'right',
    sortable: true,
    editable: true,
  },
  [COLUMN_NAMES.SUPPLIED_QUANTITY]: {
    type: COLUMN_TYPES.EDITABLE_NUMERIC,
    key: COLUMN_KEYS.SUPPLIED_QUANTITY,
    title: tableStrings.supply_quantity,
    alignText: 'right',
    sortable: true,
    editable: true,
  },

  // DATE COLUMNS

  [COLUMN_NAMES.CREATED_DATE]: {
    type: COLUMN_TYPES.DATE,
    key: COLUMN_KEYS.CREATED_DATE,
    title: tableStrings.created_date,
    alignText: 'left',
    sortable: true,
    editable: false,
  },
  [COLUMN_NAMES.ENTRY_DATE]: {
    type: COLUMN_TYPES.DATE,
    key: COLUMN_KEYS.ENTRY_DATE,
    title: tableStrings.entered_date,
    sortable: true,
    editable: false,
  },

  // EDITABLE DATE COLUMNS
  [COLUMN_NAMES.EDITABLE_EXPIRY_DATE]: {
    type: COLUMN_TYPES.EDITABLE_EXPIRY_DATE,
    key: COLUMN_KEYS.EXPIRY_DATE,
    title: tableStrings.batch_expiry,
    alignText: 'center',
    sortable: false,
    editable: true,
  },

  // CHECKABLE COLUMNS
  [COLUMN_NAMES.REMOVE]: {
    type: COLUMN_TYPES.CHECKABLE,
    key: COLUMN_KEYS.REMOVE,
    title: tableStrings.remove,
    alignText: 'center',
    sortable: false,
    editable: false,
  },

  [COLUMN_NAMES.SELECTED]: {
    type: COLUMN_TYPES.CHECKABLE,
    key: COLUMN_KEYS.SELECTED,
    title: tableStrings.selected,
    alignText: 'center',
    sortable: false,
    editable: false,
  },

  // MISC COLUMNS

  [COLUMN_NAMES.BATCHES]: {
    type: COLUMN_TYPES.ICON,
    key: COLUMN_KEYS.BATCH,
    title: tableStrings.batches,
    sortable: false,
    alignText: 'center',
    editable: false,
  },
  [COLUMN_NAMES.REASON]: {
    type: COLUMN_TYPES.DROP_DOWN,
    key: COLUMN_KEYS.REASON_TITLE,
    title: tableStrings.reason,
    alignText: 'center',
    sortable: false,
    editable: false,
  },
});

const getColumns = page => {
  const widths = PAGE_COLUMN_WIDTHS[page];
  const columnKeys = PAGE_COLUMNS[page];

  if (!columnKeys) return [];
  if (!(columnKeys.length === widths.length)) return [];
  const columns = COLUMNS();
  return columnKeys.map((columnKey, i) => ({ ...columns[columnKey], width: widths[i] }));
};

export default getColumns;