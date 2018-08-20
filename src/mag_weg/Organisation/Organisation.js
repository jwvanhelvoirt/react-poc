import React, { Component } from 'react';
import formConfigPerson from '../../../../config/Forms/FormPerson';
import formConfigOrganisation from '../../../../config/Forms/FormOrganisation';
import FormParser from '../../../Parsers/FormParser/FormParser';
import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import Modal from '../../../UI/Modal/Modal';
import { callServer } from '../../../../api/api';
import classes from './Organisation.scss';

class Organisation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedListItem: null,
      loading: true,
      listItems: [],
      selectedListItems: [],
      selectedListItemId: null,
      configForm: {
        ...formConfigOrganisation //TODO
      }
    }

    // Initially we load the list of listItems.
    this.reloadListView();
  }

  onSubmitHandler = (response) => {
    let updatedListItems = [];

    // Edited view entries are marked, so that we can emphasize them in the listview.
    const editedResponse = {
      ...response.data,
      edit: true
    }

    if (this.state.selectedListItemId) {
      // Put all current listItems in a variable, except the updated one.
      // For the updated we include the response.
      updatedListItems = this.state.listItems.map(item => item._id === response.data._id ? editedResponse : item);
    } else {
      // Append the object of the new entry to the state.
      updatedListItems = [
        ...this.state.listItems,
        editedResponse
      ];
    }

    // Update the state and close the form dialog.
    this.setState({ listItems: updatedListItems });
    this.onCloseHandler();
  }

  onCloseHandler = () => {
    this.setState({ loadedListItem: null, configForm: { ...formConfigOrganisation } }); //TODO: Config related to list items.
  }



  onClickItemHandler = (id) => {
    this.setState({ selectedListItemId: id });
    callServer('get', '/organisations/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler); //TODO
  }

  successGetSingleHandler = (response) => {
    // Item succssfully loaded from the server, setting state 'loadedListItem', will render form dialog.
    this.setState({ loadedListItem: response.data });
  }

  errorGetSingleHandler = (error) => {
    // Item NOT successfully loaded, show the error in a modal.
  }



  successGetHandler = (response) => {
    // List items successfully loaded, update the state.
    this.setState({ listItems: response.data, loading: false });
  }

  errorGetHandler = (error) => {
    // List items NOT successfully loaded, show the error in a modal.
    // Remove the spinner.
    this.setState({ loading: false });
  }


  addItem = (formConfig) => {
    // Prepares the form data to add a new item by filling 'loadedListItem'.
    const newPostData = {};
    for (let inputId in formConfig.inputs) {
      newPostData[inputId] = formConfig.inputs[inputId].value;
    }

    this.setState({ loadedListItem: newPostData, selectedListItemId: null, configForm: {...formConfig} });
  }

  toggleRowHandler(event, id) {
    // Update state.selecteRows with IDs of selected rows.
    let updatedRowSelection = [];

    if (event.target.checked) {
      updatedRowSelection = [
        ...this.state.selectedListItems,
        id
      ];
    } else {
      const currentSelection = [
        ...this.state.selectedListItems
      ];
      updatedRowSelection = currentSelection.filter(item => {
        return item !== id;
      });
    }

    this.setState({ selectedListItems: updatedRowSelection });
  }

  reloadListView() {
    callServer('get', '/organisations/read_multiple', this.successGetHandler, this.errorGetHandler); //TODO
  }

  render() {
    // Create HTML for the list of organisations.
    let listItems = this.state.listItems.map((listItem, index) => {
      // In case the listItem has been edited during this client session, it gets additional styling.
      const classesDynamic = listItem.edit ? [classes.ListRow, classes.ListRowEdit].join(' ') : classes.ListRow;
      return (
        <div key={listItem._id} className={classesDynamic}>
          <input type="checkbox" className={classes.ListRowCheckbox} onClick={(event) => this.toggleRowHandler(event, listItem._id)}/>
          <div
            style={{width: '100%'}}
            onClick={() => this.onClickItemHandler(listItem._id)}>
            {listItem.name}
          </div>
        </div>
      );
    });
    listItems = <div style={{ marginBottom: '20px' }}>{listItems}</div>;
      // In case the listItems are still fetched, we display a spinner.
      if (this.state.loading) {
        listItems = <Spinner />;
      }

      // Display the form modal in case loadedListItem is filled with form data.
      let form = null;
      if (this.state.loadedListItem) {
        form = (
          <Modal show modalClosed={this.onCloseHandler}>
            <FormParser
              configForm={this.state.configForm}
              data={this.state.loadedListItem}
              onCancel={() => this.onCloseHandler()}
              onSubmit={this.onSubmitHandler}
              id={this.state.selectedListItemId}
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
            labelText="Org+"
            clicked={() => this.addItem(formConfigOrganisation)}
            />
          <Button
            color="primary"
            id="Button-New"
            labelText="Pers+"
            clicked={() => this.addItem(formConfigPerson)}
            />
          <Button
            color="success"
            id="Button-Resort"
            labelText="Refresh"
            clicked={() => this.reloadListView()} /*ATTENTIE: Als fat arrow function opnemen, anders krijg je de this context van de button!!*/
            />

          {/*List of listItems*/}
          {listItems}

          {/*Selected listItem OR new listItem*/}
          {form}
        </div>
      );
    }
  }

  export default Organisation;
