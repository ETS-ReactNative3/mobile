import { VACCINE_PRESCRIPTION_ACTIONS } from '../../actions/Entities';
import { WIZARD_ACTIONS } from '../../actions/WizardActions';
import { UIDatabase } from '../../database';

const initialState = () => ({
  creating: undefined,
  hasRefused: false,
  selectedVaccines: [],
  selectedBatches: [],
  vaccines: UIDatabase.objects('Vaccine').sorted('name'),
  vaccinator: null,
  bonusDose: false,
  historyIsOpen: false,
});

export const VaccinePrescriptionReducer = (state = initialState(), action) => {
  const { type } = action;

  switch (type) {
    case VACCINE_PRESCRIPTION_ACTIONS.SELECT_DEFAULT_VACCINE: {
      const { payload } = action;
      const { selectedVaccines, selectedBatches } = payload;

      return { ...state, selectedVaccines, selectedBatches };
    }

    case WIZARD_ACTIONS.SWITCH_TAB: {
      const { payload } = action;
      const { tab } = payload;

      if (tab === 0) return initialState();

      return state;
    }

    case VACCINE_PRESCRIPTION_ACTIONS.RESET:
    case 'GO_BACK': {
      // reset if heading back
      return initialState();
    }

    case VACCINE_PRESCRIPTION_ACTIONS.CREATE: {
      const { payload } = action;

      const { prescription, vaccinator } = payload;

      return { ...state, creating: prescription, vaccinator };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.SELECT_VACCINE: {
      const { payload } = action;
      const { vaccine, batch } = payload;

      return { ...state, selectedVaccines: [vaccine], selectedBatches: [batch], hasRefused: false };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.SELECT_BATCH: {
      const { payload } = action;
      const { itemBatch } = payload;

      return { ...state, selectedBatches: [itemBatch] };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.SELECT_VACCINATOR: {
      const { payload } = action;
      const { vaccinator } = payload;

      return { ...state, vaccinator };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.SET_REFUSAL: {
      const { payload } = action;
      const { hasRefused, selectedVaccines, selectedBatches } = payload;

      if (hasRefused) {
        return {
          ...state,
          hasRefused,
          bonusDose: false,
          selectedVaccines: [],
          selectedBatches: [],
        };
      }

      return { ...state, hasRefused, selectedVaccines, selectedBatches };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.SET_BONUS_DOSE: {
      const { payload } = action;
      const { toggle } = payload;

      return { ...state, bonusDose: toggle };
    }

    case VACCINE_PRESCRIPTION_ACTIONS.TOGGLE_HISTORY: {
      const { payload } = action;
      const { toggle } = payload;

      return { ...state, historyIsOpen: toggle };
    }

    default: {
      return state;
    }
  }
};
