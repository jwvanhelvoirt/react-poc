import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewPerson';

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
            { id: 'person', label: 'keyPerson', component: <View viewConfig={viewConfig} /> }
          ],
          activeTab: 'person'
        }
      ]
    }
  ]
};
