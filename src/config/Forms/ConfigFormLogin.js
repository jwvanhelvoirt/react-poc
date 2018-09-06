const formConfig = {
	buttons: 'butOk',
	buttonsClass: 'FillSpace',
	headerSize: 'HeaderMedium',
	noCreate: true,
	okButtonLabel: 'keyLogin',
	size: 'ModalSmall',
	title: 'keyLogin',
	titleAlign: 'Left', // default
	titleIcon: 'sign-in-alt',
	url: 'login',
	inputs: {
		username: {
			label: 'keyUsername',
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyUsername',
			value: '',
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
		}
	}
}

export default formConfig;
