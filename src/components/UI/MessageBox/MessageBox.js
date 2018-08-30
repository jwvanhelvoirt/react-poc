import React from 'react';
import Modal from '../Modal/Modal';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import Aux from '../../../hoc/Auxiliary';
import classes from './MessageBox.scss';

const messageBox = (props) => {

  const content = (
    <div className={classes.MessageBox}>
      <ModalHeader title={props.messageTitle} type={props.type} />
      <div className={classes.Content}>{props.messageContent}</div>
      <ModalFooter buttons={props.buttons} formIsValid={props.formIsValid}
        callBackOk={props.callBackOk} callBackCancel={props.callBackCancel} />
    </div>
  );

  const box = props.modal ? <Modal show modalClass={props.modalClass} modalClosed={props.callBackCancel}>{content}</Modal> : <Aux>{content}</Aux>;

  return(
    <Aux>{box}</Aux>
  );
}

export default messageBox;
