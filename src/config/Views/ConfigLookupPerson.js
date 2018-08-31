const listViewConfig = {
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
			sort: true,
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
	limit: 10,
	multiSelect: true,
	row: { selectable: true, menu: false },
	rowSelectAll: true,
	showFilter: false,
	showListViewHeader: true,
	showNavigation: true,
	showRowActions: true,
	showRowHeader: true,
	showRowTitle: true,
	showSearchbar: true,
	showSort: false,
	sort: 'name',
	sortOptions: [ // In this order the sort options will appear in the list.
		{ _id: 'nameA', label: 'Naam (a-z)', sortOn: 'name', order: 1},
		{ _id: 'nameD', label: 'Naam (z-a)', sortOn: 'name', order: -1},
		{ _id: 'emailA', label: 'Email (a-z)', sortOn: 'email', order: 1},
		{ _id: 'emailD', label: 'Email (z-a)', sortOn: 'email', order: -1},
		{ _id: 'zipA', label: 'Postcode (a-z)', sortOn: 'zip', order: 1},
		{ _id: 'streetAddressA', label: 'Straat (a-z)', sortOn: 'streetAddress', order: 1},
		{ _id: 'countryA', label: 'Land (a-z)', sortOn: 'country', order: 1}
	],
	title: 'keyPerson',
	url: 'persons'
}

export default listViewConfig;
