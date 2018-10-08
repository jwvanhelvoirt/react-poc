import * as icons from '../../libs/constIcons';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configFormBase';

// import configLookupPerson from '../views/configListViewPerson';

const formConfig = {
	buttons: 'butOk',
	msgFailedSubmit: trans.KEY_FAILED_LOGIN,
	noCreate: true,
	okButtonLabel: trans.KEY_LOGIN,
	size: 'ModalSmall',
	title: trans.KEY_LOGIN,
	titleIcon: icons.ICON_SIGN_IN_ALT,
	url: 'api.login',
	urlSuffix: false,
	inputs: {
		login: {
			label: trans.KEY_USERNAME,
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: trans.KEY_USERNAME,
			value: '',
			valueLocalStorage: 'user',
			validation: {
				required: true
			},
			valid: false,
			touched: false,
			defaultFocus: true
		},
		password: {
			label: trans.KEY_PASSWORD,
			elementType: 'input',
			elementConfig: {
				type: 'password'
			},
			placeholder: trans.KEY_PASSWORD,
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		remember_login: {
			// TODO : nu de functie niet meer nodig is, kan dit een normale checkbox worden, checkboxes en radios zijn echter nog niet ingeregeld.
			// Moet straks dus wel omgezet worden naar een gewone checkbox.
			label: trans.KEY_REMEMBER_PREV_LOGIN,
			elementType: 'singleCheckbox',
			value: 0,
			valueLocalStorage: 'user'
			// Don't need this anymore, but leave it for reference. You can bind a function to be called when clicking the checkbox.
			// func: (event, configForm) => rememberPrevLogin(event, configForm)
		},
		forgotPassword: {
			label: trans.KEY_FORGOT_PASSWORD,
			elementType: 'formLink',
			func: () => forgotPassword()
		},
		// // Alleen om te testen,kan straks weg.
		note: {
			label: trans.KEY_USERNAME,
			elementType: 'textarea',
			elementConfig: {
				rows: '4'
			},
			placeholder: trans.KEY_USERNAME,
			preventSubmitOnEnter: true,
			value: ''
		},
		// organisationManager: {
		// 	label: trans.KEY_USERNAME,
		// 	elementType: 'select',
		// 	elementConfig: {
		// 		options: [
		// 			{ value: 'erwin', displayValue: 'Erwin' },
		// 			{ value: 'jos', displayValue: 'Jos' },
		// 			{ value: 'jw', displayValue: 'JW' },
		// 			{ value: 'jordy', displayValue: 'Jordy' },
		// 			{ value: 'pradeep', displayValue: 'Pradeep' },
		// 			{ value: 'rob', displayValue: 'Rob' },
		// 		]
		// 	},
		// 	value: 'erwin'
		// },
		// organisations: {
		// 	elementType: 'multiAppend',
		// 	lookup: configLookupPerson,
		// 	lookupFieldForDisplay: 'name',
		// 	lookupTitle: trans.KEY_USERNAME,
		// 	value: [],
		// }
	}
};

const forgotPassword = () => {
	console.log('user forgot password');
};

// Don't need this anymore, but I'll leave it for reference.
// This function is triggered when clicking the checkbox of element type 'singleCheckbox'.
// const rememberPrevLogin = (event, configForm) => {
// 	if (event.target.checked) {
// 		localStorage.setItem('user', configForm.inputs.username.value);
// 	} else {
// 		localStorage.removeItem('user');
// 	}
// };

export default { ...baseConfig, ...formConfig };
