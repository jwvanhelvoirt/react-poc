import React from 'react';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary';
import classes from './ModalFooter.scss';

const modalFooter = (props) => {
  const okButDisabled = props.formIsValid === false  ? true : false;
  const labelOk = props.okButtonLabel ? props.okButtonLabel : 'keyOk';
  const labelCancel = props.cancelButtonLabel ? props.cancelButtonLabel : 'keyCancel';
  const butOk     = <Button clicked={props.callBackOk} color="success" labelText={[labelOk]} disabled={okButDisabled} />;
  const butCancel = <Button clicked={props.callBackCancel} color="danger" labelText={[labelCancel]} />;
  let but = null;

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
  }

  return (
    <div className={classes.Footer}>{but}</div>
  );
}

export default modalFooter;
