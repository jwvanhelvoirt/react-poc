import * as types from './Actions';

const initialState = {
  formTouched: false,
  searchTextOverall: ''
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

    case types.SEARCHTEXT_OVERALL: // Search text in the menu bar searchbar.
    return {
      ...state,
      searchTextOverall: action.searchText
    };

  }

  return state;
}

export default reducer;
