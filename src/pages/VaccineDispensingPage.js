/* eslint-disable react/forbid-prop-types */
/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2021
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Wizard } from '../widgets';
import { PatientSelect } from '../widgets/Tabs/PatientSelect';
import { PatientEdit } from '../widgets/Tabs/PatientEdit';
import { VaccineSelect } from '../widgets/Tabs/VaccineSelect';
import { dispensingStrings } from '../localization';
import { ModalContainer } from '../widgets/modals';
import { PatientHistoryModal } from '../widgets/modals/PatientHistory';
import { selectHistoryIsOpen } from '../selectors/Entities/vaccinePrescription';
import { VaccinePrescriptionActions } from '../actions/Entities/index';
import {
  selectFullName,
  selectEditingNameId,
  selectVaccinePatientHistory,
} from '../selectors/Entities/name';
import { VaccineSiteSelect } from '../widgets/Tabs/VaccineSiteSelect';
import { selectSiteSchemas } from '../selectors/formSchema';

const allTabs = [
  { component: PatientSelect, name: 'patient', title: dispensingStrings.select_the_patient },
  { component: PatientEdit, name: 'edit', title: dispensingStrings.edit_the_patient },
  { component: VaccineSiteSelect, name: 'site', title: dispensingStrings.edit_the_patient },
  { component: VaccineSelect, name: 'prescription', title: dispensingStrings.finalise },
];

export const VaccineDispensingPageComponent = ({
  historyIsOpen,
  closeHistory,
  patientName,
  patientHistory,
  patientId,
  siteSchema,
}) => {
  // Site tab is conditional on form schema presence
  const tabs = !siteSchema ? allTabs.filter(tab => tab.name !== 'site') : allTabs;

  return (
    <>
      <Wizard useNewStepper captureUncaughtGestures={false} tabs={tabs} />
      <ModalContainer
        title={`${dispensingStrings.patient} ${dispensingStrings.history}: ${patientName}`}
        onClose={closeHistory}
        isVisible={historyIsOpen}
      >
        <PatientHistoryModal
          isVaccine={true}
          patientHistory={patientHistory}
          patientId={patientId}
          sortKey="prescriptionDate"
        />
      </ModalContainer>
    </>
  );
};

VaccineDispensingPageComponent.defaultProps = {
  siteSchema: null,
};

VaccineDispensingPageComponent.propTypes = {
  historyIsOpen: PropTypes.bool.isRequired,
  closeHistory: PropTypes.func.isRequired,
  patientName: PropTypes.string.isRequired,
  patientId: PropTypes.string.isRequired,
  patientHistory: PropTypes.array.isRequired,
  siteSchema: PropTypes.object,
};

const stateToProps = state => {
  const historyIsOpen = selectHistoryIsOpen(state);
  const patientName = selectFullName(state);
  const patientHistory = selectVaccinePatientHistory(state);
  const patientId = selectEditingNameId(state) ?? '';
  const siteSchemas = selectSiteSchemas();
  const [siteSchema] = siteSchemas;

  return { historyIsOpen, patientName, patientId, patientHistory, siteSchema };
};

const dispatchToProps = dispatch => ({
  closeHistory: () => dispatch(VaccinePrescriptionActions.toggleHistory(false)),
});

export const VaccineDispensingPage = connect(
  stateToProps,
  dispatchToProps
)(VaccineDispensingPageComponent);
