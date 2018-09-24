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

export const touchForm = () => {
  return {
    type: types.FORM_TOUCH
  };
};


export const translatesLoaded = () => {
  return {
    type: types.INIT_TRANSLATES_LOADED
  };
};

export const untouchForm = () => {
  return {
    type: types.FORM_UNTOUCH
  };
};

// export const xxx = (yyy) => {
//   return {
//     type: types.ZZZ,
//     yyy
//   };
// };
