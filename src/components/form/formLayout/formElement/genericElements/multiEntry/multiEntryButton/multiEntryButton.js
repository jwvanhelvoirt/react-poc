import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../../../../libs/constIcons';
import classes from './multiEntryButton.scss';

const multiEntryButton = (props) => {

  const { classButton, clicked } = props;

  const icon = classButton === 'Add' ? icons.ICON_PLUS : icons.ICON_MINUS;

  return (
    <button className={classes[classButton]} onClick={clicked}>
      <FontAwesomeIcon icon={['far', icon]} />
    </button>
  );
}

export default multiEntryButton;
