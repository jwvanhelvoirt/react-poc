import React, { Component } from 'react';
import { connect } from 'react-redux';
import { callServer } from '../../../api/api';
import { storeCandidateStatusses, storeCommunicationTypes, storeEmployees, storeGroups, storeFunctionCodes,
  storeList9a, storeList9b, storeList9c, storeList9d, storeList9e, storeList9f, storeList9g,
  storeList9h } from '../../../store/actions';
import Screen from '../../parsers/screenParser/screenParser';
import { screenConfig } from '../../../config/screens/configScreenPerson';

// const module = () => <Screen screenConfig={screenConfig} />;

class Module extends Component {

  componentWillMount = () => {
    // Make a serve call to fetch data sources required for the person io.
    const magic = localStorage.getItem('magic');
    const submitData = { MAGIC: magic };
    callServer('put', 'call/api.relatiebeheer.niveau9.getDetailsTables',
      (response) => this.successHandler(response),
      (error) => this.errorHandler(error), submitData, this.props.language);
  };

  successHandler = (response) => {
    // We store some data sources required for the person io in the store.
    const { functiecode, groepen, kandidaatstatus, list_9a, list_9b, list_9c, list_9d, list_9e, list_9f,
      list_9g, list_9h, medewerkers, teltype} = response.data;

      // Not sure yet if this emptyObject is generic enough. Is it always a combi of name and id?
      const emptyObject = { id: '', naam: '..' };

      this.props.storeCandidateStatusses(kandidaatstatus);
      this.props.storeCommunicationTypes(teltype);
      this.props.storeEmployees(medewerkers);
      this.props.storeFunctionCodes([emptyObject, ...functiecode]);
      this.props.storeGroups(groepen);
      this.props.storeList9a(list_9a);
      this.props.storeList9b(list_9b);
      this.props.storeList9c(list_9c);
      this.props.storeList9d(list_9d);
      this.props.storeList9e(list_9e);
      this.props.storeList9f(list_9f);
      this.props.storeList9g(list_9g);
      this.props.storeList9h(list_9h);
  };

  errorHandler = (error) => {
    console.log(error);
  };

  render = () => {
    return (
      <Screen screenConfig={screenConfig} />
    );
  };
}

const mapStateToProps = state => {
  const { language } = state.redMain;
  return { language };
};

const mapDispatchToProps = dispatch => {
  return {
    storeCandidateStatusses: (candidateStatusses) => dispatch(storeCandidateStatusses(candidateStatusses)),
    storeCommunicationTypes: (communicationTypes) => dispatch(storeCommunicationTypes(communicationTypes)),
    storeEmployees: (employees) => dispatch(storeEmployees(employees)),
    storeFunctionCodes: (functionCodes) => dispatch(storeFunctionCodes(functionCodes)),
    storeGroups: (groups) => dispatch(storeGroups(groups)),
    storeList9a: (list9a) => dispatch(storeList9a(list9a)),
    storeList9b: (list9b) => dispatch(storeList9b(list9b)),
    storeList9c: (list9c) => dispatch(storeList9c(list9c)),
    storeList9d: (list9d) => dispatch(storeList9d(list9d)),
    storeList9e: (list9e) => dispatch(storeList9e(list9e)),
    storeList9f: (list9f) => dispatch(storeList9f(list9f)),
    storeList9g: (list9g) => dispatch(storeList9g(list9g)),
    storeList9h: (list9h) => dispatch(storeList9h(list9h))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Module);
