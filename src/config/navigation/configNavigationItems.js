// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

export const isAuthNavItems = {
  document: true,
  task: true,
  person: true
};

export const navItems = [
                                { icon: 'home',             label: 'keyDashboard',    url: '/dashboard',    dashboard: false },
  isAuthNavItems.document     ? { icon: 'file-alt',         label: 'keyDocument',     url: '/document',     dashboard: true } : {},
  isAuthNavItems.task         ? { icon: 'tasks',            label: 'keyTask',         url: '/task',         dashboard: true } : {},
  isAuthNavItems.person       ? { icon: 'user',             label: 'keyPerson',       url: '/person',       dashboard: true } : {}
];
