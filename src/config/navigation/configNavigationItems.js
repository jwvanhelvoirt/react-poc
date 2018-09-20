// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

import * as icons from '../../libs/constIcons';
import * as routes from '../../libs/constRoutes';
import * as trans from '../../libs/constTranslates';

export const isAuthNavItems = {
  document: true,
  task: true,
  person: true
};

export const navItems = [
                            { icon: icons.ICON_HOME,      label: trans.KEY_DASHBOARD,  url: routes.ROUTE_DASHBOARD, dashboard: false },
  isAuthNavItems.document ? { icon: icons.ICON_FILE_ALT,  label: trans.KEY_DOCUMENT,   url: routes.ROUTE_DOCUMENT,  dashboard: true } : {},
  isAuthNavItems.task     ? { icon: icons.ICON_TASKS,     label: trans.KEY_TASK,       url: routes.ROUTE_TASK,      dashboard: true } : {},
  isAuthNavItems.person   ? { icon: icons.ICON_USER,      label: trans.KEY_PERSON,     url: routes.ROUTE_PERSON,    dashboard: true } : {}
];
