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

  componentDidMount = () => {
    // When the component is mounted, add the DOM listener to the "mb" elem.
    // (The "mb" elem is assigned in the render function.)
    this.mb.addEventListener('transitionend', this.handleMbEnter);
    this.eventListener = true;
  };

  componentWillUnmount = () => {
    // Make sure to remove the DOM listener when the component is unmounted.
    this.mb.removeEventListener("transitionend", this.handleMbEnter);
  };

  componentDidUpdate = () => {
    if (!this.eventListener) {
        this.handleMbEnter();
    }

    if (this.props.trapFocus && this.props.messageBox2) {
      this.mb.removeEventListener("transitionend", this.handleMbEnter);
      this.eventListener = false;
    } else {
      this.mb.addEventListener('transitionend', this.handleMbEnter);
      this.eventListener = true;
    }
  };

  render = () => {
    const classesMb = this.props.contentExtraScrollZone ?
      [classes.Content, classes.ContentExtraScrollZone].join(' ') :
      classes.Content;

    const content = (
      <div ref={elem => this.mb = elem} className={classes.MessageBox} onKeyUp={(event) => this.onKeyUp(event, this.props.callBackCancel)}>
        <ModalHeader
          title={this.props.messageTitle}
          type={this.props.type}
          headerSize={this.props.headerSize}
          titleIcon={this.props.titleIcon}
          titleAlign={this.props.titleAlign}
          modal={this.props.modal}
        />
        <UserInfo msgFailedSubmit={this.props.msgFailedSubmit} />
        <div className={classesMb}>
          {this.props.messageContent}
        </div>
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
      </div>
    );

    const box = this.props.modal ?
      <Modal show modalClass={this.props.modalClass} modalClosed={this.props.callBackCancel}>{content}</Modal> :
      <Aux>{content}</Aux>;

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
