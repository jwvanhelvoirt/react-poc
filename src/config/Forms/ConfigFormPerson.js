import configLookupOrganisation from '../views/configLookupOrganisation';

const formConfig = {
	buttons: 'butOkCancel',
	headerSize: 'HeaderSmall',
	size: 'ModalWide',
	title: 'keyPerson',
	url: 'persons',
	inputs: {
		name: {
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyName',
			value: '',
			validation: {
				required: true
			},
			valid: false,
			touched: false,
			defaultFocus: true
		},
		organisations: {
			elementType: 'multiAppend',
			lookup: configLookupOrganisation,
			lookupFieldForDisplay: 'name',
			lookupTitle: 'keyOrganisation',
			value: [],
			// validation: {
			// 	required: true
			// },
			// valid: false,
			// touched: false
		},
		email: {
			elementType: 'input',
			elementConfig: {
				type: 'email'
			},
			placeholder: 'keyEmail',
			value: ''
		},
		phone: {
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyPhone',
			value: ''
		},
		zip: {
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyZip',
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
				type: 'text'
			},
			placeholder: 'keyStreet',
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
				type: 'text'
			},
			placeholder: 'keyCity',
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
				type: 'text'
			},
			placeholder: 'keyCountry',
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
				placeholder: 'keyRemarks'
			},
			value: ''
		},
		image: {
			elementType: 'input',
			elementConfig: {
				type: 'text',
				placeholder: 'keyLogo'
			},
			value: ''
		}
	}
};

export default formConfig;
