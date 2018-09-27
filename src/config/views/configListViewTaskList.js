import * as trans from '../../libs/constTranslates';
import baseConfig from './configListViewBase';

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
      content: 'eind',
      label: trans.KEY_DATE,
      sort: true,
      sortOn: 'eind',
      displayOn: 'always',
      show: true,
      size: 'Flex20'
    }
  ],
  row: { selectable: true, menu: false },
  rowBindedAttribute: 'refniveau5',// This connects this follow-up screen to the selected row in the previous screen.
  // F.i. if you click on an organisation in screen A, you get all related persons in screen B.
  // It will filter on the id in the URL in the collection 'persons' in the attribute configured here.
  showActions: false,
  sort: 'eind',
  sortOrder: 1,
  title: trans.KEY_DOCUMENT,
  url: 'api.taken.taak.list'
};

export default { ...baseConfig, ...listViewConfig };
