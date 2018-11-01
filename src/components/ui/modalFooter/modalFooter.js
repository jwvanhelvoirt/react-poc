import React from 'react';
import Button from '../button/button';
import Aux from '../../../hoc/auxiliary';
import * as trans from '../../../libs/constTranslates';
import classes from './modalFooter.scss';

const modalFooter = (props) => {
const { formIsValid, okButtonLabel, cancelButtonLabel, callBackOk, buttonsClass, callBackCancel, buttons, focusButton } = props;

  const okButDisabled = formIsValid === false  ? true : false;
  const labelOk = okButtonLabel ? okButtonLabel : trans.KEY_OK;
  const labelCancel = cancelButtonLabel ? cancelButtonLabel : trans.KEY_CANCEL;
  let but = null;

  const focusOk = focusButton === 'Ok' ? true : false;
  const focusCancel = focusButton === 'Cancel' ? true : false;

  let butOk = (
    <Button clicked={callBackOk} color="success" autoFocus={focusOk} buttonsClass={buttonsClass} labelText={[labelOk]}
      disabled={okButDisabled} />
  );

  const butCancel = (
    <Button clicked={callBackCancel} color="danger" autoFocus={focusCancel} buttonsClass={buttonsClass} labelText={[labelCancel]} />
  );

  switch (buttons) {
  case 'butOk':
    but = butOk;
    break;
  case 'butCancel':
    but = butCancel;
    break;
  case 'butOkCancel':
    but = <Aux>{butOk}{butCancel}</Aux>;
    break;
  default:
    but = butOk;
  };

  return (
    <div className={classes.Footer}>{but}</div>
  );
};

export default modalFooter;
