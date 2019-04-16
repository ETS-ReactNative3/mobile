/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import {
  INCREMENT_SYNC_PROGRESS,
  SET_SYNC_PROGRESS,
  SET_SYNC_ERROR,
  SET_SYNC_TOTAL,
  SET_SYNC_MESSAGE,
  SET_SYNC_IS_SYNCING,
  SET_SYNC_COMPLETION_TIME,
} from '../sync/constants';

const setSyncProgress = progress => ({
  type: SET_SYNC_PROGRESS,
  progress,
});

const incrementSyncProgress = increment => ({
  type: INCREMENT_SYNC_PROGRESS,
  increment,
});

const setSyncError = errorMessage => ({
  type: SET_SYNC_ERROR,
  errorMessage,
});

const setSyncTotal = total => ({
  type: SET_SYNC_TOTAL,
  total,
});

const setSyncProgressMessage = progressMessage => ({
  type: SET_SYNC_MESSAGE,
  progressMessage,
});

const setSyncIsSyncing = isSyncing => ({
  type: SET_SYNC_IS_SYNCING,
  isSyncing,
});

const setSyncCompletionTime = lastSyncTime => ({
  type: SET_SYNC_COMPLETION_TIME,
  lastSyncTime,
});

export {
  setSyncProgress,
  incrementSyncProgress,
  setSyncError,
  setSyncTotal,
  setSyncProgressMessage,
  setSyncIsSyncing,
  setSyncCompletionTime,
};
