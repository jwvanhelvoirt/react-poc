const listViewConfig = {
  columns: [
    {
      id: 'naam',
      label: 'keyName',
      sort: true,
      displayOn: 'always',
      show: true,
      size: 'Flex80'
    },
    {
      id: 'datumtijd',
      label: 'keyDate',
      sort: true,
      displayOn: 'always',
      show: true,
      size: 'Flex20'
    }
  ],
  limit: 25,
  multiSelect: true,
  row: { selectable: true, menu: false },
  rowBindedAttribute: 'refniveau5',// This connects this follow-up screen to the selected row in the previous screen.
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
  title: 'keyDocument',
  url: 'api.taken.taak.list'
};

export default listViewConfig;
