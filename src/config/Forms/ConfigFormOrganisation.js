const formConfig = {
	url: 'organisations',
	title: 'organisatie',
	inputs: {
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Organisatie benaming'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		street: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Straatnaam'
			},
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		zip: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Postcode'
			},
			value: '',
			validation: {
				required: true,
				minLength: 7,
				maxLength: 7
			},
			valid: false,
			touched: false
		},
		country: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Land'
			},
			value: 'Nederland'
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Email'
			},
			value: ''
		},
		deliveryMethod: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'fastest', displayValue: 'Snelste' },
					{ value: 'cheapest', displayValue: 'Goedkoopste' },
				]
			},
			value: 'cheapest'
		}
	}
}

export default formConfig;
