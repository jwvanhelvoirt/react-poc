import * as types from './Actions';

const initialState = {
	searchTextOverall: ''
}

const reducer = (state = initialState, action) => {

	switch (action.type) {
		case types.SEARCHTEXT_OVERALL:
			return {
				...state,
				searchTextOverall: action.searchText
			};
		case 'XXX':
			return {
				...state
			}
	}

	return state;
}

export default reducer;
