import React from 'react';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary';
import classes from './ModalFooter.scss';

const modalFooter = (props) => {
  let but = null;
  let butOk     = <Button clicked={props.callBackOk} color="success" labelText="Ok" />;
  let butCancel = <Button clicked={props.callBackCancel} color="danger" labelText="Annuleren" />;

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
