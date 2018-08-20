const formConfig = {
	url: 'persons',
	title: 'persoon',
	inputs: {
		forname: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Voornaam'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		initials: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Initialen'
			},
			value: '',
		},
		surname: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Achternaam'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Email'
			},
			value: ''
		}
	}
}

export default formConfig;