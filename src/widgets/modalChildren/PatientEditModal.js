/* eslint-disable react/forbid-prop-types */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormControl } from '../FormControl';
import { FlexRow } from '../FlexRow';
import { JSONForm } from '../JSONForm/JSONForm';
import { NameNoteActions } from '../../actions/Entities/NameNoteActions';
import { selectNameNoteIsValid, selectCreatingNameNote } from '../../selectors/Entities/nameNote';
import { PatientActions } from '../../actions/PatientActions';

export const PatientEditModalComponent = ({
  isDisabled,
  onSave,
  onCancel,
  inputConfig,
  surveySchema,
  surveyForm,
  onOpen,
  onSaveSurvey,
  onUpdateForm,
  nameNoteIsValid,
}) => {
  const onSaveWithForm = completedForm => {
    onSaveSurvey();
    onSave(completedForm);
  };

  useEffect(() => {
    if (surveySchema) {
      onOpen();
    }
  }, []);

  return (
    <FlexRow flex={1}>
      <FormControl
        canSave={nameNoteIsValid}
        isDisabled={isDisabled}
        onSave={surveySchema ? onSaveWithForm : onSave}
        onCancel={onCancel}
        inputConfig={inputConfig}
      />
      <View style={styles.formContainer}>
        {surveySchema && surveyForm && (
          <JSONForm
            surveySchema={surveySchema}
            formData={surveyForm}
            onChange={({ formData, errors }) => {
              onUpdateForm(formData, errors);
            }}
          >
            <></>
          </JSONForm>
        )}
      </View>
    </FlexRow>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});

PatientEditModalComponent.defaultProps = {
  isDisabled: false,
  surveyForm: null,
  surveySchema: null,
  nameNoteIsValid: true,
};

PatientEditModalComponent.propTypes = {
  isDisabled: PropTypes.bool,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  inputConfig: PropTypes.array.isRequired,
  surveyForm: PropTypes.object,
  nameNoteIsValid: PropTypes.bool,
  surveySchema: PropTypes.object,
  onOpen: PropTypes.func.isRequired,
  onSaveSurvey: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
};

const stateToProps = state => {
  const nameNoteIsValid = selectNameNoteIsValid(state);
  const nameNote = selectCreatingNameNote(state);

  return { nameNoteIsValid, surveyForm: nameNote?.data ?? null };
};

const dispatchToProps = (dispatch, ownProps) => {
  const { patient } = ownProps;
  const { id } = patient;
  return {
    onOpen: () => dispatch(NameNoteActions.createSurveyNameNote(id)),
    onSaveSurvey: () => dispatch(NameNoteActions.saveEditing()),
    onUpdateForm: form => dispatch(NameNoteActions.updateForm(form)),
    onSave: patientDetails => dispatch(PatientActions.patientUpdate(patientDetails)),
  };
};

export const PatientEditModal = connect(stateToProps, dispatchToProps)(PatientEditModalComponent);
