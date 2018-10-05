import React from 'react';
import Modal from '../modal/modal';
import ModalHeader from '../modalHeader/modalHeader';
import ModalFooter from '../modalFooter/modalFooter';
import UserInfo from '../userInfo/userInfo';
import Aux from '../../../hoc/auxiliary';
import classes from './messageBox.scss';

const messageBox = (props) => {

  const classesMb = props.contentExtraScrollZone ?
    [classes.Content, classes.ContentExtraScrollZone].join(' ') :
    classes.Content;

  const content = (
    <div className={classes.MessageBox}>
      <ModalHeader
        title={props.messageTitle}
        type={props.type}
        headerSize={props.headerSize}
        titleIcon={props.titleIcon}
        titleAlign={props.titleAlign}
      />
      <UserInfo msgFailedSubmit={props.msgFailedSubmit} />
      <div className={classesMb}>
        {props.messageContent}
      </div>
      <ModalFooter
        buttons={props.buttons}
        buttonsClass={props.buttonsClass}
        formIsValid={props.formIsValid}
        okButtonLabel={props.okButtonLabel}
        cancelButtonLabel={props.cancelButtonLabel}
        callBackOk={props.callBackOk}
        callBackCancel={props.callBackCancel}
      />
    </div>
  );

  const box = props.modal ? <Modal show modalClass={props.modalClass} modalClosed={props.callBackCancel}>{content}</Modal> : <Aux>{content}</Aux>;

  return(
    <Aux>{box}</Aux>
  );
};

export default messageBox;
