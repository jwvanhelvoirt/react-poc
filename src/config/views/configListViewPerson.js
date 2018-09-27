import * as trans from '../../libs/constTranslates';
import baseConfig from './configListViewBase';

const listViewConfig = {
  columns: [
    {
      content: 'foto',
      label: '',
      sort: false,
      displayOn: 'always',
      show: true,
      contentType: 'avatar',
      size: 'AvatarLarge',
      avatarName: 'naam'
    },
    {
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'completenaam' }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'email', classes: ['smallFont'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'tel', classes: ['smallFont'] }
            ]
          }
        ]
      },
      label: trans.KEY_NAME,
      sort: true,
      sortOn: 'naam',
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'niveau4' },
              { type: 'string', value: '(', classes: ['preSpace'] },
              { type: 'prop', value: 'niveau4debiteurnr' },
              { type: 'string', value: ')' },
            ]
          }
        ]
      },
      label: trans.KEY_ORGANISATION,
      sort: false,
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    }
  ],
  row: { selectable: true, menu: false },
  showActions: false,
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

export default { ...baseConfig, ...listViewConfig };
