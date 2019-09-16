/* eslint-disable import/prefer-default-export */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import { modalStrings } from '../localization';
import { formatErrorItemNames } from './formatters';

/**
 * Check whether a given customer invoice is safe to be finalised. If safe to finalise,
 * return null, else return an appropriate error message.
 *
 * @param   {object}  customerInvoice  The customer invoice to check.
 * @return  {string}                   Error message if unsafe to finalise, else null.
 */
export function checkForCustomerInvoiceError(customerInvoice) {
  if (customerInvoice.items.length === 0) {
    return modalStrings.add_at_least_one_item_before_finalising;
  }

  if (customerInvoice.totalQuantity === 0) {
    return modalStrings.record_stock_to_issue_before_finalising;
  }
  return null;
}

/**
 * Check whether a given transaction is safe to be finalised. If safe to finalise,
 * return null, else return an appropriate error message.
 *
 * @param   {object}  transaction  The transaction to check.
 * @return  {string}               Error message if unsafe to finalise, else null.
 */
export function checkForSupplierInvoiceError(transaction) {
  if (!transaction.isExternalSupplierInvoice) return null;
  if (transaction.items.length === 0) {
    return modalStrings.add_at_least_one_item_before_finalising;
  }
  if (transaction.totalQuantity === 0) {
    return modalStrings.stock_quantity_greater_then_zero;
  }

  return null;
}

/**
 * Check whether a given requisition is safe to be finalised. Return null if safe,
 * else return an appropriate error message.
 *
 * @param   {object}  requisition  The requisition to check.
 * @return  {string}               Null if safe to finalise, else an error message.
 */
export function checkForSupplierRequisitionError(requisition) {
  if (requisition.items.length === 0) {
    return modalStrings.add_at_least_one_item_before_finalising;
  }

  if (requisition.totalRequiredQuantity === 0) {
    return modalStrings.record_stock_required_before_finalising;
  }

  return null;
}

/**
 * Check whether a given stocktake is safe to be finalised.
 * If stocktake is safe to finalise, return null, else return an appropriate error
 * message.
 *
 * @param  {object}  stocktake  The stocktake to check.
 * @return {string}             Null if safe to be finalised, else an error message.
 */
export const checkForStocktakeError = stocktake => {
  const { hasSomeCountedItems, itemsBelowMinimum } = stocktake;

  if (!hasSomeCountedItems) {
    return modalStrings.stocktake_no_counted_items;
  }

  if (itemsBelowMinimum.length > 0) {
    return (
      modalStrings.following_items_reduced_more_than_available_stock +
      formatErrorItemNames(itemsBelowMinimum)
    );
  }
  return null;
};
