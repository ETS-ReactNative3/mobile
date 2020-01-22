import AsyncStorage from '@react-native-community/async-storage';

export const SETTINGS_KEYS = {
  APP_VERSION: 'AppVersion',
  CURRENT_LANGUAGE: 'CurrentLanguage',
  MOST_RECENT_USERNAME: 'MostRecentUsername',
  SUPPLYING_STORE_ID: 'SupplyingStoreId',
  SUPPLYING_STORE_NAME_ID: 'SupplyingStoreNameId',
  LAST_POST_PROCESSING_FAILED: 'LastPostProcessingFailed',
  SYNC_IS_INITIALISED: 'SyncIsInitialised',
  SYNC_PRIOR_FAILED: 'SyncPriorFailed',
  SYNC_URL: 'SyncURL',
  SYNC_SITE_ID: 'SyncSiteId',
  SYNC_SERVER_ID: 'SyncServerId',
  SYNC_SITE_NAME: 'SyncSiteName',
  SYNC_SITE_PASSWORD_HASH: 'SyncSitePasswordHash',
  THIS_STORE_ID: 'ThisStoreId',
  THIS_STORE_NAME_ID: 'ThisStoreNameId',
  THIS_STORE_TAGS: 'ThisStoreTags',
  THIS_STORE_CUSTOM_DATA: 'ThisStoreCustomData',
  CONSUMPTION_LOOKBACK_PERIOD: 'monthlyConsumptionLookBackPeriod',
  CONSUMPTION_ENFORCE_LOOKBACK: 'monthlyConsumptionEnforceLookBackPeriod',
  MONTHS_LEAD_TIME: 'monthsLeadTime',
  VACCINE_MODULE: 'usesVaccineModule',
  DISPENSARY_MODULE: 'usesDispensaryModule',
  DASHBOARD_MODULE: 'usesDashboardModule',
  PAYMENT_MODULE: 'usesPaymentModule',
  SUPPLIER_CREDIT_MODULE: 'usesSupplierCreditModule',
};

export const STORE_CUSTOM_DATA_KEYS = {
  CONSUMPTION_LOOKBACK_PERIOD: SETTINGS_KEYS.CONSUMPTION_LOOKBACK_PERIOD,
  CONSUMPTION_ENFORCE_LOOKBACK: SETTINGS_KEYS.CONSUMPTION_ENFORCE_LOOKBACK,
  MONTHS_LEAD_TIME: SETTINGS_KEYS.MONTHS_LEAD_TIME,
  VACCINE_MODULE: SETTINGS_KEYS.VACCINE_MODULE,
  DISPENSARY_MODULE: SETTINGS_KEYS.DISPENSARY_MODULE,
  DASHBOARD_MODULE: SETTINGS_KEYS.DASHBOARD_MODULE,
  PAYMENT_MODULE: SETTINGS_KEYS.PAYMENT_MODULE,
  SUPPLIER_CREDIT_MODULE: SETTINGS_KEYS.SUPPLIER_CREDIT_MODULE,
};

export const getAppVersion = async () => {
  const appVersion = await AsyncStorage.getItem(SETTINGS_KEYS.APP_VERSION);
  return appVersion;
};
