import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../store/actions';
import '../../assets/fontAwesome/fontAwesome';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Util } from 'reactstrap';
import Layout from '../layout/layout';
// import asynchComponent from './hoc/asynchComponent';
import Aux from '../../hoc/auxiliary';
import { callServer } from '../../api/api';
import SpinnerInit from '../ui/spinners/spinnerInit/spinnerInit';

//const asynchModInvoicing = asynchComponent(() => { // lazy loading werkt niet in één keer, nader uitzoeken.
//	return import('./containers/ModInvoicing/ModInvoicing');
//});

// Import components for all navigation item routes.
import Login from '../navigation/login/login';
import Dashboard from '../navigation/dashboard/dashboard';
import ModDocument from '../content/modules/modDocument';
import ModDocumentList from '../content/modules/modDocumentList';
import ModTask from '../content/modules/modTask';
import ModTaskList from '../content/modules/modTaskList';
import ModPerson from '../content/modules/modPerson';

// Import components for all navigation icon routes.
import ModSearch from '../content/modules/modSearch';
import ModPersonalSettings from '../content/modules/modPersonalSettings';
import ModLogout from '../content/modules/modLogout';
import ModAdmin from '../content/modules/modAdmin';

import Mod404 from '../content/modules/mod404';

import { isAuthNavItems, navItems } from '../../config/navigation/configNavigationItems';
import { isAuthNavIcons, navIcons } from '../../config/navigation/configNavigationIcons';

class App extends Component {

  loadPersonalSettings = () => {
    callServer('get', '/usersettings/read',
      (response) => this.successGetHandlerPersonalSettings(response), this.errorGetHandlerPersonalSettings);
  };

  successGetHandlerPersonalSettings = (response) => {
    this.props.storeLanguage(response.data[0].language);
    callServer('get', '/translates/read/' + response.data[0].language,
      (response) => this.successGetHandlerTranslates(response), this.errorGetHandlerTranslates);
  };

  errorGetHandlerPersonalSettings = (error) => {
    console.log(error);
  };

  successGetHandlerTranslates = (response) => {
    this.props.storeTranslates(response.data[0].translates);
    this.props.translatesLoaded();
  };

  errorGetHandlerTranslates = (error) => {
    console.log(error);
  };

  componentDidMount = () => {
    // Redirect the root route to the starting module
    if (this.props.location.pathname === "/") {
      this.props.authenticated ? this.props.history.replace('/dashboard') : this.props.history.replace('/login');
    }
  };

  componentDidUpdate = () => {
    // In case the user successfully logged in, redirect to '/dashboard'.
    if (this.props.authenticated && this.props.location.pathname === "/login") {
      this.props.history.replace('/dashboard');
    }
    this.loadPersonalSettings();
  };

  componentWillMount = () => {
    const magic = localStorage.getItem("magic"); // EZ2XS WE PROBABLY HAVE TO STORE IT IN THE STORE.

    if (magic) {
      // There is a magic in the local storage. Make a server call to check if this is the correct magic.
      const submitData = { MAGIC: magic };
      callServer('put', 'api.getMedewerkerInfo', (response) => this.successHandlerGetUserInfo(response), this.errorHandlerGetUserInfo, submitData);
    } else {
      // No magic in local storage.
      // The default of the store variable 'authenticated' is 'false', so the login screen will appear.
      this.props.magicChecked(true);
    }
  };

  successHandlerGetUserInfo = (response) => {
    this.props.authenticateUser(true);
    this.props.magicChecked(true);
  };

  errorHandlerGetUserInfo = (error) => {
    this.props.magicChecked(true);
  };

  render = () => {
    let layout = (
      <Layout navItems={navItems} navIcons={navIcons} toolbar={false}>
        <Switch>
          <Route path="/" component={Login} />
        </Switch>
      </Layout>
    );

    // if (!this.props.initTranslatesLoaded || !this.props.initMagicChecked) {
    if (!this.props.initMagicChecked) {
      layout = (
        <SpinnerInit />
      );
    } else if (this.props.authenticated) {
      layout = (
        <Layout navItems={navItems} navIcons={navIcons} toolbar={true}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />

            {isAuthNavItems.document ? <Route path="/document/list/:id" component={ModDocumentList} /> : null}
            {isAuthNavItems.document ? <Route path="/document" component={ModDocument} /> : null}

            {isAuthNavItems.task ? <Route path="/task/list/:id" component={ModTaskList} /> : null}
            {isAuthNavItems.task ? <Route path="/task" component={ModTask} /> : null}

            {isAuthNavItems.person ? <Route path="/person" component={ModPerson} /> : null}

            <Route path="/search" component={ModSearch} />
            <Route path="/personal" component={ModPersonalSettings} />
            <Route path="/logout" component={ModLogout} />
            {isAuthNavIcons.admin ? <Route path="/admin" component={ModAdmin} /> : null}

            {/* Every unexpected route results into a 404, except for the '/' route (the root) */}
            <Route component={Mod404} />
          </Switch>
        </Layout>
      );
    }

    return (
      Util.setGlobalCssModule(bootstrap),
      <Aux>{layout}</Aux>
    )
  };

}

const mapStateToProps = state => {
  return {
    authenticated: state.redMain.authenticated,
    initTranslatesLoaded: state.redMain.initTranslatesLoaded,
    initMagicChecked: state.redMain.initMagicChecked,
    language: state.redMain.transLanguage
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } ),
    magicChecked: (initMagicChecked) => dispatch( {type: types.INIT_MAGIC_CHECKED, initMagicChecked } ),
    translatesLoaded: () => dispatch( {type: types.INIT_TRANSLATES_LOADED } ),
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } ),
    storeTranslates: (translates) => dispatch( {type: types.TRANS_TRANSLATES_STORE, translates } )
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
