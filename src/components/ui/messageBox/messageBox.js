import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import ModalHeader from '../modalHeader/modalHeader';
import ModalFooter from '../modalFooter/modalFooter';
import UserInfo from '../userInfo/userInfo';
import Aux from '../../../hoc/auxiliary';
import classes from './messageBox.scss';

class MessageBox extends Component {

  render = () => {
    const { contentExtraScrollZone, header, messageTitle, type, headerSize, titleIcon, titleAlign, modal, footer,
      buttons, focusButton, buttonsClass, formIsValid, okButtonLabel, cancelButtonLabel, callBackOk, callBackCancel,
      msgFailedSubmit, messageContent, modalClass} = this.props;

    const classesMb = contentExtraScrollZone ?
      [classes.Content, classes.ContentExtraScrollZone].join(' ') :
      classes.Content;

    const headerDisplay = header !== false ?
    (
      <ModalHeader
        title={messageTitle}
        type={type}
        headerSize={headerSize}
        titleIcon={titleIcon}
        titleAlign={titleAlign}
        modal={modal}
      />
    ) :
    null;

    const footerDisplay = footer !== false ?
    (
      <ModalFooter
        buttons={buttons}
        focusButton={focusButton}
        buttonsClass={buttonsClass}
        formIsValid={formIsValid}
        okButtonLabel={okButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        callBackOk={callBackOk}
        callBackCancel={callBackCancel}
      />
    ) :
    null;

    const messageBox = (
      <div className={classes.MessageBox} onKeyUp={(event) => this.onKeyUp(event, callBackCancel)}>
        {headerDisplay}
        <UserInfo msgFailedSubmit={msgFailedSubmit} />
        <div className={classesMb}>
          {messageContent}
        </div>
        {footerDisplay}
      </div>
    );

    const box = modal ?
      <Modal show modalClass={modalClass} modalClosed={callBackCancel}>{messageBox}</Modal> :
      <Aux>{messageBox}</Aux>;

    return(
      <Aux>{box}</Aux>
    );
  };

  onKeyUp = (event, callBackCancel) => {
    // If user presses ESCAPE, we should cancel the form.
    if (event.keyCode === 27) {
      callBackCancel();
    }
  };

  handleMbEnter = () => {
    // If the user tabs outside the modal, the cursor is focussed automatically on the first input.
    const elem = this.mb.querySelector('input');
    if (elem) {
      // elem.focus(); // This cannot be done, because a dropdown of a form input is positioned OUTSIDE the modal.
    }
  };

}

const mapStateToProps = state => {
  const { messageBox2 } = state.redMain;
  return { messageBox2 };
};

export default connect(mapStateToProps)(MessageBox);
