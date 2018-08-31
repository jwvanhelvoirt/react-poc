import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as types from '../../../store/Actions';
import _ from 'lodash';
import ReactTooltip from 'react-tooltip';
import Aux from '../../../hoc/Auxiliary';
import formConfigPerson from '../../../config/Forms/ConfigFormPerson';
import viewConfigSort from '../../../config/Views/ConfigListViewSortOptions';
import FormParser from '../FormParser/FormParser';
import Button from '../../UI/Button/Button';
import Spinner from '../../UI/Spinner/Spinner';
import Modal from '../../UI/Modal/Modal';
import MessageBox from '../../UI/MessageBox/MessageBox';
import Label from '../../UI/Label/Label';
import { callServer } from '../../../api/api';
import classes from './ViewParser.scss';

class _View extends Component {
  constructor(props) {
    super(props);

    const { viewConfig } = this.props;
    const loading = viewConfig.url ? true : false;
    const listItems = viewConfig.url ? [] : this.props.listItems;

    this.state = {
      debounceFunction: true,
      configForm: viewConfig.relatedForm,
      count: 0,
      headerSelected: false,
      listItems,
      loadedListItem: null,
      loading,
      searchbarValue: '',
      selectedListItemId: null,
      selectedListItems: [],
      showModalColumnConfigurator: false,
      showModalFilter: false,
      showModalMessage: false,
      showModalSort: false,
      skip: 0,
      sort: this.props.viewConfig.sort,
      sortedColumn: '',
      sortOrder: 1,
      viewConfig: { ...viewConfig },
    };

    this.localData = {
      addRecordToView: false,
      modalClass: '',
      messageTitle: [],
      messageType: '',
      messageContent: '',
      messageButtons: '',
      callBackOk: null,
      callBackCancel: null
    }

    // For multiple view skips, back- and forward.
    this.navStep = 5;

    if (viewConfig.url) {
      // In case the view source is a bunch of data to be loaded from a database, we initially load these listItems.
      this.reloadListView(this.state.skip);
    }
  };

  /**
   * @brief   Updates listItems after a new listItem or an update of a selected listItem.
   */
  onSubmitHandler = (response) => {
    if (this.localData.addRecordToView || this.state.selectedListItemId) {
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
          editedResponse,
          ...this.state.listItems
        ];
      }

