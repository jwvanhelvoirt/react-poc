// Configuration file for navigation items in the menu bar where a user can navigate to.
// ATTENTION: If you add a navigation item to this configuration, don't forget to add a route for it in app.js.

export const isAuthNavItems = {
  invoicing: true,
  planning: true,
  bookings: true,
  crm: true,
  gdpr: true,
  acquisition: true,
  recruitment: true,
  inspection: true
};

export const navItems = [
  isAuthNavItems.invoicing    ? { icon: 'euro-sign',      label: 'Facturering',         url: '/invoicing' } : {},
  isAuthNavItems.planning     ? { icon: 'calendar-alt',   label: 'Planning',            url: '/planning' } : {},
  isAuthNavItems.bookings     ? { icon: 'clock',          label: 'Urenregistratie',     url: '/bookings' } : {},
  isAuthNavItems.crm          ? { icon: 'address-card',   label: 'CRM',                 url: '/crm' } : {},
  isAuthNavItems.gdpr         ? { icon: 'user-shield',    label: 'AVG/GDPR',            url: '/gdpr' } : {},
  isAuthNavItems.acquisition  ? { icon: 'shopping-cart',  label: 'Acquisitie',          url: '/acquisition' } : {},
  isAuthNavItems.recruitment  ? { icon: 'users',          label: 'Werving en selectie', url: '/recruitment' } : {},
  isAuthNavItems.inspection   ? { icon: 'check-circle',   label: 'Inspectie',           url: '/inspection' } : {}
];
