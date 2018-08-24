import React from 'react';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary';
import classes from './ModalFooter.scss';

const modalFooter = (props) => {
  const btnOk = <Button clicked={props.callBackOk} color="success" labelText="Ok" />;
  const btn = props.buttons === 'butOkCancel' ?
    <Aux>
      {btnOk}
      <Button clicked={props.callBackCancel} color="danger" labelText="Annuleren" />
    </Aux> :
    <Aux>{btnOk}</Aux>;

  return (
    <div className={classes.Footer}>{btn}</div>
  );
}

export default modalFooter;
