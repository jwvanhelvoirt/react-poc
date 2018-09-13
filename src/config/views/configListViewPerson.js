const listViewConfig = {
	columns: [
		{
			id: 'foto',
			label: '',
			sort: false,
			data: 'foto',
			displayOn: 'always',
			show: true,
			size: 'AvatarLarge',
			avatar: true,
			avatarName: 'naam'
		},
		{
			id: 'naam',
			label: 'keyName',
			sort: true,
			data: 'naam',
			displayOn: 'always',
			show: true,
			size: 'Flex40'
		},
		{
			id: 'niveau4',
			label: 'keyOrganisation',
			sort: true,
			data: 'niveau4',
			displayOn: 'always',
			show: true,
			size: 'Flex40'
		}
	],
	limit: 100,
	multiSelect: true,
	row: { selectable: true, menu: false },
	rowSelectAll: true,
	// showActions: true,
	// showColumnConfigurator: true,
	// showFilter: true,
	showListViewHeader: true,
	showNavigation: true,
	showRowActions: true,
	showRowHeader: true,
	showRowTitle: true,
	showSearchbar: true,
	// showSort: true,
	sort: 'naam',
	title: 'keyPerson',
	url: 'api.relatiebeheer.niveau9.list'
};

export default listViewConfig;
