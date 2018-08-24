import React from 'react';
import Modal from '../Modal/Modal';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import classes from './MessageBox.scss';

const messageBox = (props) => {
  return(
    <Modal show modalClass={props.modalClass} modalClosed={props.callBackCancel}>
      <div className={classes.MessageBox}>
        <ModalHeader title={props.messageTitle} type={props.type} />
        <div className={classes.Content}>{props.messageContent}</div>
        <ModalFooter buttons={props.buttons} callBackOk={props.callBackOk} callBackCancel={props.callBackCancel} />
      </div>
    </Modal>
  );
}

export default messageBox;
