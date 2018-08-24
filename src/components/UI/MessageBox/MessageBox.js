import React from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import ModalHeader from '../ModalHeader/ModalHeader';
import Aux from '../../../hoc/Auxiliary';
import classes from './MessageBox.scss';

const messageBox = (props) => {
  const btnOk = <Button clicked={props.callBackMessageBoxOk} color="success" labelText="Ok" />;
  const btn = props.buttons === 'butOkCancel' ?
    <Aux>
      {btnOk}
      <Button clicked={props.callBackMessageBoxCancel} color="danger" labelText="Annuleren" />
    </Aux> :
    <Aux>{btnOk}</Aux>;

  return(
    <Modal show modalClass={props.modalClass} modalClosed={props.callBackMessageBoxCancel}>
      <div className={classes.MessageBox}>
        <ModalHeader title={props.messageTitle} type={props.type} />
        <div className={classes.Content}>{props.messageContent}</div>
        <div className={classes.Footer}>{btn}</div>
      </div>
    </Modal>
  );
}

export default messageBox;
