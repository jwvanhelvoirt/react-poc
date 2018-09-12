// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

export const isAuthNavItems = {
  invoicing: false,
  planning: false,
  bookings: false,
  crm: false,
  gdpr: false,
  acquisition: false,
  recruitment: false,
  inspection: false,
  reports: false,
  // project: false,
  document: true,
  person: true
};

export const navItems = [
                                { icon: 'home',             label: 'keyDashboard',    url: '/dashboard',    dashboard: false },
  isAuthNavItems.invoicing    ? { icon: 'euro-sign',        label: 'keyInvoicing',    url: '/invoicing',    dashboard: true } : {},
  isAuthNavItems.planning     ? { icon: 'calendar-alt',     label: 'keyPlanning',     url: '/planning',     dashboard: true } : {},
  isAuthNavItems.bookings     ? { icon: 'clock',            label: 'keyBookings',     url: '/bookings',     dashboard: true } : {},
  isAuthNavItems.crm          ? { icon: 'address-card',     label: 'keyCrm',          url: '/crm',          dashboard: true } : {},
  isAuthNavItems.gdpr         ? { icon: 'user-shield',      label: 'keyGdpr',         url: '/gdpr',         dashboard: true } : {},
  isAuthNavItems.acquisition  ? { icon: 'shopping-cart',    label: 'keyAcquisition',  url: '/acquisition',  dashboard: true } : {},
  isAuthNavItems.recruitment  ? { icon: 'users',            label: 'keyRecruitment',  url: '/recruitment',  dashboard: true } : {},
  isAuthNavItems.inspection   ? { icon: 'check-circle',     label: 'keyInspection',   url: '/inspection',   dashboard: true } : {},
                                { icon: 'question',         label: 'keyHelp',         url: '/help',         dashboard: true },
                                { icon: 'newspaper',        label: 'keyRelease',      url: '/release',      dashboard: true },
  isAuthNavItems.reports      ? { icon: 'file-alt',         label: 'keyReports',      url: '/reports',      dashboard: true } : {},
  // isAuthNavItems.project      ? { icon: 'project-diagram',  label: 'keyProject',      url: '/project',      dashboard: true } : {},
  isAuthNavItems.document     ? { icon: 'project-diagram',  label: 'keyDocument',     url: '/project',      dashboard: true } : {},
  isAuthNavItems.person       ? { icon: 'project-diagram',  label: 'keyPerson',       url: '/person',       dashboard: true } : {}
];
