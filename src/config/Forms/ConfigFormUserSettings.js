const formConfig = {
	title: 'keyPersonalSettings',
	url: 'usersettings',
	inputs: {
		language: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'en', displayValue: 'Engels' },
					{ value: 'nl', displayValue: 'Nederlands' }
				]
			},
			value: 'nl'
		}
	}
}

export default formConfig;
