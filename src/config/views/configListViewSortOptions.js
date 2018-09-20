import * as trans from '../../libs/constTranslates';

const listViewConfig = {
  columns: [
    {
      id: 'label',
      label: trans.KEY_SORT,
      displayOn: 'always',
      show: true,
      size: 'Flex100'
    }
  ],
  routeView: false,
  row: { selectable: true, menu: false },
  viewType: 'sort'
};

export default listViewConfig;
