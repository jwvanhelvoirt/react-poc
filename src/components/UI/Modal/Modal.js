/**
* @brief   Returns a modal to be used as wrapper around forms, information dialogs etc..
* @params  modalClosed    Callback for closing the backdrop.
* @params  show          	Boolean indicating if the modal should be visible.
*/

import React, { Component } from 'react';

import classes from './Modal.scss';
import Aux from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  }

  render() {
    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div
          className={classes.Modal}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}>
          {this.props.children}
        </div>
      </Aux>
    )
  }
}

export default Modal;
