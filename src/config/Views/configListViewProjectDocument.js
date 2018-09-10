import formConfigPerson from '../forms/configFormPerson';
// import formConfigOrganisation from '../forms/configFormOrganisation';

const listViewConfig = {
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
			sort: true,
			data: 'email',
			displayOn: 'none',
			show: true,
			size: 'Flex30'
		},
		{
			id: 'phone',
			label: 'keyPhone',
			sort: true,
			data: 'phone',
			displayOn: 'none',
			show: true,
			size: 'Flex30'
		}
	],
	filterOptions: [
		{ id: 'city', label: 'keyCity', collection: ''}, // Als je geen collection opgeeft, dan gaat hij zoeken in collectie die aan viewConfig gekoppeld is.
		{ id: 'country', label: 'keyCountry', collection: ''},
		{ id: 'organisationManager', label: 'keyOrganisationManager', collection: 'medewerkers'}
	],
	limit: 50,
	multiSelect: true,
	relatedForm: formConfigPerson,
	row: { selectable: true, menu: false },
	rowBindedAttribute: 'organisations', // This connects this follow-up screen to the selected row in the previous screen.
                                       // F.i. if you click on an organisation in screen A, you get all related persons in screen B.
                                       // It will filter on the id in the URL in the collection 'persons' in the attribute configured here.
	rowSelectAll: true,
	showActions: false,
	showColumnConfigurator: false,
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
			{ _id: 'emailD', label: ['keyEmail', 'keyDescending'], sortOn: 'email', order: -1},
			{ _id: 'zipA', label: ['keyZip', 'keyAscending'], sortOn: 'zip', order: 1},
			{ _id: 'streetAddressA', label: ['keyStreet', 'keyAscending'], sortOn: 'streetAddress', order: 1},
			{ _id: 'countryA', label: ['keyCountry', 'keyAscending'], sortOn: 'country', order: 1}
		]
	},
	title: 'keyDocument',
	url: 'persons'
};

export default listViewConfig;
