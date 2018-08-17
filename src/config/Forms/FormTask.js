const formConfig = {
	url: 'task',
	title: 'taak',
	inputs: {
		description: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Postcode (i.e. 4334 AB)'
			},
			value: '',
			validation: {
				required: true,
				minLength: 10
			},
			valid: false,
			touched: false
		},
		description1: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: ''
			},
			value: '',
			validation: {
				required: true,
				minLength: 10
			},
			valid: false,
			touched: false
		},
		description2: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: ''
			},
			value: '',
			validation: {
				required: true,
				minLength: 10
			},
			valid: false,
			touched: false
		},
		typeTask: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'korte', displayValue: 'Korte' },
					{ value: 'middellange', displayValue: 'Middellang' },
					{ value: 'lange', displayValue: 'Lange' },
				]
			},
			value: 'korte'
		}
	}
}

export default formConfig;