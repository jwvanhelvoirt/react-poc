import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import formConfigPerson from '../../../config/Forms/ConfigFormPerson';
import FormParser from '../FormParser/FormParser';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Modal from '../../UI/Modal/Modal';
import { callServer } from '../../../api/api';
import classes from './ViewParser.scss';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadedListItem: null,
      loading: true,
      listItems: [],
      selectedListItems: [],
      selectedListItemId: null,
      configForm: {
        ...this.props.formConfig
      },
      sort: this.props.viewConfig.sort,
      skip: 0,
      count: 0,
      viewConfig: { ...this.props.viewConfig }
    };

    this.navStep = 5; // For multiple view skips, back- and forward.

    // Initially we load the list of listItems.
    this.reloadListView(this.state.skip);
  };

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
  };

  onCloseHandler = () => {
    this.setState({ loadedListItem: null, configForm: { ...this.props.formConfig } });
  };



  onClickItemHandler = (id) => {
    this.setState({ selectedListItemId: id });
    callServer('get', '/' + this.state.viewConfig.url + '/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler);
  };

  successGetSingleHandler = (response) => {
    // Item succssfully loaded from the server, setting state 'loadedListItem', will render form dialog.
    this.setState({ loadedListItem: response.data });
  };

  errorGetSingleHandler = (error) => {
    // Item NOT successfully loaded, show the error in a modal.
  };



  successGetHandler = (response, skip) => {
    const { limit } = this.state.viewConfig;
    const { count, listItems } = response.data;

    // List items successfully loaded, update the state.
    this.setState({ listItems, count, skip, loading: false });
  };

  errorGetHandler = (error) => {
    // List items NOT successfully loaded, show the error in a modal.
    // Remove the spinner.
    this.setState({ loading: false });
  };


  addItem = (formConfig) => {
    // Prepares the form data to add a new item by filling 'loadedListItem'.
    const newPostData = {};
    for (let inputId in formConfig.inputs) {
      newPostData[inputId] = formConfig.inputs[inputId].value;
    }

    this.setState({ loadedListItem: newPostData, selectedListItemId: null, configForm: {...formConfig} });
  };

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
  };

  reloadListView(skip) {
    const { sort, viewConfig } = this.state;
    const { limit } = viewConfig;
    const params = { sort, skip, limit };
    callServer('post', '/' + this.state.viewConfig.url + '/read_multiple', (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);
  };

  nav(forward, multiple) {
    const { skip, viewConfig } = this.state;
    const skipNext = forward ?
      (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) :
      (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);

    this.reloadListView(skipNext);

  };

  render_old() {
    // Create HTML for the list of items.
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
            clicked={() => this.addItem(this.props.formConfig)}
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
            clicked={() => this.reloadListView(this.state.skip)} /*ATTENTIE: Als fat arrow function opnemen, anders krijg je de this context van de button!!*/
            />

          {/*List of listItems*/}
          {listItems}

          {/*Selected listItem OR new listItem*/}
          {form}
        </div>
      );
    };

    render() {
      const { viewConfig, count, skip } = this.state;
      const { limit } = viewConfig;
      const step = this.navStep;

      // Navigation element.
      let navInfo = null;
      let navBack = null;
      let navBackMult = null;
      let navForw = null;
      let navForwMult = null;

      if (viewConfig.rowTitle && viewConfig.navigation && count > 0) {
          if (count > skip) {
            navInfo =     <div key="1" className={classes.Counter}>{skip + 1}-{skip + limit > count ? count : skip + limit} of {count}</div>;
            navBack =     skip - limit >= 0             ? <div key="2" className={classes.PreviousNext} onClick={() => this.nav(false, false)}>&lt;</div> : null;
            navBackMult = skip - (step * limit) >= 0    ? <div key="3" className={classes.PreviousNext} onClick={() => this.nav(false, true)}>&lt;{step}</div> : null;
            navForwMult = count > skip + (step * limit) ? <div key="4" className={classes.PreviousNext} onClick={() => this.nav(true, true)}>&gt;{step}</div> : null;
            navForw =     count > skip + limit          ? <div key="5" className={classes.PreviousNext} onClick={() => this.nav(true, false)}>&gt;</div> : null;
          } else {
            navInfo =     <div key="1" className={classes.Counter}>1-{count} of {count}</div>;
          }
      }
      const nav = [navInfo, navBack, navBackMult, navForwMult, navForw];

      // Column configurator.

      // Title bar.

      const classesDynamicHeaders = [classes.Headers, classes.Flex].join(' ');
      const classesDynamicSearchbar = [classes.Search, classes.Medium].join(' ');

      return(
        <div className={classes.ListviewContainer}>
          <div className={classes.ListviewHeader}>
            <div className={classes.TitleRow}>
              <div className={classes.Title}>{this.state.viewConfig.title}</div>
              <div className={classes.Navigation}>
                <div className={classes.ColumnConfigurator}><FontAwesomeIcon icon='ellipsis-v' /></div>
                {nav}
              </div>
            </div>
            <div className={classes.ActionRow}>
              <div className={classes.ActionRowActions}>
                <div><FontAwesomeIcon icon='ellipsis-v' /></div>
                <div><FontAwesomeIcon icon='users' /></div>
                <div><FontAwesomeIcon icon='save' /></div>
                <div><FontAwesomeIcon icon='plus-square' /></div>
              </div>
              <div className={classesDynamicSearchbar}>
                <div><FontAwesomeIcon icon='times-circle' /></div>
                <input className={classes.SearchInput} type="text" placeholder="Zoeken..." />
                <div><FontAwesomeIcon icon='search' /></div>
              </div>
              <div className={classes.FilterSort}>
                <div><FontAwesomeIcon icon='filter' /></div>
                <div><FontAwesomeIcon icon='sort' /></div>
              </div>
            </div>
            <div className={classes.HeaderRow}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}></div>
              </div>
              <div className={classesDynamicHeaders}>
                <div className={classes.Flex40}>
                  <div>Naam</div>
                  <div className={classes.Sort}><FontAwesomeIcon icon='sort' /></div>
                </div>
                <div className={classes.Flex40}>
                  <div>Adres</div>
                  <div className={classes.Sort}><FontAwesomeIcon icon='sort' /></div>
                </div>
                <div className={classes.Flex20}>
                  <div>Woonplaats</div>
                  <div className={classes.Sort}><FontAwesomeIcon icon='sort' /></div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.ListviewContent}>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
            <div className={classes.Row}>
              <div className={classes.Fixed}>
                <div className={classes.Fixed1}><input type="checkbox"/></div>
                <div className={classes.Fixed1}>x</div>
              </div>
              <div className={classes.Flex}>
                <div className={classes.Flex40}>Jan-Willem van Helvoirt</div>
                <div className={classes.Flex40}>Heiligenbos 55</div>
                <div className={classes.Flex20}>Berghem</div>
                <div className={classes.ShowOnHover}>x</div>
              </div>
            </div>
          </div>
        </div>
      );
    };

  }

  export default View;
