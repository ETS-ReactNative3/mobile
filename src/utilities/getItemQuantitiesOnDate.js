/* @flow weak */

/**
 * OfflineMobile Android getStockOnDate function
 * Sustainable Solutions (NZ) Ltd. 2016
 */

import Realm from 'realm';
import database from '../database/realm';
import { getItemQuantity } from './index';

export default function getItemQuantitiesOnDate(items: Realm.Results, date: Date) {
  const itemQuantities = {};
  items.forEach((item) => {
    // console.log(item.id);
    itemQuantities[item.id] = getItemQuantity(item);
  });

  const transactions = database.objects('Transaction').filtered('confirmDate >= $0', date);
  // console.log(`date: ${date}`);
  // console.log(`Amount of transactions: ${transactions.length}`);

  transactions.forEach((transaction) => {
    const transactionType = transaction.type;
    // console.log(transaction.id);
    transaction.lines.forEach((line) => {
      // console.log(`transactionLine: ${line.id}`);
      const itemId = line.itemLine.item.id;
      const transactionQuantity = line.packSize * line.numberOfPacks;
      if (typeof itemQuantities[itemId] === 'number') {
        switch (transactionType) {
          case 'customer_invoice':
          case 'supplier_credit':
            // console.log(`upper caseseseses ${itemId}`);
            itemQuantities[itemId] = itemQuantities[itemId] + transactionQuantity;
            break;
          case 'customer_credit':
          case 'supplier_invoice':
            // console.log('lower caseseseses');
            itemQuantities[itemId] -= transactionQuantity;
            break;
          default:
            // console.log('switch default');
            break;
        }
      }
    });
  });

  return itemQuantities;
}
