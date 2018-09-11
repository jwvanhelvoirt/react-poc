// **** Actions ****

// #### We use CONSTANTS for action variable names ####
// This is because the compiler then will detect typos we make.
// These contants are stored in the file '/src/store/actions.js'.
// The constants are in capitals divided by an underscore. The action is always the last word, so NOT STORE_SORT_ITEM, but SORT_ITEM_STORE

// In every component that requires a dispatch to the store (in other words update a store variable), we import all constants.
// For example:
import * as types from '../../../store/actions';

const mapDispatchToProps = dispatch => {
  return {
    touchForm: () => dispatch( {type: types.FORM_TOUCH } )
  }
}

export default connect(null, mapDispatchToProps)(Form);
