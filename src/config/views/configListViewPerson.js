import * as actions from './centralViewActions';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configListViewBase';
import formConfigPerson from '../forms/configFormPerson';

const listViewConfig = {
  actionMenuHeader: 'adressering',
  actions: [
    {
      ...actions.ACTION_ADD,
      id: 'createPerson',
      label: trans.KEY_ADD_PERSON,
      tooltip: trans.KEY_ADD_PERSON,
      callback: (_this) => { _this.addItem(formConfigPerson, true) }
    },
    {
      ...actions.ACTION_EDIT
    },
    {
      ...actions.ACTION_DELETE,
      divider: true
    },
    {
      ...actions.ACTION_REFRESH,
      showInRowMenu: false
    },
    {
      ...actions.ACTION_REPORT,
      subActions: [
        {
          ...actions.ACTION_REPORT_CERTIFICATIONS
        },
        {
          ...actions.ACTION_REPORT_CORRESPONDENCE
        }
      ]
    }
  ],
  columns: [
    {
      avatarName: 'naam',
      content: 'foto',
      contentType: 'avatar',
      label: '',
      show: true,
      size: 'AvatarLarge',
      sort: false
    },
    {
      columnClasses: ['ScreenSmallOnlyColumn'],
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'adressering', classes: ['FontBold'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'email', classes: ['FontSmall'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'tel', classes: ['FontSmall'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'niveau4' },
              { type: 'string', value: '(', classes: ['PreSpace'] },
              { type: 'prop', value: 'niveau4debiteurnr' },
              { type: 'string', value: ')' },
            ]
          }
        ]
      },
      label: trans.KEY_NAME,
      show: true,
      size: 'Flex100',
      sort: true,
      sortOn: 'naam'
    },
    {
      columnClasses: ['ScreenMediumColumn'],
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'adressering', classes: ['FontBold', 'FontGrey'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'email', classes: ['FontSmall'] }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'tel', classes: ['FontSmall'] }
            ]
          }
        ]
      },
      label: trans.KEY_NAME,
      show: true,
      size: 'Flex40',
      sort: true,
      sortOn: 'naam'
    },
    {
      columnClasses: ['ScreenMediumColumn'],
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'niveau4' },
              { type: 'string', value: '(', classes: ['PreSpace'] },
              { type: 'prop', value: 'niveau4debiteurnr' },
              { type: 'string', value: ')' },
            ]
          }
        ]
      },
      label: trans.KEY_ORGANISATION,
      show: true,
      size: 'Flex40',
      sort: false
    }
  ],
  relatedForm: formConfigPerson,
  row: { selectable: true, menu: true, hoverMenu: true },
  showActions: true,
  sort: 'naam',
  sortOrder: 1,
  sortOptions: {
    translate: true,
    defaultSortOption: 'wijzigingA',
    options: [ // In this order the sort options will appear in the list.
      { id: 'contactA', label: [trans.KEY_CONTACT, trans.KEY_ASCENDING], sortOn: 'laatstecontact', order: 1},
      { id: 'contactD', label: [trans.KEY_CONTACT, trans.KEY_DESCENDING], sortOn: 'laatstecontact', order: -1},
      { id: 'wijzigingA', label: [trans.KEY_CHANGE, trans.KEY_ASCENDING], sortOn: 'wijziging', order: 1},
      { id: 'wijzigingD', label: [trans.KEY_CHANGE, trans.KEY_DESCENDING], sortOn: 'wijziging', order: -1}
    ]
  },
  title: trans.KEY_PERSON,
  url: 'call/api.relatiebeheer.niveau9'
};

export default { ...baseConfig, ...listViewConfig };
