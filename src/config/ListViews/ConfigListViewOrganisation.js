import formConfigPerson from '../Forms/ConfigFormPerson';

const listViewConfig = {
	limit: 50,
	showColumnConfigurator: true,
	showNavigation: true,
	showListViewHeader: true,
	row: {
		selectable: true,
		menu: true
	},
	showRowTitle: true,
	showRowActions: true,
	showActions: true,
	showFilterSort: true,
	showRowHeader: true,
	rowSelectAll: true,
	showSearchbar: true,
	sort: 'name',
	sortOptions: [
		{ id: 'street', label: 'Straat'},
		{ id: 'zip', label: 'Postcode'},
		{ id: 'country', label: 'Land'},
		{ id: 'email', label: 'Email'}
	],
	filterOptions: [
		{ id: 'zip', label: 'Postcode', collection: ''}, // Als je geen collection opgeeft, dan gaat hij zoeken in collectie die aan viewConfig gekoppeld is.
		{ id: 'country', label: 'Land', collection: ''}
	],
	title: 'Organisaties',
	url: 'organisations',
	actions: [
		{
			id: 'createOrganisation',
			labelIcon: 'plus',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			tooltip: 'Voeg nieuwe organisatie toe',
			callback: (_this) => { _this.addItem(_this.props.formConfig) }
		},
		{
			id: 'createPerson',
			labelIcon: 'user',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			tooltip: 'Voeg nieuwe persoon toe',
			callback: (_this) => { _this.addItem(formConfigPerson) }
		},
		{
			id: 'delete',
			labelIcon: 'trash-alt', /* kan ook labelText zijn */
			multiDoc: true,
			zeroDoc: false,
			showOnHover: true,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			tooltip: 'Verwijder geselecteerde organisaties',
			callback: (_this) => { console.log('delete'); }
		},
		{
			id: 'refresh',
			labelIcon: 'sync-alt',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: false,
			tooltip: 'Ververs listview',
			callback: (_this) => _this.reloadListView(0)
		}
	],
	columns: [
		{
			id: 'name',
			label: 'Naam',
			sort: true,
			data: 'name',
			displayOn: 'always',
			show: true,
			size: 'Flex40'
		},
		{
			id: 'street',
			label: 'Straat',
			sort: false,
			data: 'street',
			displayOn: 'medium,large',
			show: true,
			size: 'Flex40'
		},
		{
			id: 'zip',
			label: 'Postcode',
			sort: true,
			data: 'zip',
			displayOn: 'large',
			show: true,
			size: 'Flex20'
		},
		{
			id: 'country',
			label: 'Land',
			sort: true,
			data: 'country',
			displayOn: 'always',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'email',
			label: 'Email',
			sort: false,
			data: 'email',
			displayOn: 'none',
			show: false,
			size: 'Flex20'
		}
	],
}

export default listViewConfig;


// SUBACTIONS VOOR HET MOMENT NIET GEIMPLEMENTEERD.
// {
// 	id: 'create',
// 	labelIcon: 'plus-square',
// 	multiDoc: true,
// 	zeroDoc: true,
// 	showOnHover: false,
// 	showInBarPrimary: true,
// 	showInBarMenu: true,
// 	subActions: [
// 		{
// 			id: 'createPerson',
// 			labelIcon: 'user-circle',
// 			multiDoc: false,
// 			zeroDoc: true,
// 			showOnHover: false,
// 			showInBarPrimary: true,
// 			showInBarMenu: true,
// 			showInRowMenu: true,
// 			callback: () => { alert("Create person!") }
// 		},
// 		{
// 			id: 'createTask',
// 			labelIcon: 'check-square',
// 			multiDoc: false,
// 			zeroDoc: true,
// 			showOnHover: false,
// 			showInBarPrimary: true,
// 			showInBarMenu: true,
// 			showInRowMenu: true,
// 			callback: () => { alert("Create task!") }
// 		}
// 	]
// }

// IK HEB HET IDEE DAT EEN ARRAY VEEL HANDIGER IS, WEET ALLEEN NOG NIET HOE HET VALT BIJ UPDATEN.
// columns: {
// 	name: {
// 		label: 'Naam',
// 		sort: true,
// 		data: 'name',
// 		displayOn: 'always',
// 		show: true
// 	},
// 	street: {
// 		label: 'Straat',
// 		sort: false,
// 		data: 'street',
// 		displayOn: 'medium,large',
// 		show: true
// 	},
// 	zip: {
// 		label: 'Postcode',
// 		sort: true,
// 		data: 'zip',
// 		displayOn: 'large',
// 		show: false
// 	},
// 	country: {
// 		label: 'Land',
// 		sort: true,
// 		data: 'country',
// 		displayOn: 'always',
// 		show: true
// 	},
// 	email: {
// 		label: 'Email',
// 		sort: false,
// 		data: 'email',
// 		displayOn: 'none',
// 		show: false
// 	}
