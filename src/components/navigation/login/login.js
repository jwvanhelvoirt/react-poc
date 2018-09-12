import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import FormParser from '../../parsers/formParser/formParser';
import formLogin from '../../../config/forms/configFormLogin';
import classes from './login.scss';

class Login extends Component {
  state = {
    loadedListItem: null
  };

  onSubmitHandler = (response) => {
    // Authorization was succesfull.
    console.log(response.data);
    console.log(this.props.formSubmitData);

    const { MAGIC, idmedewerker, internaluser } = response.data;
    const { login, remember_login } = this.props.formSubmitData;

    localStorage.setItem("magic", MAGIC);

    if (remember_login === 1) {
      localStorage.setItem("user", login);
    } else {
      localStorage.removeItem("user");
    }

    this.props.authenticateUser(true); // This will re-render the app component and show the dashboard.
    this.props.showUserInfo(false);
  };

  onErrorHandler = (error) => {
    // Authorization was NOT succesfull.
    console.log(error);
    this.props.showUserInfo(true);
  };

  onSubmitHandler1 = (response) => {
    console.log(response.data);
    const { authorized, magic, rememberPrevLogin, username } = response.data;

    if (authorized) {
      // Authorization was succesfull.
      localStorage.setItem("magic", magic);

      if (rememberPrevLogin) {
        localStorage.setItem("user", username);
      } else {
        localStorage.removeItem("user");
      }

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
          onError={this.onErrorHandler}
          id={null}
          modal={true}
          submitUrl={'api.login'}
        />
      </div>
    );
  };

}

const mapStateToProps = state => {
  return {
    formSubmitData: state.redMain.formSubmitData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } ),
    showUserInfo: (formShowUserInfo) => dispatch( {type: types.FORM_USER_INFO, formShowUserInfo } )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

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
