import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser, magicChecked, setLoadUserSettings, storeLanguage, storeUserInfo,
  storeTranslates, translatesLoaded } from '../../store/actions';
import * as routes from '../../libs/constRoutes';
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
import ModProject from '../content/modules/modProject';
import ModDocumentList from '../content/modules/modDocumentList';
import ModTaskList from '../content/modules/modTaskList';
import ModPerson from '../content/modules/modPerson';

// Import components for all navigation icon routes.
import ModSearch from '../content/modules/modSearch';
import ModPersonalSettings from '../content/modules/modPersonalSettings';
import Logout from '../navigation/logout/logout';
import ModAdmin from '../content/modules/modAdmin';

import ModAcquisitionList from '../content/modules/modAcquisitionList';
import ModCertificationList from '../content/modules/modCertificationList';
import ModRecruitmentList from '../content/modules/modRecruitmentList';
import ModSupportList from '../content/modules/modSupportList';
import ModRegistrationList from '../content/modules/modRegistrationList';

// External portals.
import ModSupport from '../content/modules/modSupport';
import ModSupportDetails from '../content/modules/modSupportDetails';

import ModGdpr from '../content/modules/modGdpr';
import ModHelp from '../content/modules/modHelp';
import ModRelease from '../content/modules/modRelease';
import ModConnect from '../content/modules/modConnect';

import Mod404 from '../content/modules/mod404';

import { isAuthNavItems, navItems } from '../../config/navigation/configNavigationItems';
import { navIcons } from '../../config/navigation/configNavigationIcons';

class App extends Component {

  componentWillMount = () => {
    // Fetch the applicable translates object. Without knowing what user logs in, we need labels for the login screen.

    const languageInit = this.getLanguage();
    this.props.storeLanguage(languageInit);
    localStorage.setItem('language', languageInit);

    callServer('put', 'call/api.public.getTranslationTable?language=' + languageInit,
      (response) => this.successGetHandlerTranslates(response),
      (error) => this.errorGetHandlerTranslates);
  };

  componentDidMount = () => {
    // Redirect the root route to the starting module
    if (this.props.location.pathname === "/") {
      this.props.authenticated ? this.props.history.replace(routes.ROUTE_DASHBOARD) : this.props.history.replace(routes.ROUTE_LOGIN);
    }
  };

  componentDidUpdate = () => {
    // The usersettings have not been loaded yet if authentication was provided via the login screen.
    if (this.props.loadUserSettings) {
      this.getUserSettings();
      this.props.setLoadUserSettings(false);
    }

    // In case the user successfully logged in, redirect to '/dashboard'.
    if (this.props.authenticated && this.props.location.pathname === routes.ROUTE_LOGIN) {
      this.props.history.replace(routes.ROUTE_DASHBOARD);
    }
  };

  getLanguage = () => {
    // Get the language from the localStorage or from an app wide default.
    return localStorage.getItem('language') ? localStorage.getItem('language') : this.props.language;
  };

  successGetHandlerTranslates = (response) => {
    // Translates object successfully fetched.

    this.props.storeTranslates(response.data);
    this.props.translatesLoaded();

    const magic = localStorage.getItem('magic');
    if (magic) {
      // There is a magic in the local storage. A server call to fetch user settings implicitly checks if this is the correct magic.
      this.getUserSettings();
    } else {
      // No magic in local storage.
      // The default of the store variable 'authenticated' is 'false', so the login screen will appear.
      this.props.magicChecked(true); // TODO: this can probably become local state instead of store state.
                                     // Same goes for authenticateUser.
    }
  };

  errorGetHandlerTranslates = (error) => {
    // Translates object NOT successfully fetched.
    console.log(error);
  };

  getUserSettings = () => {
    // Make a serve call to fetch user settings.
    const magic = localStorage.getItem('magic');
    const submitData = { MAGIC: magic };
    // callServer('put', 'call/api.getMedewerkerInfo',
    callServer('put', 'portal/call/api.getMedewerkerInfo',
      (response) => this.successHandlerGetUserInfo(response),
      (error) => this.errorHandlerGetUserInfo(error), submitData);
  };

  successHandlerGetUserInfo = (response) => {
    // A successfull response from an api endpoint implicitly indicates that the magic is correct.

    this.props.authenticateUser(true); // This by-passes the login screen.
    this.props.magicChecked(true); // This by-passes the initial spinner.

    if (response.data.settings.language !== this.getLanguage()) {
      // User has another language configured than the current translates object, we have to fetch the translates object for this language.
      this.props.storeLanguage(response.data.settings.language);
      localStorage.setItem('language', response.data.settings.language);
      callServer('put', 'call/api.public.getTranslationTable?language=' + response.data.settings.language,
        (response) => this.successGetHandlerTranslatesReload(response),
        (error) => this.errorGetHandlerTranslatesReload);
    } else {
      // User has the same language configured as the current translates object.
      this.props.translatesLoaded();
      this.props.storeLanguage(response.data.settings.language);
      this.props.storeUserInfo(response.data);
      localStorage.setItem('language', response.data.settings.language);
    }
  };

