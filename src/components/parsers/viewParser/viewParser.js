import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser, storeLookupInputId, storeLookupListItems, storeLookupListItemsSelected, storeSortItem, touchedForm } from '../../../store/actions';
import cloneDeep from 'lodash/cloneDeep';
import Aux from '../../../hoc/auxiliary';
import viewConfigSort from '../../../config/views/configListViewSortOptions';
import FormParser from '../formParser/formParser';
import Spinner from '../../ui/spinners/spinner/spinner';
import Label from '../../ui/label/label';
import ActionMenu from '../../view/actionMenu/actionMenu';
import ViewModal from '../../view/viewModal/viewModal';
import ViewBars from '../../view/viewBars/viewBars';
import Rows from '../../view/rows/rows';
import { callServer } from '../../../api/api';
import { getDisplayValue } from '../../../libs/generic';
import * as trans from '../../../libs/constTranslates';
import classes from '../../view/view.scss';

class _View extends Component {

  constructor(props) {
    super(props);

    const { viewConfig } = this.props;

    let loading = true;
    let selectedListItems = [];

    let listItems = [];
    if (!viewConfig.url) {
      // listItems can be taken dynamically from the server, but can also be injected via a prop.
      // This prop must be an object with two attributes:
      // 1. options   (Array of objects containing information of the items to be displayed).
      // 2. translate (Boolean indicating if the label property of a single object should be translated).

      // In case there's no url specified, we've got nothing to load, so the Spinner should not be displayed.
      loading = false;
      let listItemsUpdated = cloneDeep(this.props.listItems);

      const { translate, defaultSortOption } = listItemsUpdated;
      let { options } = listItemsUpdated;

      if (translate) {
        options = options.map((item) => {
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

      listItems = options;

      if (defaultSortOption) {
        // This list must have a default value, for instance a popup with sort options.
        selectedListItems = [defaultSortOption];

        // And update the store.
        this.props.storeSortItem(defaultSortOption);
      }
    }

    this.state = {
      debounceFunction: true,
      configForm: viewConfig.relatedForm,
      count: 0,
      headerSelected: false,
      listItems,
      loadedListItem: null,
      loading,
      mousePosX: 0, // Horizontal positioning of the action menu.
      mousePosY: 0, // Vertical postioning of the action menu.
      searchbarValue: '',
      selectedListItemId: null,
      selectedListItems,
      showMenu: false,
      showMenuType: '',
      showModalFilter: false,
      showModalMessage: false,
      showModalSort: false,
      skip: 0,
      sort: this.props.viewConfig.sort,
      sortedColumn: this.props.viewConfig.sort,
      sortOrder: this.props.viewConfig.sortOrder,
      subActions: [],
      viewConfig: { ...viewConfig }
    };

    this.localData = {
      addRecordToView: false,
      callBackOk: null,
      callBackCancel: null,
      modalClass: '',
      messageTitle: [],
      messageType: '',
      messageContent: '',
      messageButtons: ''
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

  onSubmitHandler = (response) => {
    const { selectedListItemId, listItems } = this.state;

    if (this.localData.addRecordToView || selectedListItemId) {
      let updatedListItems = [];

      // Edited view entries are marked, so that we can emphasize them in the listview.
      const editedResponse = {
        ...response.data.list[0],
        edit: true
      }

      if (selectedListItemId) {
        // Put all current listItems in a variable, except the updated one.
        // For the updated we include the response.
        updatedListItems = listItems.map(item => item.id === selectedListItemId ? editedResponse : item);
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
      const content = <Label labelKey={trans.KEY_WARNING_CLOSE_FORM} convertType={'propercase'} />

      // Ask for user confirmation to lose all changes in the form.
      this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_CLOSE], 'warning', content, 'butOkCancel', 'Cancel',
         () => this.onCloseHandlerDiscardChanges(false), () => this.onModalMessageCloseHandler());
    } else {
      this.props.touchedForm(false);
      this.setState({ loadedListItem: null, configForm: { ...this.props.viewConfig.relatedForm } });
    }
  };

  /**
   * @brief   Pulls data from the selected listItem from the server.
   */
  onClickItemHandler = (id) => {
    this.setState({ selectedListItemId: id });

    const params = { MAGIC: localStorage.getItem('magic'), id };
    callServer('put', '/' + this.state.viewConfig.url + '.get',
      (response)=> this.successGetSingleHandler(response, id), this.errorGetSingleHandler, params);
  };

  /**
   * @brief   Callback that is triggered once data for a selected listItem has been successfully pulled from the server.
   */
  successGetSingleHandler = (response, id) => {
    // Item succssfully loaded from the server, setting state 'loadedListItem', will render form dialog.
    this.setState({ loadedListItem: response.data[id] });
  };

  /**
   * @brief   Callback that is triggered once data for a selected listItem has NOT been successfully pulled from the server.
   */
  errorGetSingleHandler = (error) => {
    // Item NOT successfully loaded, show the error in a modal.
    const content = <Label labelKey={trans.KEY_ERROR_FETCH_ITEM} convertType={'propercase'} />
    this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', content, 'butOk', 'Ok');
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

    switch (error.response.status) {
      case 401: // Unauthorized. Login failed.
        // User not authenticated anymore, MAGIC probabbly expired, show the login screen again.
        localStorage.removeItem('magic');
        this.props.authenticateUser(false);
        break;
      default:
    };
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
      const content = <Label labelKey={trans.KEY_WARNING_DELETE_DOCS} convertType={'propercase'} />
      // Ask for user confirmation before deleting records from the database.
      this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_DELETE], 'warning', content, 'butOkCancel', 'Ok',
         () => this.deleteItems(false), () => this.onModalMessageCloseHandler());

      this.setState({ showModalMessage: true });
    } else {
      this.onModalMessageCloseHandler();
      // Delete records from the database.
      // const params = { selectedListItems: this.state.selectedListItems };
      const params = { MAGIC: localStorage.getItem('magic'), id: this.state.selectedListItems[0] };
      callServer('put', '/' + this.state.viewConfig.url + '.del',
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
    // if (response.data.ok === 1 && response.data.n === selectedListItems.length) {
      // All records successfully deleted. Modify state.listItems
      let updatedListItems = [...this.state.listItems];
      updatedListItems = updatedListItems.filter((item) => {
        return selectedListItems.indexOf(item.id) ===  -1
      });

      this.setState({ listItems: updatedListItems, selectedListItems: [] });
    // }
  };

  /**
   * @brief   Callback that is triggered once a delete action has NOT been successfully executed on the server.
   */
  errorDeleteHandler = (error) => {
    const content = <Label labelKey={trans.KEY_ERROR_REMOVE_LIST_ITEMS} convertType={'propercase'} />;
    this.showModal('showModalMessage', 'ModalSmall', [trans.KEY_ERROR], 'error', content, 'butOk', 'Ok');
  };

  /**
   * @brief   Toont een modal voor specifiek foutafhandeling, info naar gebruiker..
   */
  showModal = (modalState, modalClass, title, type, content, buttons, focusButton,
    callBackOk = () => this.onModalMessageCloseHandler(),
    callBackCancel = () => this.onModalMessageCloseHandler()) => {
    this.localData.modalClass = modalClass;
    this.localData.messageTitle = title;
    this.localData.messageType = type;
    this.localData.messageContent = content;
    this.localData.messageButtons = buttons;
    this.localData.focusButton = focusButton;
    this.localData.callBackCancel = callBackCancel;
    this.localData.callBackOk = callBackOk;
    this.setState({ [modalState]: true });
  };

  showRowMenu = (event, id) => {
    event.preventDefault();
    event.stopPropagation();

    this.setState(
      {
        showMenu: true, showMenuType: 'showInRowMenu',
        mousePosX: event.clientX, mousePosY: event.clientY, selectedListItems: [id]
      }
    );
  };

  showBarMenu = (event) => {
    this.setState({ showMenu: true, showMenuType: 'showInBarMenu', mousePosX: event.clientX, mousePosY: event.clientY });
  };

  showBarMenuPrimary = (event, subActions) => {
    this.setState({ showMenu: true, showMenuType: 'showInBarMenu', mousePosX: event.clientX, mousePosY: event.clientY,
    subActions: subActions });
  };

  editItem = () => {
    this.onClickItemHandler(this.state.selectedListItems[0]);
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
    const params = { MAGIC: localStorage.getItem('magic'), sort: sortAttribute, skip, limit, search };

    // In case the list must be filtered based on a selected row in the previous view.
    if (this.state.viewConfig.rowBindedAttribute) {
      params[this.state.viewConfig.rowBindedAttribute] = this.props.match.params.id;
    }

    callServer('put', '/' + this.state.viewConfig.url + '.list', (response) => this.successGetHandler(response, skip), this.errorGetHandler, params);

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
    this.showModal('showModalSort', 'ModalLarge', [trans.KEY_SORT], 'info',
      <View viewConfig={viewConfigSort} listItems={this.state.viewConfig.sortOptions} />, 'butOkCancel', 'Ok',
       () => this.processSelectedSortOption(), () => this.onModalSortCloseHandler());
  };

  /**
   * @brief   Closes the sort modal.
   */
  onModalSortCloseHandler = () => {
    this.setState({ showModalSort: false });
  };

  /**
   * @brief   Closes the actions menu.
   */
  onActionsMenuCloseHandler = () => {
    this.setState({ showMenu: false, subActions: [] });
  };

  processSelectedSortOption = () => {
    // Get the selected sort item via the store.
    const selectedSortOption = this.state.viewConfig.sortOptions.options.filter((item) => item.id === this.props.sortItem);

    const { searchbarValue } = this.state;
    // const { sortOrder } = selectedSortOption[0];

    // setState is async function, the method 'reloadListView' relies on the updated state, so we use a callback to continue.
    this.setState({sort: selectedSortOption[0].sortOn, sortOrder: selectedSortOption[0].order},
      () => { this.reloadListView(0, searchbarValue); });

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

  /**
   * @brief   Renders the listView including all modals for form, filtering, sorting and column configuration.
   */
  render = () => {
    const { modalClass, messageButtons, focusButton, messageTitle, messageType, messageContent,
      callBackOk, callBackCancel} = this.localData;
    const { loadedListItem, configForm, selectedListItemId, showModalSort, showModalMessage, showMenu, subActions,
      showMenuType, viewConfig, loading, listItems, selectedListItems, mousePosX, mousePosY } = this.state;

    // Display the form modal in case loadedListItem is filled with form data.
    let formModal = null;
    if (loadedListItem) {
      formModal = (
        <FormParser
          configForm={configForm}
          data={loadedListItem}
          onCancel={() => this.onCloseHandler(true)}
          onSubmit={this.onSubmitHandler}
          id={selectedListItemId}
          modal={true}
        />
      );
    }

    // Modals that can be opened from this view depending on state.
    const viewModalData = { modalClass, messageTitle, type: messageType, messageContent,
      buttons: messageButtons, focusButton, callBackOk, callBackCancel, modal: true
    };
    const sortModal = <ViewModal show={showModalSort} viewModalData={viewModalData} />;
    const messageModal = <ViewModal show={showModalMessage} viewModalData={viewModalData} />;
    const actionMenu = (
      <ActionMenu
        actions={viewConfig.actions}
        actionMenuHeader={viewConfig.actionMenuHeader}
        subActions={subActions}
        show={showMenu}
        showType={showMenuType}
        actionMenuClosed={this.onActionsMenuCloseHandler}
        listItems={listItems}
        selectedListItems={selectedListItems}
        mousePosX={mousePosX}
        mousePosY={mousePosY}
        _this={this}
      />
    );
    // const filterModal = <ViewModal show={this.state.showModalFilter} viewModalData={viewModalData} />;

    // Start building the listView.
    // It contains many elements that can be shown or not, depending on configuration in the viewConfig.

    // Listview header.
    const listviewHeader = <ViewBars viewConfig={viewConfig} _this={this} />;

    // ListItems.
    let listOutput = <Rows viewConfig={viewConfig} _this={this} />;

    // In case the listItems are still fetched, we display a spinner.
    if (loading) {
      listOutput = <Spinner />;
    }

    return(
      <Aux>
        <div className={classes.ListviewContainer}>
          {listviewHeader}
          <div className={classes.ListviewContent}>
            {listOutput}
          </div>
        </div>
        {formModal}
        {/*filterModal*/}
        {sortModal}
        {messageModal}
        {actionMenu}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { formTouched, route, sortItem, translates } = state.redMain;
  return { formTouched, route, sortItem, translates };
};

const mapDispatchToProps = dispatch => {
  return {
    authenticateUser: (authenticate) => dispatch(authenticateUser(authenticate)),
    touchedForm: (formTouched) => dispatch(touchedForm(formTouched)),
    storeSortItem: (sortItem) => dispatch(storeSortItem(sortItem)),
    storeLookupListItems: (lookupListItems) => dispatch(storeLookupListItems(lookupListItems)),
    storeLookupListItemsSelected: (lookupListItemsSelected) => dispatch(storeLookupListItemsSelected(lookupListItemsSelected)),
    storeLookupInputId: (lookupInputId) => dispatch(storeLookupInputId(lookupInputId))
  }
};

// BUG IN REDUX: In case of nested components (<View> embeds another <View>) mapStateToProps and mapDispatchToProps are NOT invoked.
// export default connect(mapStateToProps, mapDispatchToProps)(View);
// So if we assign connect() to a seperate variable and then we export this variable, it works!
const View = withRouter(connect(mapStateToProps, mapDispatchToProps)(_View));
export default View;
