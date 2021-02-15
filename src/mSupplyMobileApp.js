/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-undef */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import { BluetoothStatus } from 'react-native-bluetooth-status';
import { AppState, View } from 'react-native';
import { Scheduler } from 'sussol-utilities';

import Settings from './settings/MobileAppSettings';
import Database from './database/BaseDatabase';
import { UIDatabase } from './database';
import { SETTINGS_KEYS } from './settings';

import { MainStackNavigator, Pages } from './navigation/Navigator';
import { ROUTES } from './navigation';
import { Synchroniser, PostSyncProcessor, SyncModal } from './sync';
import { migrateDataToVersion } from './dataMigration';
import { SyncAuthenticator, UserAuthenticator } from './authentication';

import { LoadingIndicatorContext } from './context/LoadingIndicatorContext';
import { selectTitle } from './selectors/supplierCredit';
import { selectIsSyncing } from './selectors/sync';
import { selectCurrentUser } from './selectors/user';
import { selectUsingVaccines } from './selectors/modules';

import { syncCompleteTransaction, setSyncError, openSyncModal } from './actions/SyncActions';
import { FinaliseActions } from './actions/FinaliseActions';
import { UserActions } from './actions';
import { SupplierCreditActions } from './actions/SupplierCreditActions';

import { Spinner } from './widgets';
import { ModalContainer, FinaliseModal, LoginModal } from './widgets/modals';
import { FirstUsePage } from './pages';
import { SupplierCredit } from './widgets/modalChildren/SupplierCredit';

import globalStyles, { SUSSOL_ORANGE } from './globalStyles';
import { BreachDisplay } from './widgets/modalChildren/BreachDisplay';
import { selectIsBreachModalOpen, selectBreachModalTitle } from './selectors/breach';
import { BreachActions } from './actions/BreachActions';
import { RowDetail } from './widgets/RowDetail';
import { PermissionActions } from './actions/PermissionActions';
import BleService from './bluetooth/BleService';
import TemperatureLogManager from './bluetooth/TemperatureLogManager';
import { DevBleManager } from './bluetooth/DevBleManager';
import SensorManager from './bluetooth/SensorManager';
import { VaccineDataAccess } from './bluetooth/VaccineDataAccess';
import { UtilService } from './database/utilities/utilService';
import { SensorDownloadActions } from './actions/Bluetooth/SensorDownloadActions';
import BreachManager from './bluetooth/BreachManager';

const SYNC_INTERVAL = 60 * 1000; // 1 minutes in milliseconds.
const AUTHENTICATION_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds.

SensorManager(new VaccineDataAccess(UIDatabase), new UtilService());
TemperatureLogManager(new VaccineDataAccess(UIDatabase), new UtilService());
BreachManager(new VaccineDataAccess(UIDatabase), new UtilService());

(async () => {
  const isEmulator = await DeviceInfo.isEmulator();
  if (isEmulator) {
    console.log('Emulator detected - Init Dev BleManager');
    BleService(new DevBleManager());
  } else {
    BleService();
  }
})();

class MSupplyMobileAppContainer extends React.Component {
  constructor(props, ...otherArgs) {
    super(props, ...otherArgs);

    migrateDataToVersion(UIDatabase, Settings);
    this.userAuthenticator = new UserAuthenticator(UIDatabase, Settings);
    this.syncAuthenticator = new SyncAuthenticator(Settings);
    this.synchroniser = new Synchroniser(
      Database,
      this.syncAuthenticator,
      Settings,
      props.dispatch
    );
    this.postSyncProcessor = new PostSyncProcessor(UIDatabase, Settings);
    this.scheduler = new Scheduler();
    const isInitialised = this.synchroniser.isInitialised();
    this.scheduler.schedule(this.synchronise, SYNC_INTERVAL);
    this.scheduler.schedule(() => {
      const { currentUser } = this.props;
      if (currentUser !== null) {
        // Only re-authenticate if currently logged in.
        this.userAuthenticator.reauthenticate(this.onAuthentication);
      }
    }, AUTHENTICATION_INTERVAL);

    this.state = {
      isInitialised,
      isLoading: false,
      appState: null,
      isDownloadingTemperatures: false,
    };
  }

