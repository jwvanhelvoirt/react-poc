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
