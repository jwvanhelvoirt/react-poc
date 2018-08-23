import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import Aux from '../../../hoc/Auxiliary';
import formConfigPerson from '../../../config/Forms/ConfigFormPerson';
import FormParser from '../FormParser/FormParser';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Modal from '../../UI/Modal/Modal';
import MessageBox from '../../UI/MessageBox/MessageBox';
import { callServer } from '../../../api/api';
import classes from './ViewParser.scss';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      configForm: { ...this.props.formConfig },
      count: 0,
      listItems: [],
      loadedListItem: null,
      loading: true,
      searchbarValue: '',
      selectedListItemId: null,
      selectedListItems: [],
      showModalColumnConfigurator: false,
      showModalFilter: false,
      showModalMessage: false,
      showModalSort: false,
      skip: 0,
      sort: this.props.viewConfig.sort,
      viewConfig: { ...this.props.viewConfig },

      sortedColumn: '',
      sortOrder: 1
    };

    this.localData = {
      modalClass: '',
      messageTitle: '',
      messageContent: '',
      messageButtons: '',
      callBackMessageBoxOk: null,
      callBackMessageBoxCancel: null
    }

    // For multiple view skips, back- and forward.
    this.navStep = 5;

    // Initially we load the list of listItems.
    this.reloadListView(this.state.skip);
  };

  /**
   * @brief   Updates listItems after a new listItem or an update of a selected listItem.
   */
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

  /**
   * @brief   Closes the modal that shows the formdata of the selected or new listItem.
   */
  onCloseHandler = () => {
    this.setState({ loadedListItem: null, configForm: { ...this.props.formConfig } });
  };

  /**
   * @brief   Pulls data from the selected listItem from the server.
   */
  onClickItemHandler = (id) => {
    this.setState({ selectedListItemId: id });
    callServer('get', '/' + this.state.viewConfig.url + '/read/' + id, this.successGetSingleHandler, this.errorGetSingleHandler);
  };

  /**
   * @brief   Callback that is triggered once data for a selected listItem has been successfully pulled from the server.
   */
  successGetSingleHandler = (response) => {
    // Item succssfully loaded from the server, setting state 'loadedListItem', will render form dialog.
    this.setState({ loadedListItem: response.data });
  };

  /**
   * @brief   Callback that is triggered once data for a selected listItem has NOT been successfully pulled from the server.
   */
  errorGetSingleHandler = (error) => {
    // Item NOT successfully loaded, show the error in a modal.
    this.showErrorModal('Fout', 'Fout tijdens ophalen list item, item is reeds verwijderd.');
  };

  /**
   * @brief   Callback that is triggered once a list of items has been successfully pulled from the server.
   */
  successGetHandler = (response, skip) => {
    const { limit } = this.state.viewConfig;
    const { count, listItems } = response.data;

    // List items successfully loaded, update the state.
    this.setState({ listItems, count, skip, loading: false, selectedListItems: [] });
  };

  /**
   * @brief   Callback that is triggered once a list of items has NOT been successfully pulled from the server.
   */
  errorGetHandler = (error) => {
    // List items NOT successfully loaded, show the error in a modal.
    // Remove the spinner.
    this.setState({ loading: false });
  };

  /**
   * @brief   Displays a form modal to add a new record to the database.
   */
  addItem = (formConfig) => {
    // Prepares the form data to add a new item by filling 'loadedListItem'.
    const newPostData = {};
    for (let inputId in formConfig.inputs) {
      newPostData[inputId] = formConfig.inputs[inputId].value;
    }

    this.setState({ loadedListItem: newPostData, selectedListItemId: null, configForm: {...formConfig} });
  };

  /**
   * @brief   Delete a (multiple) set of list items.
   */
  deleteItems = (userConfirmation) => {
    if (userConfirmation) {
      // Ask for user confirmation before deleting records from the database.
      this.localData['modalClass'] = 'ModalWide';
      this.localData['messageTitle'] = 'Verwijderen list items';
      this.localData['messageContent'] = 'Weet u zeker dat u de geselecteerde items uit de database wilt verwijderen?';
      this.localData['messageButtons'] = 'butOkCancel';
      this.localData['callBackMessageBoxOk'] = () => this.deleteItems(false);
      this.localData['callBackMessageBoxCancel'] = () => this.onModalMessageCloseHandler();
      this.setState({ showModalMessage: true });
    } else {
      this.onModalMessageCloseHandler();
      // Delete records from the database.
      const params = { selectedListItems: this.state.selectedListItems };
      callServer('post', '/' + this.state.viewConfig.url + '/delete_multiple',
        (response) => this.successDeleteHandler(response),
        (error) => this.errorDeleteHandler(error), params
      );
    }
  };

  /**
   * @brief   Callback that is triggered once a delete action has been successfully executed on the server.
   */
  successDeleteHandler = (response) => {
    const { selectedListItems } = this.state;
    if (response.data.ok === 1 && response.data.n === selectedListItems.length) {
      // All records successfully deleted. Modify state.listItems
      let updatedListItems = [...this.state.listItems];
      updatedListItems = updatedListItems.filter((item) => {
        return selectedListItems.indexOf(item._id) ===  -1
      });

      this.setState({ listItems: updatedListItems, selectedListItems: [] });
    }
  }

  /**
   * @brief   Callback that is triggered once a delete action has NOT been successfully executed on the server.
   */
  errorDeleteHandler = (error) => {
    this.showErrorModal('Fout', 'Fout tijdens verwijderen list items');
  }

  /**
   * @brief   Toont een modal voor specifiek foutafhandeling, info naar gebruiker..
   */
  showErrorModal = (title, content) => {
    this.localData['modalClass'] = 'ModalSmall';
    this.localData['messageTitle'] = title;
    this.localData['messageContent'] = content;
    this.localData['messageButtons'] = 'butOk';
    this.localData['callBackMessageBoxCancel'] = () => this.onModalMessageCloseHandler();
    this.localData['callBackMessageBoxOk'] = () => this.onModalMessageCloseHandler();
    this.setState({ showModalMessage: true });
  }
  /**
   * @brief   Manages state containing an array of all selected rows in the listView.
   */
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

  /**
   * @brief   Refreshes the current listView by pulling it from the server starting by the first record.
   */
  reloadListView(skip, search) {
    const { sort, sortOrder, viewConfig } = this.state;
    const { limit } = viewConfig;
    const params = { sort, sortOrder, skip, limit, search };
    callServer('post', '/' + this.state.viewConfig.url + '/read_multiple', (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);
  };

  /**
   * @brief   Navigates a set of records (defined by limit property of the viewConfig) back- or forward.
   *          It can also skip multiple sets back- or forward.
   */
  nav(forward, multiple) {
    const { skip, viewConfig } = this.state;
    const skipNext = forward ?
      (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) :
      (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);

    this.reloadListView(skipNext);
  };

  /**
   * @brief   Updates the state for the search value.
   */
  inputSearchbarHandler(event) {
    this.setState({ searchbarValue: event.target.value });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  clearSearchbarHandler() {
    this.setState({ searchbarValue: '' });
  };

  /**
   * @brief   Submits the search to the server.
   */
  submitSearchHandler() {
    this.reloadListView(0, this.state.searchbarValue);
  };

  /**
   * @brief   Shows a modal where the user can select on which attribute to sort the listView in which order.
   */
  onClickSortHandler() {
    this.setState({ showModalSort: true });
  };

  /**
   * @brief   Closes the sort modal.
   */
  onModalSortCloseHandler() {
    this.setState({ showModalSort: false });
  };

  /**
   * @brief   Closes the message modal.
   */
  onModalMessageCloseHandler() {
    this.setState({ showModalMessage: false });
  };

  /**
   * @brief   Shows a modal where the user can select on which attribute to filter the listView on which value.
   */
  onClickFilterHandler() {
    this.setState({ showModalFilter: true });
  };

  /**
   * @brief   Closes the filter modal.
   */
  onModalFilterCloseHandler() {
    this.setState({ showModalFilter: false });
  };

  /**
   * @brief   Shows a modal where the user can change which columns to display in the listView.
   */
  onClickColumnConfiguratorHandler() {
    this.setState({ showModalColumnConfigurator: true });
  };

  /**
   * @brief   Closes the columns configurator modal.
   */
  onModalColumnConfiguratorCloseHandler() {
    this.setState({ showModalColumnConfigurator: false });
  };

  /**
   * @brief   Selects or deselects all listItems in the listView.
   */
  toggleAllRows(event) {
    console.log(event.target.checked);
    //TODO: alle rijen selecteren of deselecteren.
    // this.state.selectedListItems bevat een array met ids van rijen die geselecteerd zijn.
  };

  /**
   * @brief   Resorts the listView if user clicks on a column header.
   */
  sortOnColumn(id) {
    const { sortedColumn, sortOrder } = this.state;

    if (sortedColumn === id) {
      // Previous column sort click was on the same header.
      switch (sortOrder) {
        case 1: // ascending
          this.setState({sortOrder: -1}, () => { this.reloadListView(0); });
          break;
        case -1: // descending
          this.setState({sort: this.state.viewConfig.sort, sortedColumn: '', sortOrder: 1}, () => { this.reloadListView(0); });
          break;
      }
    } else {
      // setState is async function, the method 'reloadListView' relies on the updated state, so we use a callback to continue.
      this.setState({sort: id, sortedColumn: id, sortOrder: 1}, () => { this.reloadListView(0); });
    }
  };

  createFakeData = () => {
      const params = {};
      callServer('post', '/' + this.state.viewConfig.url + '/create_fake_data',
        (response) => this.successFaker(response),
        this.errorFaker, params);
  };
  successFaker = () => console.log('Fake data successfully created');
  errorFaker = () => console.log('Fake data NOT successfully created');

  deleteAll = () => {
    callServer('delete', '/' + this.state.viewConfig.url + '/delete_all',
      (response) => this.successDeleteAll(response),
      this.errorDeleteAll);
  };
  successDeleteAll = () => console.log('All records successfully deleted');
  errorDeleteAll = () => console.log('Could NOT delete all records');

  /**
   * @brief   Renders the listView including all modals for form, filtering, sorting and column configuration.
   */
  render() {
    // Display the form modal in case loadedListItem is filled with form data.
    let formModal = null;
    if (this.state.loadedListItem) {
      formModal = (
        <Modal show modalClass='ModalWide' modalClosed={this.onCloseHandler}>
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

    // Display the filter modal.
    let filterModal = null;
    if (this.state.showModalFilter) {
      filterModal = (
        <Modal show modalClass='ModalSmall' modalClosed={() => this.onModalFilterCloseHandler()}>
          <div style={{ 'padding':'20px' }}>FILTER MODAL</div>
        </Modal>
      );
    }

    // Display the sort modal.
    let sortModal = null;
    if (this.state.showModalSort) {
      sortModal = (
        <Modal show modalClass='ModalSmall' modalClosed={() => this.onModalSortCloseHandler()}>
          <div style={{ 'padding':'20px' }}>SORT MODAL</div>
        </Modal>
      );
    }

    // Display the column configurator modal.
    let columnConfiguratorModal = null;
    if (this.state.showModalColumnConfigurator) {
      columnConfiguratorModal = (
        <Modal show modalClass='ModalSmall' modalClosed={() => this.onModalColumnConfiguratorCloseHandler()}>
          <div style={{ 'padding':'20px' }}>COLUMN CONFIGURATOR MODAL</div>
        </Modal>
      );
    }

    // Display the message modal.
    let messageModal = null;
    if (this.state.showModalMessage) {
      const { modalClass, messageButtons, messageTitle, messageContent, callBackMessageBoxOk, callBackMessageBoxCancel} = this.localData;
      messageModal = (
        <MessageBox modalClass={modalClass} messageTitle={messageTitle}
          messageContent={messageContent} buttons={messageButtons}
          callBackMessageBoxOk={callBackMessageBoxOk} callBackMessageBoxCancel={callBackMessageBoxCancel}
        />
      );
    }

    // Start building the listView. It contains many elements that can be shown or not, depending on configuration in the viewConfig.
    const { viewConfig, count, skip } = this.state;
    const { limit } = viewConfig;
    const step = this.navStep;

    // Title bar: Navigation element.
    let navInfo = null;
    let navBack = null;
    let navBackMult = null;
    let navForw = null;
    let navForwMult = null;

    if (viewConfig.showNavigation && count > 0) {
        if (count > skip) {
          navInfo =     <div key="1" className={classes.Counter}>{skip + 1}-{skip + limit > count ? count : skip + limit} van {count}</div>;
          navBack =     skip - limit >= 0             ? <div key="2" className={classes.PreviousNext} onClick={() => this.nav(false, false)}>&lt;</div> : null;
          navBackMult = skip - (step * limit) >= 0    ? <div key="3" className={classes.PreviousNext} onClick={() => this.nav(false, true)}>&lt;{step}</div> : null;
          navForwMult = count > skip + (step * limit) ? <div key="4" className={classes.PreviousNext} onClick={() => this.nav(true, true)}>&gt;{step}</div> : null;
          navForw =     count > skip + limit          ? <div key="5" className={classes.PreviousNext} onClick={() => this.nav(true, false)}>&gt;</div> : null;
        } else {
          navInfo =     <div key="1" className={classes.Counter}>1-{count} van {count}</div>;
        }
    }
    const nav = [navInfo, navBack, navBackMult, navForwMult, navForw];

    // Title bar: Column configurator.
    const columnConfig = viewConfig.showColumnConfigurator ?
      <div  onClick={() => this.onClickColumnConfiguratorHandler()}
            className={classes.ColumnConfigurator}>
            <FontAwesomeIcon icon='ellipsis-v' />
      </div> : null;

    // Title bar: TEMPORARY TO DELETE ALL RECORDS FROM A COLLECTION, FOR TEST PURPOSES.
    const deleteAll =
      <div onClick={() => this.deleteAll()}
           className={classes.ColumnConfigurator}>
           <FontAwesomeIcon icon='trash' />
      </div>;

    // Title bar overall.
    const titleBar = viewConfig.showRowTitle ?
      <div className={classes.TitleRow}>
        <div onClick={() => this.createFakeData()} className={classes.Title}>{this.state.viewConfig.title}</div>
        <div className={classes.Navigation}>
          {deleteAll}
          {columnConfig}
          {nav}
        </div>
      </div> : null;

    // Actions bar: Filtering and sorting.
    let filterSort = null;
    if (viewConfig.showFilterSort) {
      filterSort = (
        <div className={classes.FilterSort}>
          <div onClick={() => this.onClickFilterHandler()}><FontAwesomeIcon icon='filter' /></div>
          <div onClick={() => this.onClickSortHandler()}><FontAwesomeIcon icon='sort' /></div>
        </div>
      );
    }

    // Action bar: Actions.
    let actions = null;
    if (viewConfig.showActions) {
      const actionsPrimary = viewConfig.actions.filter((action) => action.showInBarPrimary);
      if (actionsPrimary.length > 0) {
        actions = (
          <div className={classes.ActionRowActions}>
            {
              actionsPrimary.map((action, index) => {
                return <div key={index} onClick={() => action.callback(this)} data-tip="React-tooltip" data-for={action.id}>
                  <FontAwesomeIcon icon={action.labelIcon} />
                  <ReactTooltip id={action.id} place="bottom" type="dark" effect="solid">
                    <span>{action.tooltip}</span>
                  </ReactTooltip>
                </div>
              })
            }
          </div>
        );
      }
    }

    // Action bar: Searchbar.
    const classesDynamicSearchbar = [classes.Search, classes.Medium].join(' ');
    let searchBar = null;
    if (viewConfig.showSearchbar) {
      searchBar = (
        <div className={classesDynamicSearchbar}>
          <div onClick={() => this.clearSearchbarHandler()}><FontAwesomeIcon icon='times-circle' /></div>
          <input
            value={this.state.searchbarValue}
            onChange={(event) => this.inputSearchbarHandler(event)}
            className={classes.SearchInput} type="text" placeholder="Zoeken..." />
          <div onClick={() => this.submitSearchHandler()}><FontAwesomeIcon icon='search' /></div>
        </div>
      );
    }

    // Action bar overall.
    const actionBar = viewConfig.showRowActions ?
      <div className={classes.ActionRow}>
        {filterSort}
        {actions}
        {searchBar}
      </div> : null;

    // Header bar: columns.
    const classesDynamicHeaders = [classes.Headers, classes.Flex].join(' ');
    let columnHeaders = null;
    const columnsVisible = viewConfig.columns.filter((column) => column.show);
    if (columnsVisible.length > 0) {
      columnHeaders = (
        <div className={classesDynamicHeaders}>
        {
          columnsVisible.map((column, index) => {
            let sortIcon = <FontAwesomeIcon icon='sort' />;
            if (column.id === this.state.sortedColumn) {
              // In case user clicked on the sortcolumn, we display a different sort icon depending on the current sort order.
              sortIcon = this.state.sortOrder === 1 ? <FontAwesomeIcon icon='sort-up' /> : <FontAwesomeIcon icon='sort-down' />;
            }
            const sortColumn = column.sort ? <div className={classes.Sort}>{sortIcon}</div> : null;
            const labelColumn = <div>{column.label}</div>;
            const onColumn = column.sort ? () => this.sortOnColumn(column.id) : null;
            const classesDynamicHeader = column.sort ? [classes[column.size], classes.HeaderSortable].join(' ') : classes[column.size];
            return(
              <div key={index} onClick={onColumn} className={classesDynamicHeader}>
                {labelColumn}
                {sortColumn}
              </div>
            );
          })
        }
        </div>
      );
    }

    // Header bar: fixed columns.
    let columnsFixed = (
      <div className={classes.Fixed}>
        <div className={classes.Fixed1}>
          <input type="checkbox" onClick={(event) => this.toggleAllRows(event)} />
        </div>
        <div className={classes.Fixed1}></div>
      </div>
    );

    // Header bar overall.
    const headerBar = viewConfig.showRowHeader ?
      <div className={classes.HeaderRow}>
        {columnsFixed}
        {columnHeaders}
      </div> : null;

    // Listitems.
    let listItems = this.state.listItems.map((listItem, index) => {
      // In case the listItem has been edited during this client session, it gets additional styling.
      const classesDynamicListItem = listItem.edit ? [classes.Row, classes.RowEdit].join(' ') : classes.Row;
      const checkbox = this.state.selectedListItems.indexOf(listItem._id) ===  -1 ?
        <input type="checkbox" onClick={(event) => this.toggleRowHandler(event, listItem._id)}/> :
        <input type="checkbox" checked onClick={(event) => this.toggleRowHandler(event, listItem._id)}/>;
      return(
        <div key={index} className={classesDynamicListItem} onDoubleClick={() => this.onClickItemHandler(listItem._id)}>
          <div className={classes.Fixed}>
            <div className={classes.Fixed1}>{checkbox}</div>
            <div className={classes.Fixed1}></div>
          </div>
          <div className={classes.Flex}>
          {
            columnsVisible.map((column, index) => <div key={index} className={classes[column.size]}>{listItem[column.id]}</div>
            )
          }
          </div>
        </div>
      );
    });

    // In case the listItems are still fetched, we display a spinner.
    if (this.state.loading) {
      listItems = <Spinner />;
    }

    return(
      <Aux>

        <div className={classes.ListviewContainer}>
          <div className={classes.ListviewHeader}>
            {titleBar}
            {actionBar}
            {headerBar}
          </div>
          <div className={classes.ListviewContent}>
            {listItems}
          </div>
        </div>

        {formModal}
        {filterModal}
        {sortModal}
        {columnConfiguratorModal}
        {messageModal}

      </Aux>
    );
  };

}

  export default View;
