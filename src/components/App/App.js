import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../store/Actions';
import '../../assets/FontAwesome/Fontawesome';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Util } from 'reactstrap';
import Layout from '../Layout/Layout';
// import asynchComponent from './hoc/asynchComponent';
import Aux from '../../hoc/Auxiliary';
import { callServer } from '../../api/api';

import SpinnerInit from '../UI/SpinnerInit/SpinnerInit';

//const asynchModInvoicing = asynchComponent(() => { // lazy loading werkt niet in één keer, nader uitzoeken.
//	return import('./containers/ModInvoicing/ModInvoicing');
//});

// Import components for all navigation item routes.
import Login from '../Navigation/Login/Login';
import Dashboard from '../Navigation/Dashboard/Dashboard';
import ModInvoicing from '../Content/Modules/ModInvoicing';
import ModPlanning from '../Content/Modules/ModPlanning';
import ModBookings from '../Content/Modules/ModBookings';
import ModCrm from '../Content/Modules/ModCrm';
import ModGdpr from '../Content/Modules/ModGdpr';
import ModAcquisition from '../Content/Modules/ModAcquisition';
import ModRecruitment from '../Content/Modules/ModRecruitment';
import ModInspection from '../Content/Modules/ModInspection';

// Import components for all navigation icon routes.
import ModSearch from '../Content/Modules/ModSearch';
import ModHelp from '../Content/Modules/ModHelp';
import ModRelease from '../Content/Modules/ModRelease';
import ModReports from '../Content/Modules/ModReports';
import ModPersonalSettings from '../Content/Modules/ModPersonalSettings';
import ModAdmin from '../Content/Modules/ModAdmin';

import Mod404 from '../Content/Modules/Mod404';

import { isAuthNavItems, navItems } from '../../config/Navigation/ConfigNavigationItems';
import { isAuthNavIcons, navIcons } from '../../config/Navigation/ConfigNavigationIcons';

class App extends Component {

  loadPersonalSettings = () => {
    callServer('get', '/usersettings/read', (response) => this.successGetHandlerPersonalSettings(response), this.errorGetHandlerPersonalSettings);
  }

  successGetHandlerPersonalSettings = (response) => {
    this.props.storeLanguage(response.data[0].language);
    callServer('get', '/translates/read/' + response.data[0].language, (response) => this.successGetHandlerTranslates(response), this.errorGetHandlerTranslates);
  }

  errorGetHandlerPersonalSettings = (error) => {
    console.log(error);
  }

  successGetHandlerTranslates = (response) => {
    this.props.storeTranslates(response.data[0].translates);
    this.props.translatesLoaded();
  }

  errorGetHandlerTranslates = (error) => {
    console.log(error);
  }

  componentDidMount() {
    // Redirect the root route to the starting module
    if (this.props.location.pathname === "/") {
      this.props.authenticated ? this.props.history.replace('/dashboard') : this.props.history.replace('/login');
    }
  }

  componentDidUpdate() {
    // In case the user successfully logged in, redirect to '/dashboard'.
    if (this.props.authenticated && this.props.location.pathname === "/login") {
      this.props.history.replace('/dashboard');
    }
    this.loadPersonalSettings();
  }

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

  }

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

  render1 = () => {
    return(
      <SpinnerInit />
    );
  };

  render() {
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
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.redMain.authenticated,
    initTranslatesLoaded: state.redMain.initTranslatesLoaded,
    initMagicChecked: state.redMain.initMagicChecked,
    language: state.redMain.transLanguage
  };
}

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch( {type: types.USER_AUTHENTICATE, authenticate } ),
    magicChecked: () => dispatch( {type: types.INIT_MAGIC_CHECKED } ),
    translatesLoaded: () => dispatch( {type: types.INIT_TRANSLATES_LOADED } ),
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } ),
    storeTranslates: (translates) => dispatch( {type: types.TRANS_TRANSLATES_STORE, translates } )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
