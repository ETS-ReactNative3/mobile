/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

/**
 * Methods to create internal records from a requested
 * sync/external record. Used primarily by
 * createOrUpdateRecord in incomingSyncUtils.
 */

import { parseBoolean, parseDate } from './incomingSyncUtils';

export const createPeriodInternalRecord = (record, database) => ({
  id: record.ID,
  startDate: record.startDate ? parseDate(record.startDate) : new Date(),
  endDate: record.endDate ? parseDate(record.startDate) : new Date(),
  name: record.name,
  periodSchedule: database.getOrCreate('PeriodSchedule', record.periodScheduleID),
});

export const createOptionsInternalRecord = record => ({
  id: record.ID,
  title: record.title,
  type: record.type,
  isActive: parseBoolean(record.isActive),
});

export const createPeriodScheduleInternalRecord = record => ({
  id: record.ID,
  name: record.name,
});