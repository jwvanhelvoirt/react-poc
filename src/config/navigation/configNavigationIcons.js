// Configuration file for icons in the menu bar where a user can navigate to.
// ATTENTION: If you add an icon to this configuration, don't forget to add a route for it in app.js.

import * as trans from '../../libs/translates';

export const isAuthNavIcons = {
  admin: true
};

export const navIcons = [
  { icon: 'user',         label: trans.KEY_PERSONAL_SETTINGS,   url: '/personal' },
  { icon: 'power-off',    label: trans.KEY_LOGOUT,              url: '/logout' },
  isAuthNavIcons.admin ?    { icon: 'cog',    label: trans.KEY_SETTINGS,           url: '/admin' } : {}
];
