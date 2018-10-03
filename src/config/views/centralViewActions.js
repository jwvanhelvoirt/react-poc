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
  multiDoc: false,
  label: trans.KEY_PROPERTIES,
  labelIcon: icons.ICON_EDIT,
  showOnRowHover: true,
  tooltip: trans.KEY_PROPERTIES,
  zeroDoc: false,
  callback: (_this) => { _this.editItem() }
};

const ACTION_DELETE = {
  ...baseConfigActions,
  id: 'delete',
  multiDoc: false,
  label: trans.KEY_DELETE,
  labelIcon: icons.ICON_TRASH_ALT,
  showOnRowHover: true,
  tooltip: trans.KEY_DELETE,
  zeroDoc: false,
  callback: (_this) => { _this.deleteItems(true) }
};

const ACTION_REFRESH = {
  ...baseConfigActions,
  id: 'refresh',
  label: trans.KEY_REFRESH,
  labelIcon: icons.ICON_SYNC_ALT,
  showInRowMenu: false,
  tooltip: trans.KEY_REFRESH,
  callback: (_this) => _this.reloadListView(0, null, true)
};

const ACTION_TEST_SUBS = {
  ...baseConfigActions,
  id: 'test',
  label: 'Test subitems',
  labelIcon: icons.ICON_SIGN_IN_ALT,
  tooltip: 'Test subitems'
};

ACTION_ADD['order'] = 10;
ACTION_EDIT['order'] = 20;
ACTION_DELETE['order'] = 30;
ACTION_REFRESH['order'] = 40;
ACTION_TEST_SUBS['order'] = 50;

export {ACTION_ADD, ACTION_EDIT, ACTION_DELETE, ACTION_REFRESH, ACTION_TEST_SUBS};