      // Update the state and close the form dialog.
      this.setState({ listItems: updatedListItems });
    }
    this.onCloseHandler(false);
  };

  /**
   * @brief   Called if user ignores the warning that changes will be lost if he closes the form.
   */
  onCloseHandlerDiscardChanges = () => {
    this.onModalMessageCloseHandler();
    setTimeout(() => {this.onCloseHandler(false)}, 100);
  };

  /**
   * @brief   Closes the modal that shows the formdata of the selected or new listItem.
   */
  onCloseHandler = (userConfirmation) => {
    if (userConfirmation && this.props.formTouched) {
      const content = <Label labelKey='keyWarningCloseForm' />

      // Ask for user confirmation to lose all changes in the form.
      this.showModal('showModalMessage', 'ModalSmall', ['keyClose'], 'warning', content, 'butOkCancel',
         () => this.onCloseHandlerDiscardChanges(false), () => this.onModalMessageCloseHandler());
    } else {
      this.props.untouchForm();
      this.setState({ loadedListItem: null, configForm: { ...this.props.viewConfig.relatedForm } });
    }
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
    const content = <Label labelKey='keyErrorFetchItem' />
    this.showModal('showModalMessage', 'ModalSmall', ['keyError'], 'error', content, 'butOk');
  };

  /**
   * @brief   Callback that is triggered once a list of items has been successfully pulled from the server.
   */
  successGetHandler = (response, skip) => {
    const { limit } = this.state.viewConfig;
    const { count, listItems } = response.data;

    // List items successfully loaded, update the state.
    this.setState({
      listItems,
      count,
      skip,
      loading: false,
      selectedListItems: [],
      headerSelected: false,
      debounceFunction: true
    });
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
  addItem = (formConfig, addToView) => {
    // Prepares the form data to add a new item by filling 'loadedListItem'.
    const newPostData = {};
    for (let inputId in formConfig.inputs) {
      newPostData[inputId] = formConfig.inputs[inputId].value;
    }
    this.localData.addRecordToView = addToView;
    this.setState({ loadedListItem: newPostData, selectedListItemId: null, configForm: {...formConfig} });
  };

  /**
   * @brief   Delete a (multiple) set of list items.
   */
  deleteItems = (userConfirmation) => {
    if (userConfirmation) {
      const content = <Label labelKey='keyWarningDeleteDocs' />
      // Ask for user confirmation before deleting records from the database.
      this.showModal('showModalMessage', 'ModalSmall', ['keyDelete'], 'warning', content, 'butOkCancel',
         () => this.deleteItems(false), () => this.onModalMessageCloseHandler());

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
    const content = <Label labelKey='keyErrorRemoveListItems' />;
    this.showModal('showModalMessage', 'ModalSmall', ['keyError'], 'error', content, 'butOk');
  }

  /**
   * @brief   Toont een modal voor specifiek foutafhandeling, info naar gebruiker..
   */
  showModal = (modalState, modalClass, title, type, content, buttons,
    callBackOk = () => this.onModalMessageCloseHandler(),
    callBackCancel = () => this.onModalMessageCloseHandler()) => {
    this.localData.modalClass = modalClass;
    this.localData.messageTitle = title;
    this.localData.messageType = type;
    this.localData.messageContent = content;
    this.localData.messageButtons = buttons;
    this.localData.callBackCancel = callBackCancel;
    this.localData.callBackOk = callBackOk;
    this.setState({ [modalState]: true });
  }

  /**
   * @brief   Manages state containing an array of all selected rows in the listView.
   */
  toggleRowHandler(id) {
    let updatedSelectedListItems = [
      ...this.state.selectedListItems
    ];

    if (this.state.viewConfig.multiSelect) {
      // Multiple rows can be selected in this listView.
      // Check if the id is currently selected.
      const isSelected = updatedSelectedListItems.filter((item) => item === id);
      if (isSelected.length === 1) {
        // id selected, remove it from the array.
        updatedSelectedListItems = updatedSelectedListItems.filter((item) => item !== id );
      } else {
        // id not selected yet, add it to the array.
        updatedSelectedListItems.push(id);
      }
    } else {
      // Only a single row can be selected in this listView.
      const isSelected = updatedSelectedListItems.filter((item) => item === id);
      if (isSelected.length === 1) {
        // id selected, we don't do anything.
      } else {
        // id not selected, it becomes the selected item..
        updatedSelectedListItems = [id];
      }

      // We also have to update the store.
      switch (this.state.viewConfig.viewType) {
        case 'sort':
          this.props.storeSortItem(id);
          break;
      }

    }

    this.setState({ selectedListItems: updatedSelectedListItems });
  };

  /**
   * @brief   Refreshes the current listView by pulling it from the server starting by the first record.
   */
  reloadListView(skip, search, emptySearchbar) {
    const { sort, sortOrder, viewConfig } = this.state;
    const { limit } = viewConfig;
    const params = { sort, sortOrder, skip, limit, search };
    callServer('post', '/' + this.state.viewConfig.url + '/read_multiple', (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);

    // In case this reload is triggere from the view refresh action, text in the searchbar must be removed.
    emptySearchbar ? this.setState({ searchbarValue: '' }) : null;
  };

  /**
   * @brief   Navigates a set of records (defined by limit property of the viewConfig) back- or forward.
   *          It can also skip multiple sets back- or forward.
   */
  nav(forward, multiple) {
    const { skip, viewConfig, searchbarValue } = this.state;
    const skipNext = forward ?
      (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) :
      (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);

    // Navigation buttons are always clickable, but should not trigger a server call if not necessary.
    skipNext >= 0 && this.state.count > skipNext ? this.reloadListView(skipNext, searchbarValue) : null;
  };

  /**
   * @brief   Updates the state for the search value.
   */
  inputSearchbarHandler(event) {
    this.setState({ searchbarValue: event.target.value, debounceFunction: false });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  clearSearchbarHandler() {
    this.setState({ searchbarValue: '' });
    this.reloadListView(0, '');
  };

  /**
   * @brief   Submits the search to the server.
   */
  submitSearchHandler(_this) {
     _this.reloadListView(0, _this.state.searchbarValue);
  };

  /**
   * @brief   Shows a modal where the user can select on which attribute to sort the listView in which order.
   */
  onClickSortHandler() {
    this.showModal('showModalSort', 'ModalWide', ['keySort'], 'info',
      <View viewConfig={viewConfigSort} listItems={this.state.viewConfig.sortOptions} />, 'butOkCancel',
       () => this.processSelectedSortOption(), () => this.onModalSortCloseHandler());
  };

  /**
   * @brief   Closes the sort modal.
   */
  onModalSortCloseHandler() {
    this.setState({ showModalSort: false });
  };

  processSelectedSortOption = () => {
    // Get the selected sort item via the store.
    const selectedSortOption = this.state.viewConfig.sortOptions.filter((item) => item._id === this.props.sortItem);

    const { searchbarValue } = this.state;
    const { sort, sortOrder } = selectedSortOption[0];

    // setState is async function, the method 'reloadListView' relies on the updated state, so we use a callback to continue.
    this.setState({sort: selectedSortOption[0].sortOn, sortOrder: selectedSortOption[0].order}, () => { this.reloadListView(0, searchbarValue); });

    // Close the sort modal.
    this.onModalSortCloseHandler();
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
  toggleAllRows() {
    let updatedSelectedListItems = [
      ...this.state.selectedListItems
    ];

    if (this.state.headerSelected) {
      updatedSelectedListItems = [];
    } else {
      updatedSelectedListItems = this.state.listItems.map((item) => item._id);
    }

    this.setState((prevState) => {
      return {
        headerSelected: !prevState.headerSelected,
        selectedListItems: updatedSelectedListItems
      };
    })
  };

  /**
   * @brief   Resorts the listView if user clicks on a column header.
   */
  sortOnColumn(id) {
    const { sortedColumn, sortOrder, searchbarValue } = this.state;

    if (sortedColumn === id) {
      // Previous column sort click was on the same header.
      switch (sortOrder) {
        case 1: // ascending
          this.setState({sortOrder: -1}, () => { this.reloadListView(0, searchbarValue); });
          break;
        case -1: // descending
          this.setState({sort: this.state.viewConfig.sort, sortedColumn: '', sortOrder: 1}, () => { this.reloadListView(0, searchbarValue); });
          break;
      }
    } else {
      // setState is async function, the method 'reloadListView' relies on the updated state, so we use a callback to continue.
      this.setState({sort: id, sortedColumn: id, sortOrder: 1}, () => { this.reloadListView(0, searchbarValue); });
    }
  };

  createFakeData = () => {
      const params = {};
      callServer('post', '/' + this.state.viewConfig.url + '/create_fake_data',
        (response) => this.successFaker(response),
        this.errorFaker, params);
  };
  successFaker = () => this.showModal('showModalMessage', 'ModalSmall', ['keyInfo'], 'info', 'Fake data succesvol aangemaakt.', 'butOk');
  errorFaker = () => this.showModal('showModalMessage', 'ModalSmall', ['keyError'], 'error', 'Er is iets misgegaan met het aanmaken van fake data.', 'butOk');

  deleteAll = () => {
    callServer('delete', '/' + this.state.viewConfig.url + '/delete_all',
      (response) => this.successDeleteAll(response),
      this.errorDeleteAll);
  };
  successDeleteAll = () => this.showModal('showModalMessage', 'ModalSmall', ['keyInfo'], 'info', 'Bulk records succesvol verwijderd.', 'butOk');
  errorDeleteAll = () => this.showModal('showModalMessage', 'ModalSmall', ['keyError'], 'error', 'Er is iets misgegaan met het bulk verwijderen van records.', 'butOk');

  /**
   * @brief   Renders the listView including all modals for form, filtering, sorting and column configuration.
   */
  render() {
    const { modalClass, messageButtons, messageTitle, messageType, messageContent, callBackOk, callBackCancel} = this.localData;

    // Display the form modal in case loadedListItem is filled with form data.
    let formModal = null;
    if (this.state.loadedListItem) {
      formModal = (
        <FormParser
          configForm={this.state.configForm}
          data={this.state.loadedListItem}
          onCancel={() => this.onCloseHandler(true)}
          onSubmit={this.onSubmitHandler}
          id={this.state.selectedListItemId}
          modal={true}
          />
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

    let sortModal = null;
    if (this.state.showModalSort) {
      sortModal = (
        <MessageBox modalClass={modalClass} messageTitle={messageTitle} type={messageType}
          messageContent={messageContent} buttons={messageButtons}
          callBackOk={callBackOk} callBackCancel={callBackCancel} modal={true}
        />
      );
    }

    // Display the message modal.
    let messageModal = null;
    if (this.state.showModalMessage) {
      messageModal = (
        <MessageBox modalClass={modalClass} messageTitle={messageTitle} type={messageType}
          messageContent={messageContent} buttons={messageButtons}
          callBackOk={callBackOk} callBackCancel={callBackCancel} modal={true}
        />
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

    // Start building the listView. It contains many elements that can be shown or not, depending on configuration in the viewConfig.
    const { viewConfig, count, skip } = this.state;
    const { limit, row, multiSelect, filterOptions, sortOptions, showFilter, showSort } = viewConfig;
    const step = this.navStep;

    // Title bar: Navigation element.
    let navInfo = null;
    let navBack = null;
    let navBackMult = null;
    let navForw = null;
    let navForwMult = null;

    if (viewConfig.showNavigation) {
        navBack =     <div key="2" className={classes.PreviousNext} onClick={() => this.nav(false, false)}>&lt;</div>;
        navBackMult = <div key="3" className={classes.PreviousNext} onClick={() => this.nav(false, true)}>&lt;{step}</div>;
        navForwMult = <div key="4" className={classes.PreviousNext} onClick={() => this.nav(true, true)}>&gt;{step}</div>;
        navForw =     <div key="5" className={classes.PreviousNext} onClick={() => this.nav(true, false)}>&gt;</div>;
        if (count > skip) {
            navInfo = <div key="1" className={classes.Counter}>{skip + 1}-{skip + limit > count ? count : skip + limit} van {count}</div>;
        } else if (count === 0) {
          navInfo = <div key="1" className={classes.Counter}>0</div>;
        } else {
          navInfo = <div key="1" className={classes.Counter}>1-{count} van {count}</div>;
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
        <div onClick={() => this.createFakeData()} className={classes.Title}>
          <Label labelKey={this.state.viewConfig.title} propercase={true} />
        </div>
        <div className={classes.Navigation}>
          {/*deleteAll*/}
          {columnConfig}
          {nav}
        </div>
      </div> : null;

    // Actions bar: Filtering.
    const showFilterAction = filterOptions && filterOptions.length > 0 && showFilter ? true : false;
    const filter = showFilterAction ? <div onClick={() => this.onClickFilterHandler()}><FontAwesomeIcon icon='filter' /></div> : null;

    // Actions bar: Sorting.
    const showSortAction = sortOptions && sortOptions.length > 0 && showSort ? true : false;
    const sort = showSortAction ? <div onClick={() => this.onClickSortHandler()}><FontAwesomeIcon icon='sort' /></div> : null;

    // Filtering and sorting overall.
    const filterSort = showFilterAction || showSortAction ? <div className={classes.FilterSort}>{filter}{sort}</div> : null;

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
    const classesCombinedSearchbar = [classes.Search, classes.Medium].join(' ');

    // The state variable 'debounceFunction' decides wether the debounce function (submitSearchHandler) can be called or not.
    // This is necessary, because after every key stroke in the search field, the state is updated and the render method runs again.
    const debounced = this.state.debounceFunction ? _.debounce(this.submitSearchHandler, 500) : null;

    let searchBar = null;
    if (viewConfig.showSearchbar) {
      searchBar = (
        <div className={classesCombinedSearchbar}>
          <div onClick={() => this.clearSearchbarHandler()}><FontAwesomeIcon icon='times-circle' /></div>
          <input
            value={this.state.searchbarValue}
            onChange={(event) => {
              this.inputSearchbarHandler(event);
              debounced ? debounced(this) : null;
            }}
            autoFocus
            className={classes.SearchInput} type="text" placeholder="Zoeken..." />
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

    // Header bar: fixed columns selectable.
    const classesCombinedHeaderSelected = this.state.headerSelected ?
      [classes.Fixed1, classes.HeaderSelectZone, classes.HeaderSelected].join(' ') :
      [classes.Fixed1, classes.HeaderSelectZone].join(' ');

    let columnsFixedSelect = null;
    if (row && row.selectable) {
      multiSelect ?
        // Only if the row is selectable and multiselect is enabled, we print the 'checkbox' to select/deselect all listItems.
        columnsFixedSelect = <div className={classesCombinedHeaderSelected} onClick={(event) => this.toggleAllRows(event)}></div> :
        columnsFixedSelect = <div className={classes.Fixed1}></div>
    }

    // Header bar: fixed columns menu.
    let columnsFixedMenu = <div className={classes.Fixed0}></div>;
    if (row && row.menu) {
      // Only if the row contains a click menu, we print a div in the header to align equally with the listItems.
      columnsFixedMenu = <div className={classes.Fixed2}></div>;
    }

    // Header bar: fixed columns overall.
    const columnsFixed =
      <div className={classes.Fixed}>
        {columnsFixedSelect}
        {columnsFixedMenu}
      </div>

    // Header bar: columns.
    const classesCombinedHeaders = [classes.Headers, classes.Flex].join(' ');
    let columnHeaders = null;
    const columnsVisible = viewConfig.columns.filter((column) => column.show);
    if (columnsVisible.length > 0) {
      columnHeaders = (
        <div className={classesCombinedHeaders}>
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
            const classesCombinedHeader = column.sort ? [classes[column.size], classes.HeaderSortable].join(' ') : classes[column.size];
            return(
              <div key={index} onClick={onColumn} className={classesCombinedHeader}>
                {labelColumn}
                {sortColumn}
              </div>
            );
          })
        }
        </div>
      );
    }

    // Header bar overall.
    const headerBar = viewConfig.showRowHeader ?
      <div className={classes.HeaderRow}>
        {columnsFixed}
        {columnHeaders}
      </div> : null;

    // ListviewHeader overall
    const listviewHeader = viewConfig.showListViewHeader ?
      <div className={classes.ListviewHeader}>
        {titleBar}
        {actionBar}
        {headerBar}
      </div> : null;

    // Listitems.
    let listItems = <div className={classes.Row}>Geen documenten gevonden.</div>;
    if (this.state.listItems.length > 0) {
      listItems = this.state.listItems.map((listItem, index) => {
        // In case the listItem has been edited during this client session, it gets additional styling.
        const classesCombinedListItem = listItem.edit ? [classes.Row, classes.RowEdit].join(' ') : classes.Row;

        // Is it a radio or a checkbox?
        let classesCombinedSelected = null;
        if (this.state.selectedListItems.indexOf(listItem._id) ===  -1) {
          if (multiSelect) {
            classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone].join(' ');
          } else {
            classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.Radio].join(' ');
          }
        } else {
          if (multiSelect) {
            classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.RowSelected].join(' ');
          } else {
            classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.RowSelected, classes.Radio].join(' ');
          }
        }

        let listItemsFixedSelect = null;
        if (row && row.selectable) {
          // Only if the row is selectable, we print the 'checkbox' to select/deselect a listItems.
          listItemsFixedSelect = <div className={classesCombinedSelected}></div>;
        }

        // Header bar: fixed columns menu.
        let listItemsFixedMenu = <div className={classes.Fixed0}></div>;
        if (row && row.menu) {
          // Only if the row contains a click menu, we print a div in the row to align equally with the listItems.
          listItemsFixedMenu = <div className={classes.Fixed2}></div>;
        }

        // Header bar: fixed columns overall.
        const listItemsFixed =
          <div className={classes.Fixed}>
            {listItemsFixedSelect}
            {listItemsFixedMenu}
          </div>

        // Only onDoubleClick event in case of mulitple selection of rows.
        const doubleClick = multiSelect ? () => this.onClickItemHandler(listItem._id) : null;

        return(
          <div key={index} className={classesCombinedListItem}
            onClick={(event) => this.toggleRowHandler(listItem._id)}
            onDoubleClick={doubleClick}>
            {listItemsFixed}
            <div className={classes.Flex}>
            {
              columnsVisible.map((column, index) => <div key={index} className={classes[column.size]}>{listItem[column.id]}</div>
              )
            }
            </div>
          </div>
        );
      });
    }

    // In case the listItems are still fetched, we display a spinner.
    if (this.state.loading) {
      listItems = <Spinner />;
    }

    return(
      <Aux>

        <div className={classes.ListviewContainer}>
          {listviewHeader}
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

const mapStateToProps = state => {
  return {
    formTouched: state.redMain.formTouched,
    sortItem: state.redMain.sortItem
  };
}

const mapDispatchToProps = dispatch => {
  return {
    untouchForm: () => dispatch( {type: types.FORM_UNTOUCH } ),
    storeSortItem: (sortItem) => dispatch( {type: types.SORT_ITEM_STORE, sortItem } )
  }
}

// BUG IN REDUX: In case of nested components (<View> embeds another <View>) mapStateToProps and mapDispatchToProps are NOT invoked.
// export default connect(mapStateToProps, mapDispatchToProps)(View);
// So if we assign connect() to a seperate variable and then we export this variable, it works!
const View = connect(mapStateToProps, mapDispatchToProps)(_View);
export default View;
