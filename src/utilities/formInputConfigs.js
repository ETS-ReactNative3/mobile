/**
 * mSupply Mobile
 * Sustainable Solutions (NZ) Ltd. 2019
 */

import moment from 'moment';
import { UIDatabase } from '../database/index';

/**
 * File contains constants and config objects which declaritively define
 * form inputs to be used with `FormControl`.
 *
 * For a particular form, add a field to FIELD_CONFIGS, which will define what
 * form input configs to use.
 *
 * FormInputConfig have the following structure:
 * {
 *     type: 'text' : A ValidationTextInput component
 *     initialValue : The value to seed the form input component with.
 *     key: A key for the underlying record.
 *     isRequired : Indicator whether this input is required to be filled for completion.
 *     label: A label for the form input.
 *     invalidMessage: A message when the input is invalid.
 *     validator: A function to call to determine if the current input is valid.
 * }
 */

const FORM_INPUT_KEYS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  CODE: 'code',
  DATE_OF_BIRTH: 'dateOfBirth',
  EMAIL: 'emailAddress',
  PHONE: 'phoneNumber',
  COUNTRY: 'country',
  ADDRESS_ONE: 'addressOne',
  ADDRESS_TWO: 'addressTwo',
  REGISTRATION_CODE: 'registrationCode',
  POLICY_NUMBER_FAMILY: 'policyNumberFamily',
  POLICY_NUMBER_PERSON: 'policyNumberPerson',
  POLICY_PROVIDER: 'insuranceProvider',
  POLICY_TYPE: 'policyType',
  IS_ACTIVE: 'isActive',
  DISCOUNT_RATE: 'discountRate',
};

const FORM_INPUT_CONFIGS = seedObject => ({
  [FORM_INPUT_KEYS.FIRST_NAME]: {
    type: 'text',
    initialValue: '',
    key: 'firstName',
    validator: input => input.length > 0,
    isRequired: true,
    label: 'First name:',
    invalidMessage: 'need to be x',
  },
  [FORM_INPUT_KEYS.LAST_NAME]: {
    type: 'text',
    initialValue: '',
    key: 'lastName',
    validator: input => input.length > 0,
    isRequired: true,
    label: 'Last name:',
  },
  [FORM_INPUT_KEYS.CODE]: {
    type: 'text',
    initialValue: '',
    key: 'code',
    validator: input => input.length > 0 && input.length < 20,
    isRequired: true,
    label: 'Code:',
  },
  [FORM_INPUT_KEYS.DATE_OF_BIRTH]: {
    type: 'date',
    initialValue: '',
    key: 'dateOfBirth',
    invalidMessage: 'Must be a date in the format DD/MM/YYYY',
    isRequired: false,
    validator: input => moment(input, 'DD/MM/YYYY', null, true).isValid(),
    label: 'Date of birth:',
  },
  [FORM_INPUT_KEYS.EMAIL]: {
    type: 'text',
    initialValue: '',
    key: 'emailAddress',
    isRequired: false,
    label: 'Email:',
  },
  [FORM_INPUT_KEYS.PHONE]: {
    type: 'text',
    initialValue: '',
    key: 'phoneNumber',
    isRequired: false,
    label: 'Phone:',
  },
  [FORM_INPUT_KEYS.COUNTRY]: {
    type: 'text',
    initialValue: '',
    key: 'country',
    validator: input => input.length < 20,
    isRequired: false,
    label: 'Country:',
  },
  [FORM_INPUT_KEYS.ADDRESS_ONE]: {
    type: 'text',
    initialValue: '',
    key: 'addressOne',
    validator: input => input.length < 50,
    isRequired: false,
    label: 'Address 1:',
  },
  [FORM_INPUT_KEYS.ADDRESS_TWO]: {
    type: 'text',
    initialValue: '',
    key: 'addressTwo',
    validator: input => input.length < 50,
    isRequired: false,
    label: 'Address 2:',
  },
  [FORM_INPUT_KEYS.REGISTRATION_CODE]: {
    type: 'text',
    initialValue: '',
    key: 'registrationCode',
    validator: input => input.length < 50,
    isRequired: true,
    label: 'Registration code:',
  },
  [FORM_INPUT_KEYS.POLICY_NUMBER_PERSON]: {
    type: 'text',
    initialValue: '',
    key: 'policyNumberPerson',
    validator: input =>
      input.length > 0 &&
      input.length < 50 &&
      UIDatabase.objects('InsurancePolicy').filtered(
        'policyNumberPerson == $0 && id != $1',
        input,
        seedObject?.id ?? ''
      ).length === 0,
    isRequired: true,
    invalidMessage:
      'Must be between 0 and 50 characters, and must be a unique personal policy number',
    label: 'Person policy number:',
  },
  [FORM_INPUT_KEYS.POLICY_NUMBER_FAMILY]: {
    type: 'text',
    initialValue: '',
    key: 'policyNumberFamily',
    validator: input => input.length > 0 && input.length < 50,
    isRequired: true,
    label: 'Family policy number:',
  },
  [FORM_INPUT_KEYS.POLICY_PROVIDER]: {
    type: 'dropdown',
    initialValue: UIDatabase.objects('InsuranceProvider')[0],
    key: 'insuranceProvider',
    label: 'Policy provider:',
    options: UIDatabase.objects('InsuranceProvider'),
    optionKey: 'name',
  },
  [FORM_INPUT_KEYS.IS_ACTIVE]: {
    type: 'toggle',
    initialValue: true,
    key: 'isActive',
    options: [true, false],
    optionLabels: ['Yes', 'No'],
    label: 'Is Active:',
  },
  [FORM_INPUT_KEYS.POLICY_TYPE]: {
    type: 'toggle',
    initialValue: 'personal',
    key: 'type',
    options: ['personal', 'business'],
    optionLabels: ['Personal', 'Business'],
    label: 'Policy Type:',
  },
  [FORM_INPUT_KEYS.DISCOUNT_RATE]: {
    type: 'slider',
    initialValue: 25,
    key: 'discountRate',
    maximumValue: 100,
    minimumValue: 0,
    step: 0.1,
    label: 'Discount Rate:',
  },
});

