import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import ModalHeader from '../modalHeader/modalHeader';
import ModalFooter from '../modalFooter/modalFooter';
import UserInfo from '../userInfo/userInfo';
import Aux from '../../../hoc/auxiliary';
import classes from './messageBox.scss';

class MessageBox extends Component {

  eventListener = false;

  render = () => {
    console.log(this.props);
    const classesMb = this.props.contentExtraScrollZone ?
      [classes.Content, classes.ContentExtraScrollZone].join(' ') :
      classes.Content;

    const header = (
      this.props.header !== false ?
        <ModalHeader
          title={this.props.messageTitle}
          type={this.props.type}
          headerSize={this.props.headerSize}
          titleIcon={this.props.titleIcon}
          titleAlign={this.props.titleAlign}
          modal={this.props.modal}
        /> :
        null
    );

    const content = (
      <div className={classesMb}>
        {this.props.messageContent}
      </div>
    );

    const footer = (
      <ModalFooter
        buttons={this.props.buttons}
        focusButton={this.props.focusButton}
        buttonsClass={this.props.buttonsClass}
        formIsValid={this.props.formIsValid}
        okButtonLabel={this.props.okButtonLabel}
        cancelButtonLabel={this.props.cancelButtonLabel}
        callBackOk={this.props.callBackOk}
        callBackCancel={this.props.callBackCancel}
      />
    );

    const messageBox = (
      <div className={classes.MessageBox} onKeyUp={(event) => this.onKeyUp(event, this.props.callBackCancel)}>
        {header}
        <UserInfo msgFailedSubmit={this.props.msgFailedSubmit} />
        {content}
        {footer}
      </div>
    );

    const box = this.props.modal ?
      <Modal show modalClass={this.props.modalClass} modalClosed={this.props.callBackCancel}>{content}</Modal> :
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
