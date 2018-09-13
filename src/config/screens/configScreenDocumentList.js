import React from 'react';
import TabContent from '../../components/content/tabContent/documentList';

export const screenConfig = {
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
      blocks: [
        {
          id: 'pane1',
          tabs: [
            { id: 'documentList', label: 'keyDocument', component: <TabContent /> }
          ],
          activeTab: 'documentList'
        }
      ]
    }
  ]
};
