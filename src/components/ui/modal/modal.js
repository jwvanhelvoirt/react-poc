/**
* @brief   Returns a modal to be used as wrapper around forms, information dialogs etc..
* @params  modalClosed    Callback for closing the backdrop.
* @params  show          	Boolean indicating if the modal should be visible.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import Aux from '../../../hoc/auxiliary';
import Backdrop from '../backdrop/backdrop';
import classes from './modal.scss';

class Modal extends Component {
  constructor(props) {
    super(props);

    this.localData = {
      messageBox1: this.props.messageBox1,
      messageBox2: this.props.messageBox2
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
  };

  componentWillMount = () => {
    // For now we support three levels of message boxes. Probably two is enough, but just in case.
    if (!this.props.messageBox1) {
      this.props.openMessageBox1()
    } else if (!this.props.messageBox2) {
        this.props.openMessageBox2()
    }
  };

  componentWillUnmount = () => {
    if (this.props.messageBox2) {
      this.props.closeMessageBox2()
    } else if (this.props.messageBox1) {
      this.props.closeMessageBox1()
    }
  };

  render = () => {
    const { messageBox1, messageBox2 } = this.localData;

    // Complex construction for multiple MessageBoxes on screen.
    // Complexity is the positioning and z-index of the modal and the backdrop.
    // We have support up to three message boxes now.
    const classNames = messageBox1 ?
      [classes[this.props.modalClass], classes.Pos2].join(' ') :
      (messageBox2 ? [classes[this.props.modalClass], classes.Pos3].join(' ') :
        [classes[this.props.modalClass], classes.Pos1].join(' '));

    return (
      <Aux>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} messageBox1={messageBox1} messageBox2={messageBox2} />
        <div
          className={classNames}
          style={{
            transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
            opacity: this.props.show ? '1' : '0'
          }}>
          {this.props.children}
        </div>
      </Aux>
    )
  };

}

const mapStateToProps = state => {
  return {
    messageBox1: state.redMain.messageBox1,
    messageBox2: state.redMain.messageBox2
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openMessageBox1: () => dispatch( {type: types.MESSAGE_BOX1_OPEN } ),
    openMessageBox2: () => dispatch( {type: types.MESSAGE_BOX2_OPEN } ),
    closeMessageBox1: () => dispatch( {type: types.MESSAGE_BOX1_CLOSE } ),
    closeMessageBox2: () => dispatch( {type: types.MESSAGE_BOX2_CLOSE } )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