  componentDidUpdate() {
    const { dispatch, usingVaccines, syncTemperatures, requestBluetooth } = this.props;

    if (usingVaccines) {
      const { isDownloadingTemperatures } = this.state;
      if (!isDownloadingTemperatures) this.scheduler.schedule(syncTemperatures, SYNC_INTERVAL);

      BluetoothStatus.addListener(requestBluetooth);
      dispatch(PermissionActions.checkPermissions());
    }
  }

  componentDidMount = () => {
    if (!__DEV__) AppState.addEventListener('change', this.onAppStateChange);
  };

  componentWillUnmount = () => {
    const { usingVaccines } = this.props;

    if (usingVaccines) BluetoothStatus.removeListener();
    if (!__DEV__) AppState.removeEventListener('change', this.onAppStateChange);

    this.scheduler.clearAll();
  };

  onAppStateChange = nextAppState => {
    const { appState } = this.state;
    const { dispatch } = this.props;
    if (nextAppState?.match(/inactive|background/)) dispatch(UserActions.setTime());
    if (appState?.match(/inactive|background/) && nextAppState === 'active') {
      dispatch(PermissionActions.checkPermissions());
      dispatch(UserActions.active());
    }

    this.setState({ appState: nextAppState });
  };

  onAuthentication = user => {
    const { dispatch } = this.props;
    dispatch(UserActions.login(user));
    this.postSyncProcessor.setUser(user);
  };

  onInitialised = () => {
    this.setState({ isInitialised: true });
    this.postSyncProcessor.processAnyUnprocessedRecords();
  };

  runWithLoadingIndicator = async functionToRun => {
    // We here set up an asynchronous promise that will be resolved after a timeout
    // of 1 millisecond. This allows a fraction of a delay for the javascript thread
    // to unblock and allow the spinner animation to start up. The |functionToRun| should
    // not be run inside a |setTimeout| as that relegates to a lower priority, resulting
    // in very slow performance.
    await new Promise(resolve => {
      this.setState({ isLoading: true }, () => setTimeout(resolve, 1));
    });

    await functionToRun();
    this.setState({ isLoading: false });
  };

  synchronise = async () => {
    const { dispatch, isSyncing } = this.props;
    const { isInitialised } = this.state;

    if (!isInitialised || isSyncing) return;

    try {
      const syncUrl = UIDatabase.getSetting(SETTINGS_KEYS.SYNC_URL);
      const syncSiteName = UIDatabase.getSetting(SETTINGS_KEYS.SYNC_SITE_NAME);
      const syncSitePasswordHash = UIDatabase.getSetting(SETTINGS_KEYS.SYNC_SITE_PASSWORD_HASH);

      await this.syncAuthenticator.authenticate(syncUrl, syncSiteName, null, syncSitePasswordHash);

      // True if most recent call to |this.synchroniser.synchronise()| failed.
      const lastSyncFailed = this.synchroniser.lastSyncFailed();
      const lastPostSyncProcessingFailed = this.postSyncProcessor.lastPostSyncProcessingFailed();
      await this.synchroniser.synchronise();
      if (lastSyncFailed || lastPostSyncProcessingFailed) {
        // If last sync was interrupted, it did not enter this block. If the app was closed, it did
        // not store any records left in the sync queue, so tables should be checked for unprocessed
        // records. If the last processing of the record queue was interrupted by app crash then all
        // records need to be checked.
        this.postSyncProcessor.processAnyUnprocessedRecords();
      } else {
        this.postSyncProcessor.processRecordQueue();
      }
      dispatch(syncCompleteTransaction());
    } catch (error) {
      dispatch(setSyncError(error.message));
    }
  };

