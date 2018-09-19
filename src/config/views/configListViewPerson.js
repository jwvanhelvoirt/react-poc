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
