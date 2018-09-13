// Configuration file for icons in the menu bar where a user can navigate to.
// ATTENTION: If you add an icon to this configuration, don't forget to add a route for it in app.js.

export const isAuthNavIcons = {
  admin: true
};

export const navIcons = [
  { icon: 'user',         label: 'keyPersonalSettings',   url: '/personal' },
  { icon: 'power-off',    label: 'keyLogout',             url: '/logout' },
  isAuthNavIcons.admin ?    { icon: 'cog',    label: 'keySettings',           url: '/admin' } : {}
];