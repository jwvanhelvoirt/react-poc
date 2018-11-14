import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewSupportDetails';
import * as trans from '../../libs/constTranslates';

export const screenConfig = {
  showTabs: false,
  searchIdIn: 'api.support.history.list',
  searchIdFor: 'reftaak',
  breadcrumb: trans.KEY_DETAILS,
  panes: [
    {
      id: 'panes1',
      displaySmall: true,
      displayMedium: true,
      displayLarge: true,
      toggle: false,
      show: true,
      content: {
        id: 'pane1',
        tabs: [
          { id: 'supportDetails', label: trans.KEY_DETAILS, component: <View viewConfig={viewConfig} /> }
        ],
        activeTab: 'supportDetails'
      }
    }
  ]
};
