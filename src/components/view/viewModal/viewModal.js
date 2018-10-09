import React from 'react';
import MessageBox from '../../ui/messageBox/messageBox';

const viewModal = (props) => {
  const { modalClass, messageTitle, messageType, messageContent, buttons, focusButton,
    callBackOk, callBackCancel, modal } = props.viewModalData;

  let modalView = null;
  if (props.show) {
    modalView = (
      <MessageBox modalClass={modalClass} messageTitle={messageTitle} type={messageType}
        messageContent={messageContent} buttons={buttons} focusButton={focusButton}
        callBackOk={callBackOk} callBackCancel={callBackCancel} modal={modal}
      />
    );
  }

  return modalView;
}

export default viewModal;