  renderLoadingIndicator = () => {
    const { isLoading } = this.state;

    return (
      <View style={globalStyles.loadingIndicatorContainer}>
        <Spinner isSpinning={isLoading} color={SUSSOL_ORANGE} />
      </View>
    );
  };

  render() {
    const {
      currentUser,
      closeSupplierCreditModal,
      supplierCreditModalOpen,
      creditTitle,
      isBreachModalOpen,
      closeBreachModal,
      breachModalTitle,
    } = this.props;
    const { isInitialised, isLoading } = this.state;

    if (!isInitialised) {
      return <FirstUsePage synchroniser={this.synchroniser} onInitialised={this.onInitialised} />;
    }

    return (
      <LoadingIndicatorContext.Provider value={this.runWithLoadingIndicator}>
        <View style={globalStyles.appBackground}>
          <MainStackNavigator.Navigator initialRouteName={ROUTES.MENU}>
            {Pages}
          </MainStackNavigator.Navigator>

          <FinaliseModal />
          <SyncModal onPressManualSync={this.synchronise} />
          <LoginModal
            authenticator={this.userAuthenticator}
            settings={Settings}
            isAuthenticated={!!currentUser}
            onAuthentication={this.onAuthentication}
          />
          {isLoading && this.renderLoadingIndicator()}

          <ModalContainer
            isVisible={supplierCreditModalOpen}
            onClose={closeSupplierCreditModal}
            title={creditTitle}
          >
            <SupplierCredit />
          </ModalContainer>

          <ModalContainer
            isVisible={isBreachModalOpen}
            onClose={closeBreachModal}
            title={breachModalTitle}
          >
            <BreachDisplay />
          </ModalContainer>
          <RowDetail />
        </View>
      </LoadingIndicatorContext.Provider>
    );
  }
}

const mapDispatchToProps = dispatch => {
  const openFinaliseModal = () => dispatch(FinaliseActions.openModal());
  const closeFinaliseModal = () => dispatch(FinaliseActions.closeModal());
  const closeSupplierCreditModal = () => dispatch(SupplierCreditActions.close());
  const onOpenSyncModal = () => dispatch(openSyncModal());
  const closeBreachModal = () => dispatch(BreachActions.close());
  const syncTemperatures = () => dispatch(SensorDownloadActions.startDownloadAll());
  const requestBluetooth = newStatus => dispatch(PermissionActions.requestBluetooth(newStatus));

  return {
    requestBluetooth,
    syncTemperatures,
    dispatch,
    onOpenSyncModal,
    openFinaliseModal,
    closeFinaliseModal,
    closeSupplierCreditModal,
    closeBreachModal,
  };
};

const mapStateToProps = state => {
  const { finalise, supplierCredit } = state;
  const { open: supplierCreditModalOpen } = supplierCredit;
  const { finaliseModalOpen } = finalise;

  const usingVaccines = selectUsingVaccines(state);
  const isBreachModalOpen = selectIsBreachModalOpen(state);
  const currentUser = selectCurrentUser(state);
  const isSyncing = selectIsSyncing(state);
  const breachModalTitle = selectBreachModalTitle(state);
  return {
    usingVaccines,

    isSyncing,
    currentUser,
    finaliseModalOpen,
    supplierCreditModalOpen,
    isBreachModalOpen,
    breachModalTitle,
    creditTitle: selectTitle(state),
  };
};

MSupplyMobileAppContainer.defaultProps = {
  currentUser: null,
  creditTitle: '',
};

MSupplyMobileAppContainer.propTypes = {
  usingVaccines: PropTypes.bool.isRequired,
  requestBluetooth: PropTypes.func.isRequired,
  syncTemperatures: PropTypes.func.isRequired,
  isSyncing: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  closeSupplierCreditModal: PropTypes.func.isRequired,
  supplierCreditModalOpen: PropTypes.bool.isRequired,
  creditTitle: PropTypes.string,
  isBreachModalOpen: PropTypes.bool.isRequired,
  closeBreachModal: PropTypes.func.isRequired,
  breachModalTitle: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MSupplyMobileAppContainer);