  errorHandlerGetUserInfo = (error) => {
    // Magic was not correct, the login screen will appear.
    this.props.magicChecked(true); // This by-passes the initial spinner.
    this.props.translatesLoaded();
  };

  successGetHandlerTranslatesReload = (response) => {
    // Second fetch of the translates object was succesfull, put it in the store.
    this.props.storeTranslates(response.data);
    this.props.translatesLoaded();
  };

  errorGetHandlerTranslatesReload = (error) => {
    // Second fetch of the translates object was NOT succesfull.
    console.log(error);
  };

  render = () => {
    let layout = (
      <Layout toolbar={false}>
        <Switch>
          <Route path={routes.ROUTE_ROOT} component={Login} />
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
            <Route path={routes.ROUTE_DASHBOARD} component={Dashboard} />

            {isAuthNavItems.document ? <Route path={routes.ROUTE_DOCUMENT_LIST_ID} component={ModDocumentList} /> : null}
            {isAuthNavItems.document ? <Route path={routes.ROUTE_DOCUMENT} component={ModProject} /> : null}

            {isAuthNavItems.task ? <Route path={routes.ROUTE_TASK_LIST_ID} component={ModTaskList} /> : null}
            {isAuthNavItems.task ? <Route path={routes.ROUTE_TASK} component={ModProject} /> : null}

            {isAuthNavItems.acquisition ? <Route path={routes.ROUTE_ACQUISITION_LIST_ID} component={ModAcquisitionList} /> : null}
            {isAuthNavItems.acquisition ? <Route path={routes.ROUTE_ACQUISITION} component={ModProject} /> : null}

            {isAuthNavItems.certification ? <Route path={routes.ROUTE_CERTIFICATION_LIST_ID} component={ModCertificationList} /> : null}
            {isAuthNavItems.certification ? <Route path={routes.ROUTE_CERTIFICATION} component={ModProject} /> : null}

            {isAuthNavItems.recruitment ? <Route path={routes.ROUTE_RECRUITMENT_LIST_ID} component={ModRecruitmentList} /> : null}
            {isAuthNavItems.recruitment ? <Route path={routes.ROUTE_RECRUITMENT} component={ModProject} /> : null}

            {isAuthNavItems.support ? <Route path={routes.ROUTE_SUPPORT_LIST_ID} component={ModSupportList} /> : null}
            {isAuthNavItems.support ? <Route path={routes.ROUTE_SUPPORT} component={ModProject} /> : null}

            {isAuthNavItems.registration ? <Route path={routes.ROUTE_REGISTRATION_LIST_ID} component={ModRegistrationList} /> : null}
            {isAuthNavItems.registration ? <Route path={routes.ROUTE_REGISTRATION} component={ModProject} /> : null}

            {isAuthNavItems.supportExt ? <Route path={routes.ROUTE_SUPPORT_EXT_DETAILS_ID} component={ModSupportDetails} /> : null}
            {isAuthNavItems.supportExt ? <Route path={routes.ROUTE_SUPPORT_EXT} component={ModSupport} /> : null}

            {isAuthNavItems.person ? <Route path={routes.ROUTE_PERSON} component={ModPerson} /> : null}

            <Route path={routes.ROUTE_SEARCH} component={ModSearch} />
            <Route path={routes.ROUTE_PERSONAL_SETTINGS} component={ModPersonalSettings} />
            <Route path={routes.ROUTE_LOGOUT} component={Logout} />
            {isAuthNavItems.admin ? <Route path={routes.ROUTE_ADMIN} component={ModAdmin} /> : null}
            <Route path={routes.ROUTE_GDPR} component={ModGdpr} />
            <Route path={routes.ROUTE_HELP} component={ModHelp} />
            <Route path={routes.ROUTE_RELEASE} component={ModRelease} />
            <Route path={routes.ROUTE_CONNECT} component={ModConnect} />

            {/* Every unexpected route results into a 404, except for the '/' route (the root) */}
            <Route component={Mod404} />
          </Switch>
        </Layout>
      );
    }

    return (
      Util.setGlobalCssModule(bootstrap),
      <Aux>{layout}</Aux>
    );
  };

}

const mapStateToProps = state => {
  const { authenticated, initTranslatesLoaded, initMagicChecked, language, loadUserSettings } = state.redMain;
  return { authenticated, initTranslatesLoaded, initMagicChecked, language, loadUserSettings };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch(authenticateUser(authenticate)),
    magicChecked: (initMagicChecked) => dispatch(magicChecked(initMagicChecked)),
    setLoadUserSettings: (loadUserSettings) => dispatch(setLoadUserSettings(loadUserSettings)),
    storeLanguage: (language) => dispatch(storeLanguage(language)),
    storeUserInfo: (userInfo) => dispatch(storeUserInfo(userInfo)),
    storeTranslates: (translates) => dispatch(storeTranslates(translates)),
    translatesLoaded: () => dispatch(translatesLoaded())
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
