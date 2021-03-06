import * as trans from '../../libs/constTranslates';

const listViewConfig = {
  columns: [
    {
      content: 'label',
      label: trans.KEY_SORT,
      columnClasses: ['ScreenAll'],
      show: true,
      size: 'Flex100'
    }
  ],
  routeView: false,
  row: { selectable: true, menu: false },
  viewType: 'sort'
};

export default listViewConfig;
