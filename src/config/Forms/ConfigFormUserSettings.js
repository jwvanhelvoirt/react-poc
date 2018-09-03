const formConfig = {
	title: 'keyPersonalSettings',
	url: 'usersettings',
	inputs: {
		language: {
			elementType: 'select',
			elementConfig: {
				options: [
					{ value: 'en', displayValue: 'keyLangEnglish' },
					{ value: 'nl', displayValue: 'keyLangDutch' }
				]
			},
			value: 'nl'
		}
	}
}

export default formConfig;
