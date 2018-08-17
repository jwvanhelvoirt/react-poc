// Configuration file for icons in the menu bar where a user can navigate to.
// ATTENTION: If you add an icon to this configuration, don't forget to add a route for it in app.js.

export const isAuthNavIcons = {
  reports: true,
  admin: true
};

export const navIcons = [
                            { icon: 'question',   label: 'Help',                      url: '/help' },
                            { icon: 'newspaper',  label: 'Release',                   url: '/release' },
  isAuthNavIcons.reports ?  { icon: 'file-alt',   label: 'Rapporten',                 url: '/reports' } : {},
                            { icon: 'user',       label: 'Persoonlijke instellingen', url: '/personal' },
  isAuthNavIcons.admin ?    { icon: 'cog',        label: 'Instellingen',              url: '/admin' } : {}
];