const FORM_CONFIGS = {
  patient: [
    FORM_INPUT_KEYS.FIRST_NAME,
    FORM_INPUT_KEYS.LAST_NAME,
    FORM_INPUT_KEYS.CODE,
    FORM_INPUT_KEYS.DATE_OF_BIRTH,
    FORM_INPUT_KEYS.EMAIL,
    FORM_INPUT_KEYS.PHONE,
    FORM_INPUT_KEYS.ADDRESS_ONE,
    FORM_INPUT_KEYS.ADDRESS_TWO,
    FORM_INPUT_KEYS.COUNTRY,
  ],
  prescriber: [
    FORM_INPUT_KEYS.FIRST_NAME,
    FORM_INPUT_KEYS.LAST_NAME,
    FORM_INPUT_KEYS.REGISTRATION_CODE,
    FORM_INPUT_KEYS.EMAIL,
    FORM_INPUT_KEYS.PHONE,
    FORM_INPUT_KEYS.ADDRESS_ONE,
    FORM_INPUT_KEYS.ADDRESS_TWO,
  ],
  insurancePolicy: [
    FORM_INPUT_KEYS.POLICY_NUMBER_PERSON,
    FORM_INPUT_KEYS.POLICY_NUMBER_FAMILY,
    FORM_INPUT_KEYS.DISCOUNT_RATE,
    FORM_INPUT_KEYS.POLICY_PROVIDER,
    FORM_INPUT_KEYS.IS_ACTIVE,
    FORM_INPUT_KEYS.POLICY_TYPE,
  ],
};

export const getFormInputConfig = (formName, seedObject) => {
  const formInputConfigs = FORM_INPUT_CONFIGS(seedObject);
  const formConfig = FORM_CONFIGS[formName].map(config => formInputConfigs[config]);

  if (!seedObject) return formConfig;

  return formConfig.map(({ key, initialValue, ...restOfConfig }) => ({
    ...restOfConfig,
    key,
    initialValue: seedObject[key] ?? initialValue,
  }));
};