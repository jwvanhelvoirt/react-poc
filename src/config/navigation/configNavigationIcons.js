// Configuration file for icons in the menu bar where a user can navigate to.
// ATTENTION: If you add an icon to this configuration, don't forget to add a route for it in app.js.

import * as icons from '../../libs/constIcons';
import * as routes from '../../libs/constRoutes';
import * as trans from '../../libs/constTranslates';

export const navIcons = [
  { icon: icons.ICON_USER,         label: trans.KEY_PERSONAL_SETTINGS,   url: routes.ROUTE_PERSONAL },
  { icon: icons.ICON_POWER_OFF,    label: trans.KEY_LOGOUT,              url: routes.ROUTE_LOGOUT }
];
