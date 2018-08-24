import formConfigOrganisation from '../Forms/ConfigFormOrganisation';

const listViewConfig = {
	actions: [
		{
			id: 'createPerson',
			labelIcon: 'plus',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			tooltip: 'Voeg nieuw persoon toe',
			callback: (_this) => { _this.addItem(_this.props.formConfig) }
		},
		{
			id: 'createOrganisation',
			labelIcon: 'building',
			multiDoc: true,
			zeroDoc: true,
			showOnHover: false,
			showInBarPrimary: true,
			showInBarMenu: true,
			showInRowMenu: true,
			tooltip: 'Voeg nieuwe organisatie toe',
			callback: (_this) => { _this.addItem(formConfigOrganisation) }
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
			tooltip: 'Verwijder geselecteerde personen',
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
			tooltip: 'Ververs listview',
			callback: (_this) => _this.reloadListView(0, null, true)
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
			id: 'email',
			label: 'Email',
			sort: false,
			data: 'email',
			displayOn: 'none',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'phone',
			label: 'Telefoon',
			sort: false,
			data: 'phone',
			displayOn: 'none',
			show: true,
			size: 'Flex20'
		},
		{
			id: 'zip',
			label: 'Postcode',
			sort: true,
			data: 'zip',
			displayOn: 'large',
			show: false,
			size: 'Flex20'
		},
		{
			id: 'streetAddress',
			label: 'Straat',
			sort: false,
			data: 'streetAddress',
			displayOn: 'medium,large',
			show: false,
			size: 'Flex40'
		},
		{
			id: 'city',
			label: 'Plaats',
			sort: true,
			data: 'city',
			displayOn: 'always',
			show: true,
			size: 'Flex20'
		},
		{
			id: 'country',
			label: 'Land',
			sort: false,
			data: 'country',
			displayOn: 'always',
			show: false,
			size: 'Flex20'
		}
	],
	filterOptions: [
		{ id: 'city', label: 'Plaats', collection: ''}, // Als je geen collection opgeeft, dan gaat hij zoeken in collectie die aan viewConfig gekoppeld is.
		{ id: 'country', label: 'Land', collection: ''},
		{ id: 'organisationManager', label: 'Organisatie manager', collection: 'medewerkers'}
	],
	limit: 50,
	row: { selectable: true, menu: true },
	rowSelectAll: true,
	showActions: true,
	showColumnConfigurator: true,
	showFilterSort: true,
	showListViewHeader: true,
	showNavigation: true,
	showRowActions: true,
	showRowHeader: true,
	showRowTitle: true,
	showSearchbar: true,
	sort: 'name',
	sortOptions: [
		{ id: 'name', label: 'Naam'},
		{ id: 'email', label: 'Email'},
		{ id: 'phone', label: 'Telefoon'},
		{ id: 'zip', label: 'Postcode'},
		{ id: 'streetAddress', label: 'Straat'},
		{ id: 'city', label: 'Plaats'},
		{ id: 'country', label: 'Land'}
	],
	title: 'Personen',
	url: 'persons'
}

export default listViewConfig;
