import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser } from '../../../store/actions';
import * as routes from '../../../libs/constRoutes';
import Spinner from '../../ui/spinners/spinner/spinner';
import { callServer } from '../../../api/api';

class Logout extends Component {

  componentWillMount = () => {
    this.logout();
  };

  logout = () => {
    callServer('put', 'call/api.logout', (response) => this.successGetHandler(response), (error) => this.errorGetHandler(error));
  };

  // Successfully logged out.
  successGetHandler = (response) => {
    localStorage.removeItem('magic');
    this.props.history.replace(routes.ROUTE_LOGIN);
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
    authenticateUser: (authenticate) => dispatch(authenticateUser(authenticate))
  }
};

export default withRouter(connect(null, mapDispatchToProps)(Logout));
