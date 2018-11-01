// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

import * as icons from '../../libs/constIcons';
import * as routes from '../../libs/constRoutes';
import * as trans from '../../libs/constTranslates';

export const isAuthNavItems = {
  document: true,
  task: true,
  person: true,
  admin: true,
  acquisition: true,
  certification: true,
  recruitment: true,
  support: true,
  registration: true
};

export const navItems = [
                                  { icon: icons.ICON_HOME,              label: trans.KEY_DASHBOARD,     url: routes.ROUTE_DASHBOARD,     dashboard: false },
  isAuthNavItems.document      ?  { icon: icons.ICON_FILE_ALT,          label: trans.KEY_DOCUMENT,      url: routes.ROUTE_DOCUMENT,      dashboard: true } : {},
  isAuthNavItems.task          ?  { icon: icons.ICON_TASKS,             label: trans.KEY_TASK,          url: routes.ROUTE_TASK,          dashboard: true } : {},
  isAuthNavItems.person        ?  { icon: icons.ICON_USER,              label: trans.KEY_PERSON,        url: routes.ROUTE_PERSON,        dashboard: true } : {},
  isAuthNavItems.acquisition   ?  { icon: icons.ICON_HANDSHAKE_ALT,     label: trans.KEY_ACQUISITION,   url: routes.ROUTE_ACQUISITION,   dashboard: true } : {},
  isAuthNavItems.certification ?  { icon: icons.ICON_FILE_CERTIFICATE,  label: trans.KEY_CERTIFICATION, url: routes.ROUTE_CERTIFICATION, dashboard: true } : {},
  isAuthNavItems.recruitment   ?  { icon: icons.ICON_USERS,             label: trans.KEY_RECRUITMENT,   url: routes.ROUTE_RECRUITMENT,   dashboard: true } : {},
  isAuthNavItems.support       ?  { icon: icons.ICON_HEADPHONES,        label: trans.KEY_SUPPORT,       url: routes.ROUTE_SUPPORT,       dashboard: true } : {},
  isAuthNavItems.registration  ?  { icon: icons.ICON_PENCIL_ALT,        label: trans.KEY_REGISTRATION,  url: routes.ROUTE_REGISTRATION,  dashboard: true } : {},
  isAuthNavItems.admin         ?  { icon: icons.ICON_COG,               label: trans.KEY_SETTINGS,      url: routes.ROUTE_ADMIN,         dashboard: true } : {}
];
