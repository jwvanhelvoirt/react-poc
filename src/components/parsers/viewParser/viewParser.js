import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import * as types from '../../../store/constActions';
import _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import ReactTooltip from 'react-tooltip';
import Aux from '../../../hoc/auxiliary';
import viewConfigSort from '../../../config/views/configListViewSortOptions';
import FormParser from '../formParser/formParser';
import Spinner from '../../ui/spinners/spinner/spinner';
import Modal from '../../ui/modal/modal';
import MessageBox from '../../ui/messageBox/messageBox';
import Label from '../../ui/label/label';
import Avatar from '../../ui/avatar/avatar';
import Timespan from '../../ui/timespan/timespan';
import { callServer } from '../../../api/api';
import { getDisplayValue } from '../../../libs/generic';
import * as icons from '../../../libs/constIcons';
import * as trans from '../../../libs/constTranslates';
import classes from './viewParser.scss';

class _View extends Component {

  constructor(props) {
    super(props);

    const { viewConfig } = this.props;

    let loading = true;

    let listItems = [];
    if (!viewConfig.url) {
      // listItems can be taken dynamically from the server, but can also be injected via a prop.
      // This prop must be an object with two attributes:
      // 1. options   (Array of objects containing information of the items to be displayed).
      // 2. translate (Boolean indicating if the label property of a single object should be translated).

      // In case there's no url specified, we've got nothing to load, so the Spinner should not be displayed.
      loading = false;

      let listItemsUpdated = cloneDeep(this.props.listItems);
      if (listItemsUpdated.translate) {
        listItemsUpdated.options = listItemsUpdated.options.map((item) => {
          // Translate the label.
          if (Array.isArray(item.label)) {
              // Array of translate keys that are concatenated divided by a space.
              item.label = item.label.map((labelPart, index) => {
                if (index === 0) {
                  // We propercase only the first translate key.
                  return getDisplayValue(labelPart, 'propercase', true, this.props.translates);
                } else {
                  return getDisplayValue(labelPart, null, true, this.props.translates);
                }
              });
              item.label = item.label.join(' ');
          } else {
            // Translate key is a string.
            item.label = getDisplayValue(item.label, 'propercase', true, this.props.translates);
          }
          return item;
        });
      }

      listItems = listItemsUpdated.options;
    }

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
      sortedColumn: this.props.viewConfig.sort,
      sortOrder: this.props.viewConfig.sortOrder,
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

    if (this.props.lookup) {
      // In case of a lookup context, the selection must be binded to the input field in the end.
      // So the user selects one or more organisations in a lookup view, then these organisations must be stored in that input field.
      this.props.storeLookupInputId(this.props.lookupBindedInputId);
    }
  };

  componentWillMount = () => {
    if (this.state.viewConfig.url) {
      // In case the view source is a bunch of data to be loaded from a database, we initially load these listItems.
      this.reloadListView(this.state.skip);
    }
  }

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
        updatedListItems = this.state.listItems.map(item => item.id === response.data.id ? editedResponse : item);
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
      const content = <Label labelKey={trans.KEY_WARNING_CLOSE_FORM} />

