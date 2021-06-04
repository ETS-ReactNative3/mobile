/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2021
 */

import React from 'react';
import PropTypes from 'prop-types';

import { ActivityIndicator, Keyboard, StyleSheet, Text, ToastAndroid, View } from 'react-native';

import { batch, connect } from 'react-redux';

import { FormControl } from '../FormControl';
import { PageButton } from '../PageButton';
import { FlexRow } from '../FlexRow';
import { FlexView } from '../FlexView';
import { PageButtonWithOnePress } from '../PageButtonWithOnePress';

import { selectSpecificEntityState } from '../../selectors/Entities';

import { createDefaultName, NameActions } from '../../actions/Entities/NameActions';
import { WizardActions } from '../../actions/WizardActions';
import { VaccinePrescriptionActions } from '../../actions/Entities/VaccinePrescriptionActions';
import { FormActions } from '../../actions/FormActions';
import { selectPatientSearchFormConfig } from '../../selectors/Entities/vaccinePrescription';
import { getColumns } from '../../pages/dataTableUtilities';

import { MODALS } from '../constants';
import {
  buttonStrings,
  dispensingStrings,
  generalStrings,
  vaccineStrings,
} from '../../localization';
import globalStyles, { DARK_GREY } from '../../globalStyles';
import { NameNoteActions } from '../../actions/Entities/NameNoteActions';
import { AfterInteractions } from '../AfterInteractions';
import { generateUUID, UIDatabase } from '../../database/index';
import { SimpleTable } from '../SimpleTable';
import { useKeyboardIsOpen } from '../../hooks/useKeyboardIsOpen';
import { Paper } from '../Paper';
import { selectCompletedForm } from '../../selectors/form';

import { DARKER_GREY, SUSSOL_ORANGE } from '../../globalStyles/colors';

import { useLocalAndRemotePatients } from '../../hooks/useLocalAndRemotePatients';
import { APP_FONT_FAMILY, APP_GENERAL_FONT_SIZE } from '../../globalStyles/fonts';
import { useLoadingIndicator } from '../../hooks/useLoadingIndicator';
import { useToggle } from '../../hooks/useToggle';
import { QrScannerModal } from '../modals/QrScannerModal';

const getMessage = (noResults, error) => {
  if (noResults) return generalStrings.could_not_find_patient;
  if (error) return generalStrings.error_communicating_with_server;
  return generalStrings.enter_patient_details;
};

const EmptyComponent = ({ loading, error, searchedWithNoResults }) => (
  <FlexView flex={1} justifyContent="center" alignItems="center" style={{ marginTop: 20 }}>
    {loading ? (
      <ActivityIndicator color={SUSSOL_ORANGE} size="small" />
    ) : (
      <Text style={{ fontFamily: APP_FONT_FAMILY, fontSize: APP_GENERAL_FONT_SIZE }}>
        {getMessage(searchedWithNoResults, error)}
      </Text>
    )}
  </FlexView>
);

const Header = ({ onSearchOnline, onNewPatient, loading, toggleQrModal }) => (
  <FlexRow justifyContent="center" alignItems="center">
    <Text style={localStyles.text}>{vaccineStrings.vaccine_dispense_step_one_title}</Text>
    <View style={{ flex: 1, marginLeft: 'auto' }} />
    <PageButton text="Scan QR Code" onPress={toggleQrModal} />
    <PageButton
      style={{ marginLeft: 10 }}
      text={generalStrings.search_online}
      onPress={onSearchOnline}
      isDisabled={loading}
    />
    <PageButton
      style={{ marginLeft: 10 }}
      text={`${dispensingStrings.new} ${dispensingStrings.patient}`}
      onPress={onNewPatient}
    />
  </FlexRow>
);

const GettingMore = ({ gettingMore }) =>
  gettingMore ? (
    <FlexRow flex={1} justifyContent="center" alignItems="space-between" style={localStyles.more}>
      <Text style={localStyles.text}>{generalStrings.finding_more_patients}</Text>
      <ActivityIndicator color={SUSSOL_ORANGE} size="small" />
    </FlexRow>
  ) : null;

GettingMore.propTypes = {
  gettingMore: PropTypes.bool.isRequired,
};

Header.propTypes = {
  onSearchOnline: PropTypes.func.isRequired,
  onNewPatient: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  toggleQrModal: PropTypes.func.isRequired,
};

EmptyComponent.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  searchedWithNoResults: PropTypes.bool.isRequired,
};

/**
 * Layout component used for a tab within the vaccine prescription wizard.
 *
 * @prop {Func}   createPatient         Callback for creating a patient.
 * @prop {object} formConfig            Configuration of the search form
 * @prop {Bool}   isAscending           Indicator if the list of patient is sorted ascending.
 * @prop {Func}   onCancelPrescription  Cancels the prescription and returns to the vaccine page
 * @prop {Func}   onFilterData          Callback for filtering patients.
 * @prop {Func}   patients              Current set of patient data.
 * @prop {Func}   selectPatient         Callback for selecting a patient.
 * @prop {String} sortKey               Current key the list of patients is sorted by.
 *
 */
