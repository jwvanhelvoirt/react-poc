import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as types from '../../../store/Actions';
import FormParser from '../../Parsers/FormParser/FormParser';
import formLogin from '../../../config/Forms/ConfigFormLogin';
import classes from './Login.scss';

class Login extends Component {
  state = {
    loadedListItem: null
  };

  onSubmitHandler = (response) => {
    const { authorized, magic } = response.data;

    if (authorized) {
      // Authorization was succesfull.
      localStorage.setItem("magic", magic);
      this.props.authenticateUser(true); // This will re-render the app component and show the dashboard.
      this.props.showUserInfo(false);
    } else {
      // Login was not successfull. User must be informed.
      // This re-renders the form, but now the user info message will be displayed.
      this.props.showUserInfo(true);
    }
  };

  componentWillMount = () => {
    // The form parser expects a key-value object with the initial values of the login form (empty in this case).
    const newPostData = {};
    for (let inputId in formLogin.inputs) {
      newPostData[inputId] = formLogin.inputs[inputId].value;
    }
    this.setState({ loadedListItem: newPostData });
  };

  render() {
    // The login form.
    return (
      <div className={classes.Login}>
        <FormParser
          configForm={formLogin}
          data={this.state.loadedListItem}
          onSubmit={this.onSubmitHandler}
          id={null}
          modal={true}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } ),
    showUserInfo: (formShowUserInfo) => dispatch( {type: types.FORM_USER_INFO, formShowUserInfo } )
  }
}

export default connect(null, mapDispatchToProps)(Login);

/*
Kijk naar localstate.
  Indien een waarde, dan kijken of de magic hetzelfde is als de magic op server.
    Is ie hetzelfde, dan plaatsen in store 'authenticated' op true zetten > Modules renderen.
    Is ie niet hetzelfde, dan loginscherm tonen.
  Indien geen waarde, dan login scherm tonen.

Loginscherm.
  Username en wachtwoord correct, dan localstate vullen en in store 'authenticated' op true zetten > Modules renderen.
  Username en wachtwoord NIET correct, dan loginscherm blijven tonen met melding (username en wachtwoord laten staan)
*/
