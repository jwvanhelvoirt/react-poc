// import configLookupPerson from '../views/configLookupPerson';

const formConfig = {
	buttons: 'butOkCancel',
	headerSize: 'HeaderSmall',
	size: 'ModalWide',
	title: 'keyOrganisation',
	// titleIcon: 'building',
	url: 'organisations',
	inputs: {
		name: {
			label: 'keyName',
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
		// persons: {
		// 	elementType: 'multiAppend',
		// 	lookup: configLookupPerson,
		// 	lookupFieldForDisplay: 'name',
		// 	lookupTitle: 'keyPerson',
		// 	value: [],
		// 	// validation: {
		// 	// 	required: true
		// 	// },
		// 	// valid: false,
		// 	touched: false
		// },
		email: {
			label: 'keyEmail',
			elementType: 'input',
			elementConfig: {
				type: 'email'
			},
			placeholder: 'keyEmail',
			value: ''
		},
		phone: {
			label: 'keyPhone',
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyPhone',
			value: ''
		},
		website: {
			label: 'keyWebsite',
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyWebsite',
			value: ''
		},
		zip: {
			label: 'keyZip',
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
			label: 'keyStreet',
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
			label: 'keyCity',
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
			label: 'keyCountry',
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
			label: 'keyOrganisationManager',
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
			label: 'keyRemarks',
			elementType: 'textarea',
			elementConfig: {
				rows: '4'
			},
			placeholder: 'keyRemarks',
			value: ''
		},
		image: {
			label: 'keyLogo',
			elementType: 'input',
			elementConfig: {
				type: 'text'
			},
			placeholder: 'keyLogo',
			value: ''
		},
	}
};

export default formConfig;
