import * as trans from '../../libs/constTranslates';

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
      id: 'naam',
      label: trans.KEY_NAME,
      sort: true,
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      id: 'niveau4',
      label: trans.KEY_ORGANISATION,
      sort: false,
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
  showSort: true,
  sort: 'naam',
  sortOrder: 1,
  sortOptions: {
    translate: true,
    options: [ // In this order the sort options will appear in the list.
      { id: 'contactA', label: [trans.KEY_CONTACT, trans.KEY_ASCENDING], sortOn: 'laatstecontact', order: 1},
      { id: 'contactD', label: [trans.KEY_CONTACT, trans.KEY_DESCENDING], sortOn: 'laatstecontact', order: -1},
      { id: 'wijzigingA', label: [trans.KEY_CHANGE, trans.KEY_ASCENDING], sortOn: 'wijziging', order: 1},
      { id: 'wijzigingD', label: [trans.KEY_CHANGE, trans.KEY_DESCENDING], sortOn: 'wijziging', order: -1},
    ]
  },
  title: trans.KEY_PERSON,
  url: 'api.relatiebeheer.niveau9.list'
};

export default listViewConfig;
