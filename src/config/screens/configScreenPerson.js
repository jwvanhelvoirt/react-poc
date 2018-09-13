import React from 'react';
import TabContent from '../../components/content/tabContent/person';

export const screenConfig = {
  showTabs: false,
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
            { id: 'person', label: 'keyPerson', component: <TabContent /> }
          ],
          activeTab: 'person'
        }
      ]
    }
  ]
};
