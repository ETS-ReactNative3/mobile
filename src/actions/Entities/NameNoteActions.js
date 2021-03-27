import Ajv from 'ajv';
import { generateUUID } from 'react-native-database';
import merge from 'lodash.merge';
import moment from 'moment';
import { createRecord, UIDatabase } from '../../database/index';
import { selectCreatingNameNote } from '../../selectors/Entities/nameNote';
import { selectSurveySchemas } from '../../selectors/formSchema';

const ajvErrors = require('ajv-errors');

const ajvOptions = {
  errorDataPath: 'property',
  allErrors: true,
  multipleOfPrecision: 8,
  schemaId: 'auto',
  jsonPointers: true,
};

export const NAME_NOTE_ACTIONS = {
  SELECT: 'NAME_NOTE/select',
  RESET: 'NAME_NOTE/reset',
  UPDATE_DATA: 'NAME_NOTE/updateData',
  CREATE: 'NAME_NOTE/create',
};

const ajv = new Ajv(ajvOptions);
ajvErrors(ajv);

const validateData = (jsonSchema, data) => {
  if (!jsonSchema) return true;
  const result = ajv.validate(jsonSchema, data);
  return result;
};

const createDefaultNameNote = (nameID = '') => {
  const [pcd] = UIDatabase.objects('PCDEvents');

  return {
    id: generateUUID(),
    entryDate: new Date(),
    patientEventID: pcd?.id ?? '',
    nameID,
  };
};

const getMostRecentPCD = patient => {
  const [pcdEvent] = UIDatabase.objects('PCDEvents');

  if (!pcdEvent) return null;

  const { id: pcdEventID } = pcdEvent;
  const { nameNotes = [] } = patient ?? {};

  if (!nameNotes.length) return null;

  const filtered = nameNotes.filter(({ patientEventID }) => patientEventID === pcdEventID);

  if (!filtered.length) return null;

  const sorted = filtered.sort(
    ({ entryDate: entryDateA }, { entryDate: entryDateB }) =>
      moment(entryDateB).valueOf() - moment(entryDateA).valueOf()
  );

  const [mostRecentPCD] = sorted;
  return mostRecentPCD;
};

const createSurveyNameNote = patient => (dispatch, getState) => {
  // Create a new name note which is seeded with the most recent PCD name note
  // of the patient.
  // Either the patient being passed has been fetched from the server, is a realm
  // instance or is a newly created patient. If it is a realm object, convert it to
  // a plain object. If the passed patient has a past name note, merge that with a
  // default name note which has the current time, new ID etc.
  const mostRecentPCD = getMostRecentPCD(patient);

  const seedPCD = mostRecentPCD?.toObject ? mostRecentPCD.toObject() : mostRecentPCD;
  const defaultNameNote = createDefaultNameNote(patient.id);
  const newNameNote = merge(seedPCD, defaultNameNote);
  newNameNote.data = newNameNote.data ?? {};

  // Get the survey schema as we need an initial validation to determine if
  // the seed has any fields which are required to be filled.
  const [surveySchema = {}] = selectSurveySchemas(getState);
  const { jsonSchema } = surveySchema;
  const isValid = validateData(jsonSchema, newNameNote.data);

  dispatch(select(newNameNote, isValid));
};

const select = (seed = createDefaultNameNote(), isValid) => ({
  type: NAME_NOTE_ACTIONS.SELECT,
  payload: { nameNote: seed, isValid },
});

const updateForm = (data, validator) => ({
  type: NAME_NOTE_ACTIONS.UPDATE_DATA,
  payload: { data, isValid: validator(data) },
});

const saveEditing = () => (dispatch, getState) => {
  const nameNote = selectCreatingNameNote(getState()) ?? {};
  UIDatabase.write(() => createRecord(UIDatabase, 'NameNote', nameNote));
  dispatch(reset());
};

const createNotes = (nameNotes = []) => {
  UIDatabase.write(() => {
    nameNotes.forEach(nameNote => {
      const { patientEventID, nameID } = nameNote;
      const name = UIDatabase.get('Name', nameID);
      const patientEvent = UIDatabase.get('PatientEvent', patientEventID);

      if (name && patientEvent) {
        const toSave = {
          id: nameNote.id,
          patientEvent,
          name,
          _data: JSON.stringify(nameNote?.data),
          entryDate: new Date(nameNote?.entryDate),
        };

        UIDatabase.update('NameNote', toSave);
      }
    });
  });

  return { type: NAME_NOTE_ACTIONS.CREATE };
};

const reset = () => ({
  type: NAME_NOTE_ACTIONS.RESET,
});

export const NameNoteActions = {
  createNotes,
  reset,
  createSurveyNameNote,
  updateForm,
  saveEditing,
};
