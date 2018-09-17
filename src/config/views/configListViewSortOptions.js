const listViewConfig = {
  columns: [
    {
      id: 'label',
      label: 'Sorteer optie',
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
