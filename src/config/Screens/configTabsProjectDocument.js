import React from 'react';
import TabContentProjectDocument from '../../components/content/tabContent/projectDocument';

export const tabsConfig = {
  showTabs: false,
  searchIdIn: 'organisations',
  searchIdFor: 'name',
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
          { id: 'projectDocument', label: 'keyDocument', component: <TabContentProjectDocument /> }
        ],
        activeTab: 'projectDocument'
      }
    }
  ]
};
