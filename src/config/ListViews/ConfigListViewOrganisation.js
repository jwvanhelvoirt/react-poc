const listViewConfig = {
	limit: 2,
	columnsConfigurator: true,
	navigation: true,
	row: {
		selectable: true,
		menu: true
	},
	rowTitle: true,
	rowActions: true,
	rowHeader: true,
	rowSelectAll: true,
	searchbar: true,
	sort: 'name',
	title: 'Organisaties',
	url: 'organisations',
	actions: {
		delete: {
			labelIcon: 'trash-alt', /* kan ook labelText zijn */
			multiDoc: true,
			zeroDoc: false,
			showOnHover: true,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			callback: () => { alert("Delete selected!") }
		},
		createOrganisation: {
			labelIcon: 'building',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			callback: () => { alert("Create organisation!") }
		},
		create: {
			labelIcon: 'plus-square',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			subActions: {
				createPerson: {
					labelIcon: 'user-circle',
					multiDoc: false,
					zeroDoc: true,
					showOnHover: false,
					showInBarPrimary: true,
					showInBarMenu: true,
					showInRowMenu: true,
					callback: () => { alert("Create person!") }
				},
				createTask: {
					labelIcon: 'check-square',
					multiDoc: false,
					zeroDoc: true,
					showOnHover: false,
					showInBarPrimary: true,
					showInBarMenu: true,
					showInRowMenu: true,
					callback: () => { alert("Create task!") }
				}
			}
		}
	},
	columns: {
		name: {
			label: 'Naam',
			sort: true,
			data: 'name',
			displayOn: 'always'
		},
		street: {
			label: 'Straat',
			sort: false,
			data: 'street',
			displayOn: 'medium,large'
		},
		zip: {
			label: 'Postcode',
			sort: true,
			data: 'zip',
			displayOn: 'large'
		},
		country: {
			label: 'Land',
			sort: true,
			data: 'country',
			displayOn: 'always'
		},
		email: {
			label: 'Email',
			sort: false,
			data: 'email',
			displayOn: 'none'
		}
	},
}

export default listViewConfig;
