import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from './store/Actions';
import './assets/FontAwesome/Fontawesome';
import bootstrap from 'bootstrap/dist/css/bootstrap.min.css';
import { Util } from 'reactstrap';
import Layout from './components/Layout/Layout';
import asynchComponent from './hoc/asynchComponent';
import { callServer } from './api/api';

//const asynchModInvoicing = asynchComponent(() => { // lazy loading werkt niet in één keer, nader uitzoeken.
//	return import('./containers/ModInvoicing/ModInvoicing');
//});

// Import components for all navigation item routes.
import Dashboard from './components/Navigation/Dashboard/Dashboard';
import ModInvoicing from './components/Content/Modules/ModInvoicing';
import ModPlanning from './components/Content/Modules/ModPlanning';
import ModBookings from './components/Content/Modules/ModBookings';
import ModCrm from './components/Content/Modules/ModCrm';
import ModGdpr from './components/Content/Modules/ModGdpr';
import ModAcquisition from './components/Content/Modules/ModAcquisition';
import ModRecruitment from './components/Content/Modules/ModRecruitment';
import ModInspection from './components/Content/Modules/ModInspection';

// Import components for all navigation icon routes.
import ModSearch from './components/Content/Modules/ModSearch';
import ModHelp from './components/Content/Modules/ModHelp';
import ModRelease from './components/Content/Modules/ModRelease';
import ModReports from './components/Content/Modules/ModReports';
import ModPersonal from './components/Content/Modules/ModPersonal';
import ModAdmin from './components/Content/Modules/ModAdmin';

import Mod404 from './components/Content/Modules/Mod404';

import { isAuthNavItems, navItems } from './config/Navigation/ConfigNavigationItems';
import { isAuthNavIcons, navIcons } from './config/Navigation/ConfigNavigationIcons';

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
  }

  errorGetHandlerTranslates = (error) => {
    console.log(error);
  }

  componentDidMount() {
    // Redirect the root route to the starting module
    if (this.props.location.pathname === "/") {
      this.props.history.replace('/dashboard');
    }
  }

  componentWillUpdate() {
    // console.log('App - componentWillUpdate');
    this.loadPersonalSettings();
  }

  componentWillMount() {
    // console.log('App - componentWillMount');
    this.loadPersonalSettings();
  }

  render() {
    return (
      Util.setGlobalCssModule(bootstrap),
      <Layout navItems={navItems} navIcons={navIcons}>
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
          <Route path="/personal" component={ModPersonal} />
          {isAuthNavIcons.admin ? <Route path="/admin" component={ModAdmin} /> : null}

          {/* Every unexpected route results into a 404, except for the '/' route (the root) */}
          <Route component={Mod404} />
        </Switch>
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.redMain.transLanguage
  };
}

const mapDispatchToProps = dispatch => {
  return {
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } ),
    storeTranslates: (translates) => dispatch( {type: types.TRANS_TRANSLATES_STORE, translates } )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
