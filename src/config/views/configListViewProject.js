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
      content: 'code',
      label: trans.KEY_NAME,
      sort: true,
      sortOn: 'code',
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      content: 'niveau4',
      label: trans.KEY_ORGANISATION,
      sort: true,
      sortOn: 'niveau4',
      displayOn: 'always',
      show: true,
      size: 'Flex40'
    },
    {
      content: 'start',
      label: trans.KEY_PERIOD,
      sort: true,
      sortOn: 'start',
      displayOn: 'always',
      show: true,
      contentType: 'timespan',
      data: { start: 'start', end: 'eind' },
      size: 'TimespanLarge'
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
  url: 'api.project.project.list'
};

export default { ...baseConfig, ...listViewConfig };
