import * as types from './Actions';

const initialState = {
  formTouched: false,
  lookupFieldId: '',
  lookupFieldVal: '',
  messageBox1: false,
  messageBox2: false,
  searchTextOverall: '',
  showModalLookup: false,
  sortItem: '',
  transLanguage: 'nl',
  transTranslates: {}
}

const reducer = (state = initialState, action) => {

  switch (action.type) {

  case types.FORM_TOUCH: // Form is touched by the user.
  return {
    ...state,
    formTouched: true
  }

  case types.FORM_UNTOUCH: // Form is untouched again.
  return {
    ...state,
    formTouched: false
  }

  case types.LOOKUP_FIELD_ID_STORE: // User clicks on a lookup button in a form, stores the id of the related form field.
  return {
    ...state,
    lookupFieldId: action.lookupFieldId
  }

  case types.LOOKUP_FIELD_VAL_STORE: // User selected one or more rows from the lookup. Stores these values.
  return {
    ...state,
    lookupFieldVal: action.lookupFieldVal
  }

  case types.MESSAGE_BOX1_OPEN: // There is a first message box on the screen.
  return {
    ...state,
    messageBox1: true
  }

  case types.MESSAGE_BOX1_CLOSE: // First message box on the screen has been closed, no more message boxes on the screen.
  return {
    ...state,
    messageBox1: false
  }

  case types.MESSAGE_BOX2_OPEN: // There is a second message box on the screen, opened from the first message box.
  return {
    ...state,
    messageBox2: true
  }

  case types.MESSAGE_BOX2_CLOSE: // Second message box on the screen has been closed, First messagebox is still open.
  return {
    ...state,
    messageBox2: false
  }

  case types.SEARCHTEXT_OVERALL_STORE: // Search text in the menu bar searchbar.
  return {
    ...state,
    searchTextOverall: action.searchbarValue
  }

  case types.SORT_ITEM_STORE: // In the sort modal choosen item to sort the listView on.
  return {
    ...state,
    sortItem: action.sortItem
  }

  case types.TRANS_LANGUAGE_STORE: // Language of the interface.
  return {
    ...state,
    transLanguage: action.language
  }

  case types.TRANS_TRANSLATES_STORE: // Object with key/value pairs for the interfac language.
  return {
    ...state,
    transTranslates: action.translates
  }




  }

  return state;
}

export default reducer;
