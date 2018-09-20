// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

import * as icons from '../../libs/icons';
import * as trans from '../../libs/translates';

export const isAuthNavItems = {
  document: true,
  task: true,
  person: true
};

export const navItems = [
                              { icon: icons.ICON_HOME,      label: trans.KEY_DASHBOARD,  url: '/dashboard',    dashboard: false },
  isAuthNavItems.document   ? { icon: icons.ICON_FILE_ALT,  label: trans.KEY_DOCUMENT,   url: '/document',     dashboard: true } : {},
  isAuthNavItems.task       ? { icon: icons.ICON_TASKS,     label: trans.KEY_TASK,       url: '/task',         dashboard: true } : {},
  isAuthNavItems.person     ? { icon: icons.ICON_USER,      label: trans.KEY_PERSON,     url: '/person',       dashboard: true } : {}
];
