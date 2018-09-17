const listViewConfig = {
  columns: [
    {
      id: 'foto',
      label: '',
      sort: false,
      displayOn: 'always',
      show: true,
      contentType: 'avatar',
      size: 'AvatarLarge',
      avatarName: 'naam'
    },
    {
      id: 'code',
      label: 'keyName',
      sort: true,
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      id: 'niveau4',
      label: 'keyOrganisation',
      sort: true,
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      id: 'start',
      label: 'keyPeriod',
      sort: true,
      displayOn: 'always',
      show: true,
      contentType: 'timespan',
      data: { start: 'start', end: 'eind' },
      size: 'TimespanLarge'
    }
    // {
    //   id: 'start',
    //   label: 'keyStart',
    //   sort: true,
    //   displayOn: 'always',
    //   show: true,
    //   size: 'Flex10'
    // },
    // {
    //   id: 'eind',
    //   label: 'keyEnd',
    //   sort: true,
    //   displayOn: 'always',
    //   show: true,
    //   size: 'Flex10'
    // }
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
  sort: 'niveau4',
  sortOrder: -1,
  sortOptions: {
    translate: true,
    options: [ // In this order the sort options will appear in the list.
      { id: 'level1A', label: ['keyLevel1', 'keyAscending'], sortOn: 'niveau1', order: 1},
      { id: 'level1D', label: ['keyLevel1', 'keyDescending'], sortOn: 'niveau1', order: -1},
      { id: 'endDateA', label: ['keyEndDate', 'keyAscending'], sortOn: 'eind', order: 1},
      { id: 'endDateD', label: ['keyEndDate', 'keyDescending'], sortOn: 'eind', order: -1},
      { id: 'nrA', label: ['keyNo', 'keyAscending'], sortOn: 'nr', order: 1},
      { id: 'nrD', label: ['keyNo', 'keyDescending'], sortOn: 'nr', order: -1},
      { id: 'startDateA', label: ['keyStartDate', 'keyAscending'], sortOn: 'start', order: 1},
      { id: 'startDateD', label: ['keyStartDate', 'keyDescending'], sortOn: 'start', order: -1},
      { id: 'level4A', label: ['keyLevel4', 'keyAscending'], sortOn: 'niveau4', order: 1},
      { id: 'level4D', label: ['keyLevel4', 'keyDescending'], sortOn: 'niveau4', order: -1},
    ]
  },
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
// 		id: 'name',
// 		label: 'Naam',
// 		sort: true,
// 		displayOn: 'always',
// 		show: true
// 	},
// 	street: {
// 		id: 'street',
// 		label: 'Straat',
// 		sort: false,
// 		displayOn: 'medium,large',
// 		show: true
// 	},
// 	zip: {
// 		id: 'zip',
// 		label: 'Postcode',
// 		sort: true,
// 		displayOn: 'large',
// 		show: false
// 	},
// 	country: {
// 		id: 'country',
// 		label: 'Land',
// 		sort: true,
// 		displayOn: 'always',
// 		show: true
// 	},
// 	email: {
// 		id: 'email',
// 		label: 'Email',
// 		sort: false,
// 		displayOn: 'none',
// 		show: false
// 	}
