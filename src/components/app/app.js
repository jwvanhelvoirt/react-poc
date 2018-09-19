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
import Logout from '../navigation/logout/logout';
import Dashboard from '../navigation/dashboard/dashboard';
import ModProject from '../content/modules/modProject';
import ModDocumentList from '../content/modules/modDocumentList';
import ModTaskList from '../content/modules/modTaskList';
import ModPerson from '../content/modules/modPerson';

// Import components for all navigation icon routes.
import ModSearch from '../content/modules/modSearch';
import ModPersonalSettings from '../content/modules/modPersonalSettings';
import ModAdmin from '../content/modules/modAdmin';

import Mod404 from '../content/modules/mod404';

import { isAuthNavItems, navItems } from '../../config/navigation/configNavigationItems';
import { isAuthNavIcons, navIcons } from '../../config/navigation/configNavigationIcons';

class App extends Component {

  getLanguage = () => {
    // Get the language from the localStorage or from an app wide default.
    return localStorage.getItem("language") ? localStorage.getItem("language") : this.props.language;
  };

  componentWillMount = () => {
    // console.log('componentWillMount');

    const languageInit = this.getLanguage();
    this.props.storeLanguage(languageInit);
    localStorage.setItem("language", languageInit);

    callServer('put', 'api.public.getTranslationTable?language=' + languageInit,
      (response) => this.successGetHandlerTranslates(response),
      (error) => this.errorGetHandlerTranslates);
  };

  successGetHandlerTranslates = (response) => {
    // console.log(response.data);
    // console.log('successGetHandlerTranslates');
    this.props.storeTranslates(response.data);
    this.props.translatesLoaded();

    const magic = localStorage.getItem("magic");
    if (magic) {
      // There is a magic in the local storage. Make a server call to check if this is the correct magic.
      this.getUserSettings();
    } else {
      // No magic in local storage.
      // The default of the store variable 'authenticated' is 'false', so the login screen will appear.
      this.props.magicChecked(true); // TODO: this can probably become local state instead of store state.
                                     // Same goes for authenticateUser.
    }
  };

  errorGetHandlerTranslates = (error) => {
    console.log(error);
  };


  getUserSettings = () => {
    // console.log('LOAD USER SETTINGS');
    const magic = localStorage.getItem("magic");
    const submitData = { MAGIC: magic };
    callServer('put', 'api.getMedewerkerInfo',
      (response) => this.successHandlerGetUserInfo(response),
      (error) => this.errorHandlerGetUserInfo(error), submitData);
  };

  componentDidMount = () => {
    // Redirect the root route to the starting module
    if (this.props.location.pathname === "/") {
      this.props.authenticated ? this.props.history.replace('/dashboard') : this.props.history.replace('/login');
    }
  };

  componentDidUpdate = () => {
    // console.log('componentDidUpdate');

    if (this.props.loadUserSettings) {
      console.log('We have to load the usersettings yet!');
      this.getUserSettings();
      this.props.setLoadUserSettings(false);
    }

    // In case the user successfully logged in, redirect to '/dashboard'.
    if (this.props.authenticated && this.props.location.pathname === "/login") {
      this.props.history.replace('/dashboard');
    }
  };

  successHandlerGetUserInfo = (response) => {
    // console.log('successHandlerGetUserInfo');

    // A successfull response from an api endpoint implicitly indicates that the magic is correct.
    // this.props.setLoadUserSettings(false); // User settings have been loaded, do not load them again.
    this.props.authenticateUser(true); // This by-passes the login screen.
    this.props.magicChecked(true); // This by-passes the initial spinner.

    if (response.data.settings.language !== this.getLanguage()) {
      console.log("USER LANG <> LOCAL LANG");
      this.props.storeLanguage(response.data.settings.language);
      localStorage.setItem("language", response.data.settings.language);
      callServer('put', 'api.public.getTranslationTable?language=' + response.data.settings.language,
        (response) => this.successGetHandlerTranslatesReload(response),
        (error) => this.errorGetHandlerTranslatesReload);
    } else {
      console.log("USER LANG = LOCAL LANG");
      this.props.translatesLoaded();
      this.props.storeLanguage(response.data.settings.language);
      localStorage.setItem("language", response.data.settings.language);
    }
  };

  errorHandlerGetUserInfo = (error) => {
    this.props.magicChecked(true); // This by-passes the initial spinner.
    this.props.translatesLoaded();
  };

  successGetHandlerTranslatesReload = (response) => {
console.log('successGetHandlerTranslatesReload');
    this.props.storeTranslates(response.data);
    this.props.translatesLoaded();
  };

  errorGetHandlerTranslatesReload = (error) => {
    console.log(error);
  };

  render = () => {
    let layout = (
      <Layout toolbar={false}>
        <Switch>
          <Route path="/" component={Login} />
        </Switch>
      </Layout>
    );

    if (!this.props.initTranslatesLoaded || !this.props.initMagicChecked) {
      layout = (
        <SpinnerInit />
      );
    } else if (this.props.authenticated) {
      layout = (
        <Layout navItems={navItems} navIcons={navIcons} toolbar={true}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />

            {isAuthNavItems.document ? <Route path="/document/list/:id" component={ModDocumentList} /> : null}
            {isAuthNavItems.document ? <Route path="/document" component={ModProject} /> : null}

            {isAuthNavItems.task ? <Route path="/task/list/:id" component={ModTaskList} /> : null}
            {isAuthNavItems.task ? <Route path="/task" component={ModProject} /> : null}

            {isAuthNavItems.person ? <Route path="/person" component={ModPerson} /> : null}

            <Route path="/search" component={ModSearch} />
            <Route path="/personal" component={ModPersonalSettings} />
            <Route path="/logout" component={Logout} />
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
    language: state.redMain.transLanguage,
    loadUserSettings: state.redMain.loadUserSettings
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } ),
    magicChecked: (initMagicChecked) => dispatch( {type: types.INIT_MAGIC_CHECKED, initMagicChecked } ),
    translatesLoaded: () => dispatch( {type: types.INIT_TRANSLATES_LOADED } ),
    setLoadUserSettings: (loadUserSettings) => dispatch( {type: types.LOAD_USER_SETTINGS, loadUserSettings } ),
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } ),
    storeTranslates: (translates) => dispatch( {type: types.TRANS_TRANSLATES_STORE, translates } )
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
