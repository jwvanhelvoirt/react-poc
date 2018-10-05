import * as icons from '../../libs/constIcons';
import * as trans from '../../libs/constTranslates';
import baseConfigActions from './centralViewActionsBase';

const ACTION_ADD = {
  ...baseConfigActions,
  labelIcon: icons.ICON_PLUS
};

const ACTION_EDIT = {
  ...baseConfigActions,
  id: 'edit',
  multiRow: false,
  label: trans.KEY_PROPERTIES,
  labelIcon: icons.ICON_EDIT,
  showOnRowHover: true,
  tooltip: trans.KEY_PROPERTIES,
  zeroRow: false,
  callback: (_this) => { _this.editItem() }
};

const ACTION_DELETE = {
  ...baseConfigActions,
  id: 'delete',
  multiRow: false,
  label: trans.KEY_DELETE,
  labelIcon: icons.ICON_TRASH_ALT,
  showOnRowHover: true,
  tooltip: trans.KEY_DELETE,
  zeroRow: false,
  callback: (_this) => { _this.deleteItems(true) }
};

const ACTION_REFRESH = {
  ...baseConfigActions,
  // actionClasses: ['ScreenSmallOnlyAction'], // for documentation purpose.
  id: 'refresh',
  label: trans.KEY_REFRESH,
  labelIcon: icons.ICON_SYNC_ALT,
  showInRowMenu: false,
  tooltip: trans.KEY_REFRESH,
  callback: (_this) => _this.reloadListView(0, null, true)
};

const ACTION_REPORT = {
  ...baseConfigActions,
  id: 'report',
  label: trans.KEY_REPORT,
  labelIcon: icons.ICON_REPORT,
  multiRow: false,
  tooltip: trans.KEY_REPORT,
  zeroRow: false
};

const ACTION_REPORT_CERTIFICATIONS = {
  ...baseConfigActions,
  id: 'report',
  label: trans.KEY_CERTIFICATIONS,
  labelIcon: icons.ICON_REPORT,
  multiRow: false,
  tooltip: trans.KEY_CERTIFICATIONS,
  zeroRow: false
};

const ACTION_REPORT_CORRESPONDENCE = {
  ...baseConfigActions,
  id: 'report',
  label: trans.KEY_CORRESPONDENCE,
  labelIcon: icons.ICON_REPORT,
  multiRow: false,
  tooltip: trans.KEY_CORRESPONDENCE,
  zeroRow: false
};

ACTION_ADD['order'] = 10;
ACTION_EDIT['order'] = 20;
ACTION_DELETE['order'] = 30;
ACTION_REFRESH['order'] = 40;
ACTION_REPORT['order'] = 50;
ACTION_REPORT_CERTIFICATIONS['order'] = 51;
ACTION_REPORT_CORRESPONDENCE['order'] = 52;

export {ACTION_ADD, ACTION_EDIT, ACTION_DELETE, ACTION_REFRESH, ACTION_REPORT, ACTION_REPORT_CERTIFICATIONS,
  ACTION_REPORT_CORRESPONDENCE
};
