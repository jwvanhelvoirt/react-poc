import React from 'react';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary';
import Label from '../Label/Label';
import classes from './ModalFooter.scss';

const modalFooter = (props) => {
  const labelOk = <Label labelKey='keyOk' propercase={true} />
  const labelCancel = <Label labelKey='keyCancel' propercase={true} />
  const okButDisabled = props.formIsValid === false  ? true : false;
  const butOk     = <Button clicked={props.callBackOk} color="success" labelText={labelOk} disabled={okButDisabled} />;
  const butCancel = <Button clicked={props.callBackCancel} color="danger" labelText={labelCancel} />;
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
  defaut:
    but = butOk;
  }

  return (
    <div className={classes.Footer}>{but}</div>
  );
}

export default modalFooter;