const PatientSelectComponent = ({
  createPatient,
  formConfig,
  onCancelPrescription,
  selectPatient,
  updateForm,
  completedForm,
}) => {
  const withLoadingIndicator = useLoadingIndicator();
  const [isQrModalOpen, toggleQrModal] = useToggle();

  const onQrCodeRead = ({ data }) => {
    // TODO: Some validation might be good here but don't know format..
    toggleQrModal();
    ToastAndroid.show(`${data} scanned`, ToastAndroid.LONG);
  };

  const [
    { data, loading, gettingMore, searchedWithNoResults, error },
    onSearchOnline,
    filter,
    getMorePatients,
  ] = useLocalAndRemotePatients([]);

  const columns = React.useMemo(() => getColumns(MODALS.PATIENT_LOOKUP), []);
  const { pageTopViewContainer } = globalStyles;
  const keyboardIsOpen = useKeyboardIsOpen();

  const handleUpdate = (key, value) => {
    updateForm(key, value);
    filter({ ...completedForm, [key]: value });
  };

  return (
    <FlexView style={pageTopViewContainer}>
      <Paper
        style={{ flex: 6 }}
        contentContainerStyle={{ flex: 1 }}
        headerContainerStyle={{ height: 60 }}
        headerText={vaccineStrings.vaccine_dispense_step_one_title}
        Header={
          // eslint-disable-next-line react/jsx-wrap-multilines
          <Header
            loading={loading}
            onSearchOnline={() => onSearchOnline(completedForm)}
            onNewPatient={createPatient}
            toggleQrModal={toggleQrModal}
          />
        }
      >
        <AfterInteractions placeholder={null}>
          <View style={localStyles.container}>
            <View style={localStyles.formContainer}>
              <FormControl
                inputConfig={formConfig}
                onUpdate={handleUpdate}
                showCancelButton={false}
                showSaveButton={false}
                saveButtonText={generalStrings.search}
              />
            </View>

            <View style={localStyles.listContainer}>
              <SimpleTable
                selectRow={name => {
                  // Only show a spinner when the name doesn't exist in the database, as we need to
                  // send a request to the server to add a name store join.
                  if (UIDatabase.get('Name', name?.id)) {
                    selectPatient(name);
                  } else {
                    withLoadingIndicator(() => selectPatient(name));
                  }
                }}
                onEndReached={() => getMorePatients(completedForm)}
                data={data}
                columns={columns}
                ListFooterComponent={<GettingMore gettingMore={gettingMore} />}
                ListEmptyComponent={
                  // eslint-disable-next-line react/jsx-wrap-multilines
                  <EmptyComponent
                    searchedWithNoResults={searchedWithNoResults}
                    error={error}
                    loading={loading}
                  />
                }
              />
            </View>
          </View>
        </AfterInteractions>
      </Paper>
      {!keyboardIsOpen && (
        <FlexRow>
          <PageButtonWithOnePress text={buttonStrings.cancel} onPress={onCancelPrescription} />
        </FlexRow>
      )}
      <QrScannerModal isOpen={isQrModalOpen} onBarCodeRead={onQrCodeRead} onClose={toggleQrModal} />
    </FlexView>
  );
};

const mapDispatchToProps = dispatch => {
  const onCancelPrescription = () => dispatch(VaccinePrescriptionActions.cancel());

  const selectPatient = patient =>
    batch(async () => {
      Keyboard.dismiss();
      const selectedPatient = await dispatch(NameActions.select(patient));

      if (selectedPatient) {
        dispatch(NameNoteActions.createSurveyNameNote(selectedPatient));
        dispatch(WizardActions.nextTab());
      }
    });

  const createPatient = () =>
    batch(() => {
      const id = generateUUID();
      const patient = createDefaultName('patient', id);
      dispatch(NameActions.create(patient));
      dispatch(NameNoteActions.createSurveyNameNote(patient));
      dispatch(WizardActions.nextTab());
    });
  const updateForm = (key, value) => dispatch(FormActions.updateForm(key, value));

  return {
    createPatient,
    onCancelPrescription,
    selectPatient,
    updateForm,
  };
};

const mapStateToProps = state => {
  const patientState = selectSpecificEntityState(state, 'name');
  const { searchTerm, sortKey, isAscending } = patientState;

  const completedForm = selectCompletedForm(state);
  const formConfig = selectPatientSearchFormConfig();

  return {
    completedForm,
    formConfig,
    searchTerm,
    sortKey,
    isAscending,
  };
};

PatientSelectComponent.propTypes = {
  completedForm: PropTypes.object.isRequired,
  selectPatient: PropTypes.func.isRequired,
  formConfig: PropTypes.array.isRequired,
  createPatient: PropTypes.func.isRequired,
  onCancelPrescription: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
};

export const PatientSelect = connect(mapStateToProps, mapDispatchToProps)(PatientSelectComponent);
const localStyles = StyleSheet.create({
  container: {
    flex: 12,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  formContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'stretch',
  },
  verticalSeparator: {
    width: 10,
    backgroundColor: DARK_GREY,
  },
  listContainer: {
    flex: 3,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  text: {
    fontFamily: APP_FONT_FAMILY,
    color: DARKER_GREY,
    fontSize: 14,
    paddingRight: 7,
  },
  more: { paddingVertical: 10 },
});
