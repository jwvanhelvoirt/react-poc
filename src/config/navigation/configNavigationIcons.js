// Configuration file for icons in the menu bar where a user can navigate to.
// ATTENTION: If you add an icon to this configuration, don't forget to add a route for it in app.js.

import * as icons from '../../libs/constIcons';
import * as routes from '../../libs/constRoutes';
import * as trans from '../../libs/constTranslates';
// import * as actions from '../views/centralViewActions';

export const navIcons = [
  // { icon: icons.ICON_USER,         label: trans.KEY_PERSONAL_SETTINGS,   url: routes.ROUTE_PERSONAL_SETTINGS },
  // { icon: icons.ICON_POWER_OFF,    label: trans.KEY_LOGOUT,              url: routes.ROUTE_LOGOUT },
  {
    icon: 'userAvatar',
    label: trans.KEY_PERSONAL_SETTINGS,
    actionMenuHeader: 'naam',
    actions: [
      {
        id: 'personalSettings',
        label: trans.KEY_PERSONAL_SETTINGS,
        labelIcon: icons.ICON_USER,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_PERSONAL_SETTINGS,
        zeroRow: true
      },
      {
        id: 'externalConnections',
        label: trans.KEY_CONNECT_EXTERNAL_DEVICES,
        labelIcon: icons.ICON_QRCODE,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_CONNECT,
        zeroRow: true
      },
      {
        divider: true,
        id: 'gdpr',
        label: trans.KEY_AVG_GDPR,
        labelIcon: icons.ICON_LOCK_ALT,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_GDPR,
        zeroRow: true
      },
      {
        id: 'help',
        label: trans.KEY_HELP,
        labelIcon: icons.ICON_QUESTION,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_HELP,
        zeroRow: true
      },
      {
        divider: true,
        id: 'release',
        label: trans.KEY_RELEASE,
        labelIcon: icons.ICON_CODE_BRANCH,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_RELEASE,
        zeroRow: true
      },
      {
        id: 'logout',
        label: trans.KEY_LOGOUT_ALL,
        labelIcon: icons.ICON_SIGN_OUT_ALT,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_LOGOUT,
        zeroRow: true
      },
      {
        id: 'logout',
        label: trans.KEY_LOGOUT,
        labelIcon: icons.ICON_SIGN_OUT_ALT,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_LOGOUT,
        zeroRow: true
      },
      {
        id: 'logout',
        label: trans.KEY_LOGOUT_CLOSE,
        labelIcon: icons.ICON_POWER_OFF,
        multiRow: true,
        showInPersonalMenu: true,
        url: routes.ROUTE_LOGOUT,
        zeroRow: true
      }
    ]

  }
];
