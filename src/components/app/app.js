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
import ModInvoicing from '../content/modules/modInvoicing';
import ModPlanning from '../content/modules/modPlanning';
import ModBookings from '../content/modules/modBookings';
import ModCrm from '../content/modules/modCrm';
import ModGdpr from '../content/modules/modGdpr';
import ModAcquisition from '../content/modules/modAcquisition';
import ModRecruitment from '../content/modules/modRecruitment';
import ModInspection from '../content/modules/modInspection';

// This is TEMPORARY, puur om geneste schermen uit te coderen in de viewparser.
import ModProject from '../content/modules/modProject';
import ModProjectDocument from '../content/modules/modProjectDocument';

// Import components for all navigation icon routes.
import ModSearch from '../content/modules/modSearch';
import ModHelp from '../content/modules/modHelp';
import ModRelease from '../content/modules/modRelease';
import ModReports from '../content/modules/modReports';
import ModPersonalSettings from '../content/modules/modPersonalSettings';
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
    this.loadPersonalSettings(); // TODO : We have to get the translates somehow, configure a defaultin general settings ('en' or 'nl').
    // localStorage.setItem("magic", "123456");
    // localStorage.removeItem("magic");
    const magic = localStorage.getItem("magic");

    if (magic) {
      // There is a magic in the local storage. Make a server call to check if this is the correct magic.
      const submitData = { magic };
      callServer('post', '/login/checkmagic', (response) => this.successHandlerCheckMagic(response), this.errorHandlerCheckMagic, submitData);
    } else {
      // No magic in local storage.
      // The default of the store variable 'authenticated' is 'false', so the login screen will appear.
      this.props.magicChecked();
    }
  };

  successHandlerCheckMagic = (response) => {
    if (response.data.magic) {
      // Magic in local storage is correct. Change the store property 'authenticated' to 'true'. Modules will be rendered automatically then.
      this.props.authenticateUser(true);
    }
    this.props.magicChecked();
  };

  errorHandlerCheckMagic = (error) => {
    console.log(error);
  };

  /*
  en vervolgens moeten we de rows verpakken in een <Link to {'/project/document/' + id}>
  daarna kunnen we het id op de url extracten met this.props.match.params.id
  wellicht moeten we de routes omdraaien binnen <Switch>.
  */

  render = () => {
    let layout = (
      <Layout navItems={navItems} navIcons={navIcons} toolbar={false}>
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

            {isAuthNavItems.invoicing ? <Route path="/invoicing" component={ModInvoicing} /> : null}
            {isAuthNavItems.planning ? <Route path="/planning" component={ModPlanning} /> : null}
            {isAuthNavItems.bookings ? <Route path="/bookings" component={ModBookings} /> : null}
            {isAuthNavItems.crm ? <Route path="/crm" component={ModCrm} /> : null}
            {isAuthNavItems.gdpr ? <Route path="/gdpr" component={ModGdpr} /> : null}
            {isAuthNavItems.acquisition ? <Route path="/acquisition" component={ModAcquisition} /> : null}
            {isAuthNavItems.recruitment ? <Route path="/recruitment" component={ModRecruitment} /> : null}
            {isAuthNavItems.inspection ? <Route path="/inspection" component={ModInspection} /> : null}

            {isAuthNavItems.project ? <Route path="/project/document/:id" component={ModProjectDocument} /> : null}
            {isAuthNavItems.project ? <Route path="/project" component={ModProject} /> : null}

            <Route path="/search" component={ModSearch} />
            <Route path="/help" component={ModHelp} />
            <Route path="/release" component={ModRelease} />
            {isAuthNavIcons.reports ? <Route path="/reports" component={ModReports} /> : null}
            <Route path="/personal" component={ModPersonalSettings} />
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
    magicChecked: () => dispatch( {type: types.INIT_MAGIC_CHECKED } ),
    translatesLoaded: () => dispatch( {type: types.INIT_TRANSLATES_LOADED } ),
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } ),
    storeTranslates: (translates) => dispatch( {type: types.TRANS_TRANSLATES_STORE, translates } )
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
