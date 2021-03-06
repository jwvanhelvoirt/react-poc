import * as types from './constActions';

const initialState = {
  authenticated: false,
  // followUpScreenData: '',
  formShowUserInfo: false,
  formTouched: false,
  initTranslatesLoaded: false,
  initMagicChecked: false,
  language: 'en_US',
  loadUserSettings: false,
  lookupListItems: [],
  lookupListItemsSelected: [],
  lookupInputId: '',
  messageBox1: false,
  messageBox2: false,
  route: '',
  searchTextOverall: '',
  showModalLookup: false,
  sortItem: '',
  translates: {}
};

const reducer = (state = initialState, action) => {

  switch (action.type) {

    case types.INIT_TRANSLATES_LOADED: // Translates have been fetched.
    return {
      ...state,
      initTranslatesLoaded: true
    };

    case types.INIT_MAGIC_CHECKED: // Magic has been checked on the server.
    return {
      ...state,
      initMagicChecked: action.initMagicChecked
    };

    // case types.FOLLOW_UP_SCREEN_ID_STORE: // Follow-up screen needs to print data from the previous screen.
    //   return {
    //     ...state,
    //     followUpScreenData: action.followUpScreenData
    //   };
    //




    case types.CANDIDATE_STATUSSES_STORE:
    return {
      ...state,
      candidateStatusses: action.candidateStatusses
    };

    case types.COMMUNICATION_TYPES_STORE: // Communication types related to communication info on forms for organisations and persons.
    return {
      ...state,
      communicationTypes: action.communicationTypes
    };

    case types.DROPDOWN_HTML_STORE:
    return {
      ...state,
      dropdownHtml: action.dropdownHtml
    };

    case types.EMPLOYEES_STORE:
    return {
      ...state,
      employees: action.employees
    };

    case types.FUNCTION_CODES_STORE:
    return {
      ...state,
      functionCodes: action.functionCodes
    };

    case types.GROUPS_STORE:
    return {
      ...state,
      groups: action.groups
    };

    case types.LIST9A_STORE:
    return {
      ...state,
      list9a: action.list9a
    };

    case types.LIST9B_STORE:
    return {
      ...state,
      list9b: action.list9b
    };

    case types.LIST9C_STORE:
    return {
      ...state,
      list9c: action.list9c
    };

    case types.LIST9D_STORE:
    return {
      ...state,
      list9d: action.list9d
    };

    case types.LIST9E_STORE:
    return {
      ...state,
      list9e: action.list9e
    };

    case types.LIST9F_STORE:
    return {
      ...state,
      list9f: action.list9f
    };

    case types.LIST9G_STORE:
    return {
      ...state,
      list9g: action.list9g
    };

    case types.LIST9H_STORE:
    return {
      ...state,
      list9h: action.list9h
    };



    case types.FORM_SUBMIT_DATA_STORE: // Stores data of last submitted form.
    return {
      ...state,
      formSubmitData: action.formSubmitData
    };

    case types.FORM_TOUCHED: // Form is touched by the user yes or no.
    return {
      ...state,
      formTouched: action.formTouched
    };

    case types.FORM_USER_INFO: // Show user info message in a form yes or no.
    return {
      ...state,
      formShowUserInfo: action.formShowUserInfo
    };

    case types.LOAD_USER_SETTINGS: // We use this to load user settings after a successfull login via the login component.
    return {
      ...state,
      loadUserSettings: action.loadUserSettings
    };

    case types.LOOKUP_LIST_ITEMS_STORE: // Store the listItems array of objects of the current lookup view.
    return {
      ...state,
      lookupListItems: action.lookupListItems
    };

    case types.LOOKUP_LIST_ITEMS_SELECTED_STORE: // Store the selected listItems of the current lookup view.
    return {
      ...state,
      lookupListItemsSelected: action.lookupListItemsSelected
    };

    case types.LOOKUP_INPUT_ID_STORE: // User clicks on a lookup button in a form, stores the id of the related input field.
    return {
      ...state,
      lookupInputId: action.lookupInputId
    };

    case types.MESSAGE_BOX1_OPEN: // There is a first message box on the screen.
    return {
      ...state,
      messageBox1: true
    };

    case types.MESSAGE_BOX1_CLOSE: // First message box on the screen has been closed, no more message boxes on the screen.
    return {
      ...state,
      messageBox1: false
    };

    case types.MESSAGE_BOX2_OPEN: // There is a second message box on the screen, opened from the first message box.
    return {
      ...state,
      messageBox2: true
    };

    case types.MESSAGE_BOX2_CLOSE: // Second message box on the screen has been closed, First messagebox is still open.
    return {
      ...state,
      messageBox2: false
    };

    case types.ROUTE_STORE: // URL extension to use when user clicks on a row that should display a follow-up screen.
    return {
      ...state,
      route: action.route
    };

    case types.SEARCHTEXT_OVERALL_STORE: // Search text in the menu bar searchbar.
    return {
      ...state,
      searchTextOverall: action.searchbarValue
    };

    case types.SORT_ITEM_STORE: // In the sort modal choosen item to sort the listView on.
    return {
      ...state,
      sortItem: action.sortItem
    };

    case types.TRANS_LANGUAGE_STORE: // Language of the interface.
    return {
      ...state,
      language: action.language
    };

    case types.TRANS_TRANSLATES_STORE: // Object with key/value pairs for the interface language.
    return {
      ...state,
      translates: action.translates
    };

    case types.USER_AUTHENTICATE: // Is the user authenticated or not?
    return {
      ...state,
      authenticated: action.authenticate
    };

    case types.USER_INFO_STORE: // Store all data form the authenticated user.
    return {
      ...state,
      userInfo: action.userInfo
    };

    default:
    break;

  };

  return state;
};

export default reducer;
