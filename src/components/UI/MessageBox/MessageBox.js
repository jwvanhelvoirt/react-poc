import React from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary';
import classes from './MessageBox.scss';

const MessageBox = (props) => {
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
        <div className={classes.Header}>{props.messageTitle}</div>
        <div className={classes.Content}>{props.messageContent}</div>
        <div className={classes.Footer}>{btn}</div>
      </div>
    </Modal>
  );
}

export default MessageBox;
