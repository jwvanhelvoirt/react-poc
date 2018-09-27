const baseConfig = {
  limit: 50,
  multiSelect: true,
  row: { selectable: true, menu: true },
  rowSelectAll: true,
  showActions: true,
  showColumnConfigurator: false,
  showFilter: false,
  showListViewHeader: true,
  showNavigation: true,
  showRowActions: true,
  showRowHeader: true,
  showRowTitle: true,
  showSearchbar: true,
  showSort: true,
};

export default baseConfig;

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
