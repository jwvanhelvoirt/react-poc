import * as types from './Actions';

const initialState = {
  formTouched: false,
  messageBox1: false,
  messageBox2: false,
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

    case types.MESSAGE_BOX1_OPENED: // There is a first message box on the screen.
    return {
      ...state,
      messageBox1: true
    }

    case types.MESSAGE_BOX1_CLOSED: // First message box on the screen has been closed, no more message boxes on the screen.
    return {
      ...state,
      messageBox1: false
    }

    case types.MESSAGE_BOX2_OPENED: // There is a second message box on the screen, opened from the first message box.
    return {
      ...state,
      messageBox2: true
    }

    case types.MESSAGE_BOX2_CLOSED: // Second message box on the screen has been closed, First messagebox is still open.
    return {
      ...state,
      messageBox2: false
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
