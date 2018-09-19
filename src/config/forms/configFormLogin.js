import * as trans from '../../libs/translates';

const formConfig = {
	buttons: 'butOk',
	buttonsClass: 'FillSpace',
	headerSize: 'HeaderMedium',
	msgFailedSubmit: trans.KEY_FAILED_LOGIN,
	noCreate: true,
	okButtonLabel: 'keyLogin',
	size: 'ModalSmall',
	title: 'keyLogin',
	titleAlign: 'Left', // default
	titleIcon: 'sign-in-alt',
	url: 'login',
	inputs: {
		login: {
			label: 'keyUsername',
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyUsername',
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
			label: 'keyPassword',
			elementType: 'input',
			elementConfig: {
				type: 'password'
			},
			placeholder: 'keyPassword',
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
			label: 'keyRememberPrevLogin',
			elementType: 'triggerFunctionCheckbox',
			value: 0,
			valueLocalStorage: 'user'
			// Don't need this anymore, but leave it for reference. You can bind a function to be called when clicking the checkbox.
			// func: (event, configForm) => rememberPrevLogin(event, configForm)
		},
		forgotPassword: {
			label: 'keyForgotPassword',
			elementType: 'triggerFunctionLink',
			func: () => forgotPassword()
		}
	}
};

const forgotPassword = () => {
	console.log('user forgot password');
};

// Don't need this anymore, but leave it for reference. This function is triggered when clicking the checkbox of element type 'triggerFunctionCheckbox'.
// const rememberPrevLogin = (event, configForm) => {
// 	if (event.target.checked) {
// 		localStorage.setItem("user", configForm.inputs.username.value);
// 	} else {
// 		localStorage.removeItem("user");
// 	}
// };

export default formConfig;
