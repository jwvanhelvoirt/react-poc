const listViewConfig = {
  columns: [
    {
			id: 'foto',
			label: '',
			sort: false,
			data: 'foto',
			displayOn: 'always',
			show: true,
      contentType: 'avatar',
			size: 'AvatarLarge',
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
      sort: false,
      data: 'niveau4',
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      id: 'period',
      label: 'keyPeriod',
      sort: false,
      displayOn: 'always',
      show: true,
      contentType: 'timespan',
      data: { start: 'start', end: 'eind' },
      size: 'TimespanLarge'
    },
    {
      id: 'start',
      label: 'keyStart',
      sort: true,
      data: 'start',
      displayOn: 'always',
      show: true,
      size: 'Flex10'
    },
    {
      id: 'eind',
      label: 'keyEnd',
      sort: true,
      data: 'eind',
      displayOn: 'always',
      show: true,
      size: 'Flex10'
    }
  ],
  limit: 25,

  // multiSelect: true,
  // relatedForm: formConfigOrganisation,
  row: { selectable: true, menu: false },
  // row: { selectable: true, menu: false, route: 'document' },
  // rowBindedAttribute: 'organisations', // This connects the next screen to the selected row.
  //                                      // F.i. if you click on an organisation in screen A, you get all related persons in screen B.
  //                                      // It will filter on organisation id in the collection 'persons' in the attribute configured here.

  // rowSelectAll: true,
  // showActions: true,
  // showColumnConfigurator: true,
  // showFilter: true,
  showListViewHeader: true,
  showNavigation: true,
  showRowActions: true,
  showRowHeader: true,
  showRowTitle: true,
  showSearchbar: true,
  showSort: true,
  sort: 'nr_desc',
  title: 'keyProject',
  url: 'api.project.project.list'
};

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
