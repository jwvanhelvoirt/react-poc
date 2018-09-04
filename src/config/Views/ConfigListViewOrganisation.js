import formConfigOrganisation from '../Forms/ConfigFormOrganisation';
import formConfigPerson from '../Forms/ConfigFormPerson';

const listViewConfig = {
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
			tooltip: 'keyAddOrganisation',
			callback: (_this) => { _this.addItem(formConfigOrganisation, true) }
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
			tooltip: 'keyAddPerson',
			callback: (_this) => { _this.addItem(formConfigPerson, false) }
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
			tooltip: 'keyDeleteSelectedItems',
			callback: (_this) => { _this.deleteItems(true) }
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
			tooltip: 'keyRefreshListView',
			callback: (_this) => _this.reloadListView(0, null, true)
		}
	],
	columns: [
		{
			id: 'name',
			label: 'keyName',
			sort: true,
			data: 'name',
			displayOn: 'always',
			show: true,
			size: 'Flex40'
		},
		{
			id: 'email',
			label: 'keyEmail',
			sort: false,
			data: 'email',
			displayOn: 'none',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'phone',
			label: 'keyPhone',
			sort: false,
			data: 'phone',
			displayOn: 'none',
			show: true,
			size: 'Flex20'
		},
		{
			id: 'website',
			label: 'keyWebsite',
			sort: false,
			data: 'website',
			displayOn: 'none',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'zip',
			label: 'keyZip',
			sort: true,
			data: 'zip',
			displayOn: 'large',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'streetAddress',
			label: 'keyStreet',
			sort: false,
			data: 'streetAddress',
			displayOn: 'medium,large',
			show: false,
			size: 'Flex40'
		},
		{
			id: 'city',
			label: 'keyCity',
			sort: true,
			data: 'city',
			displayOn: 'always',
			show: true,
			size: 'Flex20'
		},
		{
			id: 'country',
			label: 'keyCountry',
			sort: false,
			data: 'country',
			displayOn: 'always',
			show: false,
			size: 'Flex20'
		}
	],
	filterOptions: [
		{ id: 'city', label: 'keyCity', collection: ''}, // Als je geen collection opgeeft, dan gaat hij zoeken in collectie die aan viewConfig gekoppeld is.
		{ id: 'country', label: 'keyCountry', collection: ''},
		{ id: 'organisationManager', label: 'keyOrganisationManager', collection: 'medewerkers'}
	],
	limit: 50,
	multiSelect: true,
	relatedForm: formConfigOrganisation,
	row: { selectable: true, menu: false },
	rowSelectAll: true,
	showActions: true,
	showColumnConfigurator: true,
	showFilter: true,
	showListViewHeader: true,
	showNavigation: true,
	showRowActions: true,
	showRowHeader: true,
	showRowTitle: true,
	showSearchbar: true,
	showSort: true,
	sort: 'name',
	sortOptions: {
		translate: true,
		options: [ // In this order the sort options will appear in the list.
			{ _id: 'nameA', label: ['keyName', 'keyAscending'], sortOn: 'name', order: 1},
			{ _id: 'nameD', label: ['keyName', 'keyDescending'], sortOn: 'name', order: -1},
			{ _id: 'emailA', label: ['keyEmail', 'keyAscending'], sortOn: 'email', order: 1},
			{ _id: 'phoneA', label: ['keyPhone', 'keyAscending'], sortOn: 'phone', order: 1},
			{ _id: 'websiteA', label: ['keyWebsite', 'keyAscending'], sortOn: 'website', order: 1},
			{ _id: 'zipA', label: ['keyZip', 'keyAscending'], sortOn: 'zip', order: 1},
			{ _id: 'streetAddressA', label: ['keyStreet', 'keyAscending'], sortOn: 'streetAddress', order: 1},
			{ _id: 'cityA', label: ['keyCity', 'keyAscending'], sortOn: 'city', order: 1},
			{ _id: 'cityD', label: ['keyCity', 'keyDescending'], sortOn: 'city', order: -1},
			{ _id: 'countryA', label: ['keyCountry', 'keyAscending'], sortOn: 'country', order: 1}
		]
	},
	title: 'keyOrganisation',
	url: 'organisations'
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
