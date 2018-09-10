import React from 'react';
import TabContentProjectDocument from '../../components/content/tabContent/projectDocument';

export const tabsConfig = [
  {
    id: 'panes1',
    displaySmall: true,
    displayMedium: true,
    displayLarge: true,
    toggle: false,
    show: true,
    blocks: [
      {
        id: 'pane1',
        tabs: [
          { id: 'projectDocument', label: 'keyDocument', component: <TabContentProjectDocument /> }
        ],
        activeTab: 'projectDocument',
        showTabs: false
      }
    ]
  }
];
