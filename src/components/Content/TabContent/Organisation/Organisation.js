/**
* @brief   Returns all HTML for the organisations tab. In general this is an action bar and a listview.
*/

import React, { Component } from 'react';

import formConfigTask from '../../../../config/Forms/FormTask';
import formConfigPerson from '../../../../config/Forms/FormPerson';
import formConfigOrganisation from '../../../../config/Forms/FormOrganisation';
import FormParser from '../../../Parsers/FormParser/FormParser';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import Modal from '../../../UI/Modal/Modal';
import withErrorHandler from '../../../../hoc/withErrorHandler/withErrorHandler';
import axios from 'axios';

import { callServer } from '../../../../api/api';

import classes from './Organisation.scss';

class Organisation extends Component {
  state = {
    loadedItem: null,
    loading: true,
    organisations: [],
    selectedRows: [],
    selectedId: null,
    configForm: {
      ...formConfigOrganisation
    }
  }

  idNewOrganisation = null;

  //deleteOrganisationHandler = (id) => {
  //	console.log(id);
  //	axios.delete('/organisations/' + id + '.json')
  //		.then(response => {
  //			console.log(response);
  //			this.setState({ reloadOrganisations: true });
  //		})
  //		.catch(error => {
  //			console.log(error);
  //		});
  //}

  onSubmitHandler = (response) => {
    let updatedOrganisations = [];

    // Edited view entries are marked, so that we can emphasize them in the listview.
    const editedResponse = {
      ...response.data,
      edit: true
    }

    if (this.state.selectedId) {
      // Put all current records in a variable, except the updated one.
      // For the updated we include the response.
      updatedOrganisations = this.state.organisations.map(item => item._id === response.data._id ? editedResponse : item);
    } else {
      // Append the object of the new entry to the state.
      updatedOrganisations = [
        ...this.state.organisations,
        response.data
      ];
    }

    this.setState({ organisations: updatedOrganisations });
    this.onCloseHandler();
  }

  onCloseHandler = () => {
    this.setState({ loadedItem: null, configForm: { ...formConfigOrganisation } });
  }



  clickOrganisationHandler = (id) => {
    this.setState({ selectedId: id });
    callServer('get', '/organisations/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler);
  }

  successGetSingleHandler = (response) => {
    this.setState({ loadedItem: response.data });
  }

  errorGetSingleHandler = (error) => {
    //console.log(error);
  }



  successGetHandler = (response) => {
    // console.log('successGetHandler');
    this.setState({ organisations: response.data, loading: false });
  }

  errorGetHandler = (error) => {
    // To remove the spinner.
    this.setState({ loading: false });
  }



  addOrganistion = () => {
    // Prepares the form data to add a new organisation by filling 'loadedItem'.
    const newPostData = {};
    for (let inputId in formConfigOrganisation.inputs) {
      newPostData[inputId] = formConfigOrganisation.inputs[inputId].value;
    }

    this.setState({ loadedItem: newPostData, selectedId: null, configForm: {...formConfigOrganisation} });
  }

  addPerson = () => {
    // Prepares the form data to add a new organisation by filling 'loadedItem'.
    const newPostData = {};
    for (let inputId in formConfigPerson.inputs) {
      newPostData[inputId] = formConfigPerson.inputs[inputId].value;
    }

    this.setState({ loadedItem: newPostData, selectedId: null, configForm: { ...formConfigPerson } });
  }

  addTask = () => {
    // Prepares the form data to add a new task by filling 'loadedItem'.
    const newPostData = {};
    for (let inputId in formConfigTask.inputs) {
      newPostData[inputId] = formConfigTask.inputs[inputId].value;
    }

    this.setState({ loadedItem: newPostData, selectedId: null, configForm: { ...formConfigTask } });
  }

  toggleRowHandler(event, id) {
    // Update state.selecteRows with IDs of selected rows.
    let updatedRowSelection = [];

    if (event.target.checked) {
      updatedRowSelection = [
        ...this.state.selectedRows,
        id
      ];
    } else {
      const currentSelection = [
        ...this.state.selectedRows
      ];
      updatedRowSelection = currentSelection.filter(item => {
        return item !== id;
      });
    }

    this.setState({ selectedRows: updatedRowSelection });
  }

  reloadListView() {
    callServer('get', '/organisations/read_multiple', this.successGetHandler, this.errorGetHandler);
  }

  componentDidMount() {
    // Initially we load the list of organisations.
    this.reloadListView();
  }

  render() {
    // Create HTML for the list of organisations.
    let organisations = this.state.organisations.map((organisation, index) => {
      // In case the organisation has been edited during this client session, it gets additional styling.
      const classesDynamic = organisation.edit ? [classes.ListRow, classes.ListRowEdit].join(' ') : classes.ListRow;
      return (
        <div key={organisation._id} className={classesDynamic}>
          <input type="checkbox" className={classes.ListRowCheckbox} onClick={(event) => this.toggleRowHandler(event, organisation._id)}/>
          <div
            style={{width: '100%'}}
            onClick={() => this.clickOrganisationHandler(organisation._id)}>
            {organisation.name}
          </div>
        </div>
      );
    });
    organisations = <div style={{ marginBottom: '20px' }}>{organisations}</div>;
      // In case the records are still fetched, we display a spinner.
      if (this.state.loading) {
        organisations = <Spinner />;
      }

      let form = null;
      if (this.state.loadedItem) {
        form = (
          <Modal show modalClosed={this.onCloseHandler}>
            <FormParser
              configForm={this.state.configForm}
              data={this.state.loadedItem}
              onCancel={() => this.onCloseHandler()}
              onSubmit={this.onSubmitHandler}
              id={this.state.selectedId}
              />
          </Modal>
        );
      }

      return (
        <div className="TabContent">
          {/*TIJDELIJKE BUTTON, MOET STRAKS NAAR DE ACTION BAR*/}
          <Button
            color="primary"
            id="Button-New"
            labelText="Organisatie toevoegen"
            clicked={() => this.addOrganistion()}
            />
          <Button
            color="primary"
            id="Button-New"
            labelText="Persoon toevoegen"
            clicked={() => this.addPerson()}
            />
          <Button
            color="success"
            id="Button-Resort"
            labelText="Refresh"
            clicked={() => this.reloadListView()} /*ATTENTIE: Als fat arrow function opnemen, anders krijg je de this context van de button!!*/
            />

          {/*List of organisations*/}
          {organisations}

          {/*Selected organisation OR new organisation*/}
          {form}
        </div>
      );
    }
  }

  export default withErrorHandler(Organisation, axios);
