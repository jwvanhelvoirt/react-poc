import * as trans from '../../libs/constTranslates';
import baseConfig from './configListViewBase';

const listViewConfig = {
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
      columnClasses: ['ScreenMedium'],
      content: 'code',
      label: trans.KEY_NAME,
      show: true,
      size: 'Flex40',
      sort: true,
      sortOn: 'code'
    },
    {
      columnClasses: ['ScreenMedium'],
      content: 'niveau4',
      label: trans.KEY_ORGANISATION,
      show: true,
      size: 'Flex40',
      sort: true,
      sortOn: 'niveau4'
    },
    {
      columnClasses: ['ScreenMedium'],
      content: 'start',
      contentType: 'timespan',
      data: { start: 'start', end: 'eind' },
      label: trans.KEY_PERIOD,
      show: true,
      size: 'TimespanLarge',
      sort: true,
      sortOn: 'start'
    },
    {
      columnClasses: ['ScreenSmallOnly'],
      content: {
        lines: [
          {
            lineData: [
              { type: 'prop', value: 'code' }
            ]
          },
          {
            lineData: [
              { type: 'prop', value: 'niveau4', classes: ['smallFont'] }
            ]
          }
        ]
      },
      label: trans.KEY_NAME,
      show: true,
      size: 'Flex100',
      sort: true,
      sortOn: 'code'
    },
    {
      columnClasses: ['ScreenSmallOnly'],
      content: 'start',
      contentType: 'timespan',
      data: { start: 'start', end: 'eind' },
      label: trans.KEY_PERIOD,
      show: true,
      size: 'TimespanSmall',
      sort: true,
      sortOn: 'start'
    }
  ],
  multiSelect: false,
  // relatedForm: formConfigOrganisation,
  row: { selectable: true, menu: false },
  rowSelectAll: false,
  showActions: false,
  sort: 'niveau4',
  sortOrder: -1,
  sortOptions: {
    translate: true,
    options: [ // In this order the sort options will appear in the list.
      { id: 'level1A', label: [trans.KEY_LLC, trans.KEY_ASCENDING], sortOn: 'niveau1', order: 1},
      { id: 'level1D', label: [trans.KEY_LLC, trans.KEY_DESCENDING], sortOn: 'niveau1', order: -1},
      { id: 'endDateA', label: [trans.KEY_ENDDATE, trans.KEY_ASCENDING], sortOn: 'eind', order: 1},
      { id: 'endDateD', label: [trans.KEY_ENDDATE, trans.KEY_DESCENDING], sortOn: 'eind', order: -1},
      { id: 'beginDateA', label: [trans.KEY_INPUT, trans.KEY_ASCENDING], sortOn: 'datumbegin', order: 1},
      { id: 'beginDateD', label: [trans.KEY_INPUT, trans.KEY_DESCENDING], sortOn: 'datumbegin', order: -1},
      { id: 'budgetA', label: [trans.KEY_BUDGET, trans.KEY_ASCENDING], sortOn: 'budget', order: 1},
      { id: 'budgetD', label: [trans.KEY_BUDGET, trans.KEY_DESCENDING], sortOn: 'budget', order: -1},
      { id: 'restBudgetA', label: [trans.KEY_RESTBUDGET, trans.KEY_ASCENDING], sortOn: 'restbudget', order: 1},
      { id: 'restBudgetD', label: [trans.KEY_RESTBUDGET, trans.KEY_DESCENDING], sortOn: 'restbudget', order: -1},
      { id: 'changeA', label: [trans.KEY_CHANGE, trans.KEY_ASCENDING], sortOn: 'wijziging', order: 1},
      { id: 'changeD', label: [trans.KEY_CHANGE, trans.KEY_DESCENDING], sortOn: 'wijziging', order: -1},
      { id: 'level4A', label: [trans.KEY_ORGANISATION, trans.KEY_ASCENDING], sortOn: 'niveau4', order: 1},
      { id: 'level4D', label: [trans.KEY_ORGANISATION, trans.KEY_DESCENDING], sortOn: 'niveau4', order: -1},
      { id: 'nameA', label: [trans.KEY_NAME, trans.KEY_ASCENDING], sortOn: 'code', order: 1},
      { id: 'nameD', label: [trans.KEY_NAME, trans.KEY_DESCENDING], sortOn: 'code', order: -1},
      { id: 'nrA', label: [trans.KEY_NR, trans.KEY_ASCENDING], sortOn: 'nr', order: 1},
      { id: 'nrD', label: [trans.KEY_NR, trans.KEY_DESCENDING], sortOn: 'nr', order: -1},
      { id: 'salesStatusA', label: [trans.KEY_SALESSTATUS, trans.KEY_ASCENDING], sortOn: 'salesstatus', order: 1},
      { id: 'salesStatusD', label: [trans.KEY_SALESSTATUS, trans.KEY_DESCENDING], sortOn: 'salesstatus', order: -1},
      { id: 'startDateA', label: [trans.KEY_STARTDATE, trans.KEY_ASCENDING], sortOn: 'start', order: 1},
      { id: 'startDateD', label: [trans.KEY_STARTDATE, trans.KEY_DESCENDING], sortOn: 'start', order: -1},
    ]
  },
  title: trans.KEY_PROJECT,
  url: 'api.project.project'
};

export default { ...baseConfig, ...listViewConfig };
