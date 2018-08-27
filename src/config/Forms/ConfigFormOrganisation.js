import configLookupPerson from '../Views/ConfigLookupPerson';

const formConfig = {
	title: 'organisatie',
	url: 'organisations',
	inputs: {
		name: {
			label: 'Naam',
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
			touched: false,
			defaultFocus: true
		},
		persons: {
			label: 'Medewerkers',
			elementType: 'multiAppend',
			lookup: configLookupPerson,
			lookupFieldForDisplay: 'name',
			lookupTitle: 'Persoon',
			value: [],
			// validation: {
			// 	required: true
			// },
			// valid: false,
			// touched: false
		},
		email: {
			label: 'Email',
			elementType: 'input',
			elementConfig: {
				type: 'email',
				placeholder: 'Email'
			},
			value: ''
		},
		phone: {
			label: 'Telefoon',
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Telefoon'
			},
			value: ''
		},
		website: {
			label: 'Website',
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'Website'
			},
			value: ''
		},
		zip: {
			label: 'Postcode',
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
			label: 'Straat',
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
			label: 'Plaats',
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
			label: 'Land',
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
			label: 'Organisatie manager',
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
			label: 'Notitie',
			elementType: 'textarea',
			elementConfig: {
				rows: '4',
				placeholder: 'Notities'
			},
			value: ''
		},
		image: {
			label: 'Logo',
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
