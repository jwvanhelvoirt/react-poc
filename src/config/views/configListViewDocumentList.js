import * as trans from '../../libs/constTranslates';

const listViewConfig = {
  columns: [
    {
      content: 'naam',
      label: trans.KEY_NAME,
      sort: true,
      sortOn: 'naam',
      displayOn: 'always',
      show: true,
      size: 'Flex80'
    },
    {
      content: 'datumtijd',
      label: trans.KEY_DATE,
      sort: true,
      sortOn: 'datumtijd',
      displayOn: 'always',
      show: true,
      size: 'Flex20'
    }
  ],
  limit: 25,
  multiSelect: true,
  row: { selectable: true, menu: false },
  rowBindedAttribute: 'refniveau5', 	 // This connects this follow-up screen to the selected row in the previous screen.
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
  sort: 'naam',
  sortOrder: 1,
  title: trans.KEY_DOCUMENT,
  url: 'api.document.document.list'
};

export default listViewConfig;
