const listViewConfig = {
	batch: 50,
	columnsConfigurator: true,
	defaulSort: 'name',
	row: {
		selectable: true,
		menu: true
	},
	rowSelectAll: true,
	searchbar: true,
	title: 'organisaties',
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
			label: 'naam',
			sort: true,
			data: 'name',
			displayOn: 'small'
		},
		street: {
			label: 'straat',
			sort: false,
			data: 'street',
			displayOn: 'medium'
		},
		zip: {
			label: 'postcode',
			sort: true,
			data: 'zip',
			displayOn: 'large'
		},
		country: {
			label: 'land',
			sort: true,
			data: 'country',
			displayOn: 'small'
		},
		email: {
			label: 'email',
			sort: false,
			data: 'email',
			displayOn: 'none'
		}
	},
}

export default listViewConfig;
