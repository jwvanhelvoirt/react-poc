// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

import * as trans from '../../libs/translates';

export const isAuthNavItems = {
  document: true,
  task: true,
  person: true
};

export const navItems = [
                                { icon: 'home',             label: trans.KEY_DASHBOARD,  url: '/dashboard',    dashboard: false },
  isAuthNavItems.document     ? { icon: 'file-alt',         label: trans.KEY_DOCUMENT,   url: '/document',     dashboard: true } : {},
  isAuthNavItems.task         ? { icon: 'tasks',            label: trans.KEY_TASK,       url: '/task',         dashboard: true } : {},
  isAuthNavItems.person       ? { icon: 'user',             label: trans.KEY_PERSON,     url: '/person',       dashboard: true } : {}
];