      // Ask for user confirmation to lose all changes in the form.
      this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_CLOSE], 'warning', content, 'butOkCancel',
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
    const content = <Label labelKey={trans.KEY_ERROR_FETCH_ITEM} />
    this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', content, 'butOk');
  };

  /**
   * @brief   Callback that is triggered once a list of items has been successfully pulled from the server.
   */
  successGetHandler = (response, skip) => {
    // const { count, listItems } = response.data;
    const { count, list } = response.data;

    if (this.props.lookup) {
      // In case of a lookup context, the list items must be updated in the store.
      // this.props.storeLookupListItems(listItems);
      this.props.storeLookupListItems(list);
    }

    // List items successfully loaded, update the state.
    this.setState({
      listItems: list,
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
    this.setState({ loadedListItem: newPostData, selectedListItemId: null, configForm: cloneDeep(formConfig) });
  };

  /**
   * @brief   Delete a (multiple) set of list items.
   */
  deleteItems = (userConfirmation) => {
    if (userConfirmation) {
      const content = <Label labelKey={trans.KEY_WARNING_DELETE_DOCS} />
      // Ask for user confirmation before deleting records from the database.
      this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_DELETE], 'warning', content, 'butOkCancel',
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
        return selectedListItems.indexOf(item.id) ===  -1
      });

      this.setState({ listItems: updatedListItems, selectedListItems: [] });
    }
  };

  /**
   * @brief   Callback that is triggered once a delete action has NOT been successfully executed on the server.
   */
  errorDeleteHandler = (error) => {
    const content = <Label labelKey={trans.KEY_ERROR_REMOVE_LIST_ITEMS} />;
    this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', content, 'butOk');
  };

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
  };

  /**
   * @brief   Manages state containing an array of all selected rows in the listView.
   */
  toggleRowHandler = (id) => {
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
        default:
          break;
      }

    }

    this.setState({ selectedListItems: updatedSelectedListItems });

    if (this.props.lookup) {
      // In case of a lookup context, the selected listItem ids must be updated in the store.
      this.props.storeLookupListItemsSelected(updatedSelectedListItems);
    }
  };

  /**
   * @brief   Refreshes the current listView by pulling it from the server starting by the first record.
   */
  reloadListView = (skip, search, emptySearchbar) => {
    // const searchIn = [
    //   { property: this.state.viewConfig.rowBindedAttribute, value: [this.props.match.params.id] }
    // ];
    const { sort, sortOrder, viewConfig } = this.state;

    // Backend expects attribute name + '_asc' or '_desc' for the sort variable.
    const sortAttribute = sortOrder === -1 ? sort + '_desc' : sort + '_asc';

    const { limit } = viewConfig;
    // const params = { MAGIC: localStorage.getItem('magic'), sort, sortOrder, skip, limit, search, searchIn };
    // const params = { MAGIC: localStorage.getItem('magic'), sort, sortOrder, skip, limit, search };
    const params = { MAGIC: localStorage.getItem('magic'), sort: sortAttribute, skip, limit, search };

    // In case the list must be filtered based on a selected row in the previous view.
    if (this.state.viewConfig.rowBindedAttribute) {
      params[this.state.viewConfig.rowBindedAttribute] = this.props.match.params.id;
    }

    // callServer('post', '/' + this.state.viewConfig.url + '/read_multiple', (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);
    callServer('put', '/' + this.state.viewConfig.url, (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);

    // In case this reload is triggered from the view refresh action, text in the searchbar must be removed.
    if (emptySearchbar) {
      this.setState({ searchbarValue: '', loading: true })
    } else {
      this.setState({ loading: true });
    }
  };

  /**
   * @brief   Navigates a set of records (defined by limit property of the viewConfig) back- or forward.
   *          It can also skip multiple sets back- or forward.
   */
  nav = (forward, multiple) => {
    const { skip, viewConfig, searchbarValue } = this.state;
    const skipNext = forward ?
      (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) :
      (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);

    // Navigation buttons are always clickable, but should not trigger a server call if not necessary.
    if (skipNext >= 0 && this.state.count > skipNext) {
      this.reloadListView(skipNext, searchbarValue)
    }
  };

  /**
   * @brief   Updates the state for the search value.
   */
  inputSearchbarHandler = (event) => {
    this.setState({ searchbarValue: event.target.value, debounceFunction: false });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  clearSearchbarHandler = () => {
    this.setState({ searchbarValue: '' });
    this.reloadListView(0, '');
  };

  /**
   * @brief   Submits the search to the server.
   */
  submitSearchHandler = (_this) => {
     _this.reloadListView(0, _this.state.searchbarValue);
  };

  /**
   * @brief   Shows a modal where the user can select on which attribute to sort the listView in which order.
   */
  onClickSortHandler = () => {
    this.showModal('showModalSort', 'ModalWide', [trans.KEY_SORT], 'info',
      <View viewConfig={viewConfigSort} listItems={this.state.viewConfig.sortOptions} />, 'butOkCancel',
       () => this.processSelectedSortOption(), () => this.onModalSortCloseHandler());
  };

  /**
   * @brief   Closes the sort modal.
   */
  onModalSortCloseHandler = () => {
    this.setState({ showModalSort: false });
  };

  processSelectedSortOption = () => {
    // Get the selected sort item via the store.
    const selectedSortOption = this.state.viewConfig.sortOptions.options.filter((item) => item.id === this.props.sortItem);

    const { searchbarValue } = this.state;
    // const { sortOrder } = selectedSortOption[0];

    // setState is async function, the method 'reloadListView' relies on the updated state, so we use a callback to continue.
    this.setState({sort: selectedSortOption[0].sortOn, sortOrder: selectedSortOption[0].order}, () => { this.reloadListView(0, searchbarValue); });

    // Close the sort modal.
    this.onModalSortCloseHandler();
  };

  /**
   * @brief   Closes the message modal.
   */
  onModalMessageCloseHandler = () => {
    this.setState({ showModalMessage: false });
  };

  /**
   * @brief   Shows a modal where the user can select on which attribute to filter the listView on which value.
   */
  onClickFilterHandler = () => {
    this.setState({ showModalFilter: true });
  };

  /**
   * @brief   Closes the filter modal.
   */
  onModalFilterCloseHandler = () => {
    this.setState({ showModalFilter: false });
  };

  /**
   * @brief   Shows a modal where the user can change which columns to display in the listView.
   */
  onClickColumnConfiguratorHandler = () => {
    this.setState({ showModalColumnConfigurator: true });
  };

  /**
   * @brief   Closes the columns configurator modal.
   */
  onModalColumnConfiguratorCloseHandler = () => {
    this.setState({ showModalColumnConfigurator: false });
  };

  /**
   * @brief   Selects or deselects all listItems in the listView.
   */
  toggleAllRows = () => {
    let updatedSelectedListItems = [
      ...this.state.selectedListItems
    ];

    if (this.state.headerSelected) {
      updatedSelectedListItems = [];
    } else {
      updatedSelectedListItems = this.state.listItems.map((item) => item.id);
    }

    this.setState((prevState) => {
      return {
        headerSelected: !prevState.headerSelected,
        selectedListItems: updatedSelectedListItems
      };
    });

    if (this.props.lookup) {
      // In case of a lookup context, the selected listItem ids must be updated in the store.
      this.props.storeLookupListItemsSelected(updatedSelectedListItems);
    }
  };

  /**
   * @brief   Resorts the listView if user clicks on a column header.
   */
  sortOnColumn = (id) => {
    let { sortOrder } = this.state;
    const { sortedColumn, searchbarValue } = this.state;

    if (sortedColumn === id) {
      // Previous column sort click was on the same header.
      switch (sortOrder) {
        case 1: // ascending
          this.setState({sortOrder: -1}, () => { this.reloadListView(0, searchbarValue); });
          break;
        case -1: // descending
          sortOrder = this.state.viewConfig.sort === id ? 1 : this.state.viewConfig.sortOrder;

          this.setState({
            sort: this.state.viewConfig.sort,
            sortedColumn: this.state.viewConfig.sort,
            sortOrder
          }, () => { this.reloadListView(0, searchbarValue); });
          break;
        default:
          this.setState({sortOrder: -1}, () => { this.reloadListView(0, searchbarValue); });
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

  successFaker = () => this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_INFO], 'info', 'Fake data succesvol aangemaakt.', 'butOk');

  errorFaker = () => this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', 'Er is iets misgegaan met het aanmaken van fake data.', 'butOk');

  // deleteAll = () => {
  //   callServer('delete', '/' + this.state.viewConfig.url + '/delete_all',
  //     (response) => this.successDeleteAll(response),
  //     this.errorDeleteAll);
  // };
  // successDeleteAll = () => this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_INFO], 'info', 'Bulk records succesvol verwijderd.', 'butOk');
  // errorDeleteAll = () => this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', 'Er is iets misgegaan met het bulk verwijderen van records.', 'butOk');

  /**
   * @brief   Renders the listView including all modals for form, filtering, sorting and column configuration.
   */
  render = () => {
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

    const of = <Label labelKey={trans.KEY_OF} />;

    if (viewConfig.showNavigation) {
        navBack =     <div key="2" className={classes.PreviousNext} onClick={() => this.nav(false, false)}>&lt;</div>;
        navBackMult = <div key="3" className={classes.PreviousNext} onClick={() => this.nav(false, true)}>&lt;{step}</div>;
        navForwMult = <div key="4" className={classes.PreviousNext} onClick={() => this.nav(true, true)}>&gt;{step}</div>;
        navForw =     <div key="5" className={classes.PreviousNext} onClick={() => this.nav(true, false)}>&gt;</div>;
        if (count > skip) {
            navInfo = <div key="1" className={classes.Counter}>{skip + 1}-{skip + limit > count ? count : skip + limit} {of} {count}</div>;
        } else if (count === 0) {
          navInfo = <div key="1" className={classes.Counter}>0</div>;
        } else {
          navInfo = <div key="1" className={classes.Counter}>1-{count} {of} {count}</div>;
        }
    }
    const nav = [navInfo, navBack, navBackMult, navForwMult, navForw];

    // Title bar: Column configurator.
    const columnConfig = viewConfig.showColumnConfigurator ?
      <div  onClick={() => this.onClickColumnConfiguratorHandler()}
            className={classes.ColumnConfigurator}>
            <FontAwesomeIcon icon={icons.ICON_ELLIPSIS_V} />
      </div> : null;

    // Title bar: TEMPORARY TO DELETE ALL RECORDS FROM A COLLECTION, FOR TEST PURPOSES.
    // const deleteAll =
    //   <div onClick={() => this.deleteAll()}
    //        className={classes.ColumnConfigurator}>
    //        <FontAwesomeIcon icon={icons.ICON_TRASH} />
    //   </div>;

    // Title bar overall.
    const titleBar = viewConfig.showRowTitle ?
      <div className={classes.TitleRow}>
        <div onClick={() => this.createFakeData()} className={classes.Title}>
          <Label labelKey={this.state.viewConfig.title} convertType={'propercase'} />
        </div>
        <div className={classes.Navigation}>
          {/*deleteAll*/}
          {columnConfig}
          {nav}
        </div>
      </div> : null;

    // Actions bar: Filtering.
    const showFilterAction = filterOptions && filterOptions.length > 0 && showFilter ? true : false;
    const filter = showFilterAction ?
      <div onClick={() => this.onClickFilterHandler()} data-tip="React-tooltip" data-for={trans.KEY_FILTER_ACTION}>
        <FontAwesomeIcon icon={icons.ICON_FILTER} />
        <ReactTooltip id={trans.KEY_FILTER_ACTION} place="bottom" type="dark" effect="solid">
          <Label labelKey={trans.KEY_FILTER_ACTION} convertType={'propercase'} />
        </ReactTooltip>
      </div> :
      null;

    // Actions bar: Sorting.
    const showSortAction = sortOptions && sortOptions.options && sortOptions.options.length > 0 && showSort ? true : false;
    const sort = showSortAction ?
      <div onClick={() => this.onClickSortHandler()} data-tip="React-tooltip" data-for={trans.KEY_SORT_ACTION}>
        <FontAwesomeIcon icon={icons.ICON_SORT} />
        <ReactTooltip id={trans.KEY_SORT_ACTION} place="bottom" type="dark" effect="solid">
          <Label labelKey={trans.KEY_SORT_ACTION} convertType={'propercase'} />
        </ReactTooltip>
      </div> :
      null;

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
                    <Label labelKey={action.tooltip} convertType={'propercase'} />
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
    const debounced = this.state.debounceFunction ? _.debounce(this.submitSearchHandler, 800) : null;
    const search = getDisplayValue(trans.KEY_SEARCH, 'propercase', true, this.props.translates);

    let searchBar = null;
    if (viewConfig.showSearchbar) {
      searchBar = (
        <div className={classesCombinedSearchbar}>
          <div onClick={() => this.clearSearchbarHandler()}><FontAwesomeIcon icon={icons.ICON_TIMES_CIRCLE} /></div>
          <input
            value={this.state.searchbarValue}
            onChange={(event) => {
              this.inputSearchbarHandler(event);
              if (debounced) {
                debounced(this)
              }
            }}
            autoFocus
            className={classes.SearchInput} type="text" placeholder={search} />
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
    if (row && row.selectable && !(this.props.route && this.props.route.length > 0 && viewConfig.routeView !== false)) {
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
              sortIcon = this.state.sortOrder === 1 ? <FontAwesomeIcon icon={icons.ICON_SORT_UP} /> : <FontAwesomeIcon icon={icons.ICON_SORT_DOWN} />;
            }
            const sortColumn = column.sort ? <div className={classes.Sort}>{sortIcon}</div> : null;
            const labelColumn = <Label labelKey={column.label} convertType={'propercase'} />;
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
        if (this.state.selectedListItems.indexOf(listItem.id) ===  -1) {
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
        if (row && row.selectable && !(this.props.route && this.props.route.length > 0 && viewConfig.routeView !== false)) {
          // Only if the row is selectable, we print the 'checkbox' to select/deselect a listItems or 'radio' to select an item.
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

        // Only onDoubleClick event in case of mulitple selection of rows and NOT a lookup context.
        const doubleClick = (multiSelect && !this.props.lookup) ? () => this.onClickItemHandler(listItem.id) : null;

        const listItemDiv = (
          <div className={classesCombinedListItem}
            onClick={(event) => this.toggleRowHandler(listItem.id)}
            onDoubleClick={doubleClick}>
            {listItemsFixed}
            <div className={classes.Flex}>
              {
                columnsVisible.map((column, index) => {
                  let listItemColumnContent = null;
                  switch (column.contentType) {
                    case 'avatar':
                      listItemColumnContent = <Avatar size={column.size} foto={listItem[column.id]} name={listItem[column.avatarName]} />
                      break;
                    case 'timespan':
                      listItemColumnContent = <Timespan size={column.size} start={listItem[column.data.start]} end={listItem[column.data.end]} />;
                      break;
                    default:
                      listItemColumnContent = listItem[column.id];
                  };

                  return <div key={index} className={classes[column.size]}>{listItemColumnContent}</div>;
                })
              }
            </div>
          </div>
        );

        let listItemPrint = <Aux>{listItemDiv}</Aux>;
        // Check if we should display a new screen when clicking on a row.
        if (this.props.route && this.props.route.length > 0 && viewConfig.routeView !== false) {
          listItemPrint = (
            <Link to={this.props.match.url + '/' + this.props.route + '/' + listItem.id} key={index}>
              {listItemDiv}
            </Link>
          );
        }

        return(
          <Aux key={index}>{listItemPrint}</Aux>
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
    route: state.redMain.route,
    sortItem: state.redMain.sortItem,
    translates: state.redMain.transTranslates
  };
};

const mapDispatchToProps = dispatch => {
  return {
    untouchForm: () => dispatch( {type: types.FORM_UNTOUCH } ),
    storeSortItem: (sortItem) => dispatch( {type: types.SORT_ITEM_STORE, sortItem } ),
    storeLookupListItems: (lookupListItems) => dispatch( {type: types.LOOKUP_LIST_ITEMS_STORE, lookupListItems } ),
    storeLookupListItemsSelected: (lookupListItemsSelected) => dispatch( {type: types.LOOKUP_LIST_ITEMS_SELECTED_STORE, lookupListItemsSelected } ),
    storeLookupInputId: (lookupInputId) => dispatch( {type: types.LOOKUP_INPUT_ID_STORE, lookupInputId } )
  }
};

// BUG IN REDUX: In case of nested components (<View> embeds another <View>) mapStateToProps and mapDispatchToProps are NOT invoked.
// export default connect(mapStateToProps, mapDispatchToProps)(View);
// So if we assign connect() to a seperate variable and then we export this variable, it works!
const View = withRouter(connect(mapStateToProps, mapDispatchToProps)(_View));
export default View;
