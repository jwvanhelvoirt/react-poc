import * as actions from './centralViewActions';
import * as icon from '../../libs/constIcons';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configListViewBase';
import formConfigSupportDetails from '../forms/configFormSupportDetails';

const listViewConfig = {
  actions: [
    {
      ...actions.ACTION_ADD,
      id: 'createTicket',
      label: trans.KEY_ADD_TICKET,
      showInBarMenu: false,
      tooltip: trans.KEY_ADD_TICKET,
      callback: (_this) => { _this.addItem(formConfigSupportDetails, true) }
    },
    {
      ...actions.ACTION_REFRESH,
      showInRowMenu: false,
      showInBarMenu: false
    }
  ],
  columns: [
    {
      columnClasses: ['ScreenSmallColumn'],
      content: 'nr',
      label: trans.KEY_NR,
      show: true,
      size: 'Flex10',
      sort: true,
      sortOn: 'nr'
    },
    {
      columnClasses: ['ScreenSmallColumn'],
      content: 'naam',
      label: trans.KEY_DESCRIPTION,
      show: true,
      size: 'Flex100',
      sort: true,
      sortOn: 'naam'
    },
    {
      columnClasses: ['ScreenSmallColumn'],
      content: 'created',
      contentType: 'timespanTask',
      data: { start: 'created', end: 'datumtijd', totalDays: 60 },
      label: trans.KEY_INPUT,
      show: true,
      size: 'TimespanSmall',
      sort: true,
      sortOn: 'created'
    },
    {
      columnClasses: ['ScreenSmallColumn'],
      content: 'datumtijd',
      label: trans.KEY_CHANGE,
      date: true,
      dateType: 'fromNow',
      show: true,
      size: 'Flex15',
      sort: true,
      sortOn: 'datumtijd'
    },
    {
      columnClasses: ['ScreenSmallColumn'],
      content: {
        lines: [
          {
            lineData: [
              { type: 'icon', value: icon.ICON_BELL, color: 'taakprioriteit_color' },
              { type: 'prop', value: 'taakprioriteit_naam', classes: ['PreSpace'] }
            ]
          }
        ]
      },
      label: trans.KEY_PRIORITY,
      show: true,
      size: 'Flex15',
      sort: true,
      sortOn: 'taakprioriteit_naam'
    },
    {
      columnClasses: ['ScreenSmallColumn'],
      content: {
        lines: [
          {
            lineData: [
              {
                type: 'icon',
                // value: icon.ICON_PLAY,
                value: {
                  conditions: {
                    field: 'ks_type',
                    check: [
                      { checkValue: ['0', '1', '5', '6', '7', '8', '9'], value: icon.ICON_PLAY },
                      { checkValue: ['2', '3', '4'], value: icon.ICON_STOP }
                    ]
                  }
                },
                color: {
                  conditions: {
                    field: 'ks_type',
                    check: [
                      { checkValue: ['0', '1'], value: 'black' },
                      { checkValue: '2', value: 'red' },
                      { checkValue: '3', value: '#0d0' },
                      { checkValue: '4', value: 'lightgray' },
                      { checkValue: '5', value: '#bbaa00' },
                      { checkValue: ['6', '7', '8', '9'], value: '#ff9900' }
                    ]
                  }
                }
              },
              { type: 'prop', value: 'ks_naam', classes: ['PreSpace'] }
            ]
          }
        ]
      },
      label: trans.KEY_STATUS,
      show: true,
      size: 'Flex15',
      sort: true,
      sortOn: 'ks_naam'
    }
  ],
  multiSelect: false,
  row: { selectable: false, menu: false, hoverMenu: false },
  rowSelectAll: false,
  showActions: true,
  sort: 'nr',
  sortOrder: -1,
  title: trans.KEY_SUPPORT,
  url: 'portal/call/api.support.task'
};

export default { ...baseConfig, ...listViewConfig };
