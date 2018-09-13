import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import Spinner from '../../ui/spinners/spinner/spinner';
import { callServer } from '../../../api/api';

class ModLogout extends Component {

  componentWillMount = () => {
    this.logout();
  };

  logout = () => {
    callServer('put', 'api.logout', (response) => this.successGetHandler(response), (error) => this.errorGetHandler(error));
  };

  // Successfully logged out.
  successGetHandler = (response) => {
    console.log(response);
    localStorage.removeItem("magic");
    this.props.history.replace('/login');
    this.props.authenticateUser(false);
  };

  // Log out was NOT successful.
  errorGetHandler = (error) => {
    console.log(error);
  };

  render = () => {
    return (
      <Spinner />
    );
	};

}

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } )
  }
};

export default withRouter(connect(null, mapDispatchToProps)(ModLogout));
