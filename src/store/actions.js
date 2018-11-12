import * as types from './constActions';

export const authenticateUser = (authenticate) => {
  return {
    type: types.USER_AUTHENTICATE,
    authenticate
  };
};

export const closeMessageBox1 = () => {
  return {
    type: types.MESSAGE_BOX1_CLOSE
  };
};

export const closeMessageBox2 = () => {
  return {
    type: types.MESSAGE_BOX2_CLOSE
  };
};

export const magicChecked = (initMagicChecked) => {
  return {
    type: types.INIT_MAGIC_CHECKED,
    initMagicChecked
  };
};

export const onSearch = (searchbarValue) => {
  return {
    type: types.SEARCHTEXT_OVERALL_STORE,
    searchbarValue
  };
};

export const openMessageBox1 = () => {
  return {
    type: types.MESSAGE_BOX1_OPEN
  };
};

export const openMessageBox2 = () => {
  return {
    type: types.MESSAGE_BOX2_OPEN
  };
};

export const setLoadUserSettings = (loadUserSettings) => {
  return {
    type: types.LOAD_USER_SETTINGS,
    loadUserSettings
  };
};

export const showUserInfo = (formShowUserInfo) => {
  return {
    type: types.FORM_USER_INFO,
    formShowUserInfo
  };
};

export const storeCandidateStatusses = (candidateStatusses) => {
  return {
    type: types.CANDIDATE_STATUSSES_STORE,
    candidateStatusses
  };
};

export const storeDropdownHtml = (dropdownHtml) => {
  return {
    type: types.DROPDOWN_HTML_STORE,
    dropdownHtml
  };
};

export const storeCommunicationTypes = (communicationTypes) => {
  return {
    type: types.COMMUNICATION_TYPES_STORE,
    communicationTypes
  };
};

export const storeEmployees = (employees) => {
  return {
    type: types.EMPLOYEES_STORE,
    employees
  };
};

export const storeFunctionCodes = (functionCodes) => {
  return {
    type: types.FUNCTION_CODES_STORE,
    functionCodes
  };
};

export const storeGroups = (groups) => {
  return {
    type: types.GROUPS_STORE,
    groups
  };
};

export const storeList9a = (list9a) => {
  return {
    type: types.LIST9A_STORE,
    list9a
  };
};

export const storeList9b = (list9b) => {
  return {
    type: types.LIST9B_STORE,
    list9b
  };
};

export const storeList9c = (list9c) => {
  return {
    type: types.LIST9C_STORE,
    list9c
  };
};

export const storeList9d = (list9d) => {
  return {
    type: types.LIST9D_STORE,
    list9d
  };
};

export const storeList9e = (list9e) => {
  return {
    type: types.LIST9E_STORE,
    list9e
  };
};

export const storeList9f = (list9f) => {
  return {
    type: types.LIST9F_STORE,
    list9f
  };
};

export const storeList9g = (list9g) => {
  return {
    type: types.LIST9G_STORE,
    list9g
  };
};

export const storeList9h = (list9h) => {
  return {
    type: types.LIST9H_STORE,
    list9h
  };
};

export const storeFormSubmitData = (formSubmitData) => {
  return {
    type: types.FORM_SUBMIT_DATA_STORE,
    formSubmitData
  };
};

export const storeLanguage = (language) => {
  return {
    type: types.TRANS_LANGUAGE_STORE,
    language
  };
};

export const storeUserInfo = (userInfo) => {
  return {
    type: types.USER_INFO_STORE,
    userInfo
  };
};

export const storeTranslates = (translates) => {
  return {
    type: types.TRANS_TRANSLATES_STORE,
    translates
  };
};

export const storeLookupInputId = (lookupInputId) => {
  return {
    type: types.LOOKUP_INPUT_ID_STORE,
    lookupInputId
  };
};

export const storeLookupListItems = (lookupListItems) => {
  return {
    type: types.LOOKUP_LIST_ITEMS_STORE,
    lookupListItems
  };
};

export const storeLookupListItemsSelected = (lookupListItemsSelected) => {
  return {
    type: types.LOOKUP_LIST_ITEMS_SELECTED_STORE,
    lookupListItemsSelected
  };
};

export const storeRoute = (route) => {
  return {
    type: types.ROUTE_STORE,
    route
  };
};

export const storeSortItem = (sortItem) => {
  return {
    type: types.SORT_ITEM_STORE,
    sortItem
  };
};

export const touchedForm = (formTouched) => {
  return {
    type: types.FORM_TOUCHED,
    formTouched
  };
};

export const translatesLoaded = () => {
  return {
    type: types.INIT_TRANSLATES_LOADED
  };
};

// export const xxx = (yyy) => {
//   return {
//     type: types.ZZZ,
//     yyy
//   };
// };
