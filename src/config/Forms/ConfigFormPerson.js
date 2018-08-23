/*
PERSON
name
email
phone
zip
streetAddress
city
country
note
image
*/

const formConfig = {
	title: 'persoon',
	url: 'persons',
	inputs: {
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Naam contact'
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
		},
		phone: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Telefoon'
			},
			value: ''
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
		streetAddress: {
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
		city: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Plaats'
			},
			value: '',
			validation: {
				required: true
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
			value: 'Nederland',
			validation: {
				required: true
			},
			valid: false,
			touched: false
		},
		organisationManager: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'erwin', displayValue: 'Erwin' },
					{ value: 'jos', displayValue: 'Jos' },
					{ value: 'jw', displayValue: 'JW' },
					{ value: 'jordy', displayValue: 'Jordy' },
					{ value: 'pradeep', displayValue: 'Pradeep' },
					{ value: 'rob', displayValue: 'Rob' },
				]
			},
			value: 'erwin'
		},
		note: {
			elementType: 'textarea',
			elementConfig: {
				rows: '4',
				placeholder: 'Notities'
			},
			value: ''
		},
		image: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Image url'
			},
			value: ''
		},
	}
}

export default formConfig;
