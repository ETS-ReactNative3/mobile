/* eslint-disable import/prefer-default-export */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { LANGUAGE_CODES } from '../localization/index';

import { KiribatiFlag, EnglishFlag, LaosFlag, TetumFlag, FrenchFlag } from './images';

const LANGUAGE_TO_FLAG = {
  [LANGUAGE_CODES.FRENCH]: FrenchFlag,
  [LANGUAGE_CODES.TETUM]: TetumFlag,
  [LANGUAGE_CODES.ENGLISH]: EnglishFlag,
  [LANGUAGE_CODES.KIRIBATI]: KiribatiFlag,
  [LANGUAGE_CODES.LAOS]: LaosFlag,
};

export const Flag = ({ style, flag }) => {
  const FlagImage = LANGUAGE_TO_FLAG[flag];
  return <FlagImage style={style} />;
};

Flag.defaultProps = { style: { width: 55, height: 33 } };
Flag.propTypes = { style: PropTypes.object, flag: PropTypes.string.isRequired };
