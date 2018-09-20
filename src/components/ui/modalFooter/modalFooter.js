import React from 'react';
import Button from '../button/button';
import Aux from '../../../hoc/auxiliary';
import * as trans from '../../../libs/translates';
import classes from './modalFooter.scss';

const modalFooter = (props) => {
  const okButDisabled = props.formIsValid === false  ? true : false;
  const labelOk = props.okButtonLabel ? props.okButtonLabel : trans.KEY_OK;
  const labelCancel = props.cancelButtonLabel ? props.cancelButtonLabel : trans.KEY_CANCEL;
  let but = null;

  const butOk =
    <Button clicked={props.callBackOk} color="success" buttonsClass={props.buttonsClass} labelText={[labelOk]} disabled={okButDisabled} />;

  const butCancel =
    <Button clicked={props.callBackCancel} color="danger" buttonsClass={props.buttonsClass} labelText={[labelCancel]} />;

  switch (props.buttons) {
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
