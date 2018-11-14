import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewSupport';
import * as trans from '../../libs/constTranslates';

export const screenConfig = {
  showTabs: false,
  route: '1', // This screen will contain one list, a click on a listrow, appends /1/:id to the URL.
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
          { id: 'support', label: trans.KEY_SUPPORT, component: <View viewConfig={viewConfig} /> }
        ],
        activeTab: 'support'
      }
    }
  ]
};
