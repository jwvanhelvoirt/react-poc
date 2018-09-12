import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
// import Aux from '../../../hoc/auxiliary';
import Spinner from '../../ui/spinners/spinner/spinner';
// import FormParser from '../../parsers/formParser/formParser';
// import formConfig from '../../../config/forms/configFormUserSettings';
import { callServer } from '../../../api/api';

class ModLogout extends Component {

  componentWillMount = () => {
    this.logout();
  };

  // Call to the server to fetch user settings.
  logout = () => {
    callServer('put', 'api.logout', (response) => this.successGetHandler(response), (error) => this.errorGetHandler(error));
  };

  // Successfully logged out.
  successGetHandler = (response) => {
    console.log(response);
    localStorage.removeItem("magic");
    this.props.history.replace('/login');
    this.props.authenticateUser(false);
    // this.props.storeLanguage(response.data.language);
    // this.props.history.goBack();
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
