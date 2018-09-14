import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewProject';

export const screenConfig = {
  showTabs: false,
  route: 'list', // This screen will contain one list, a click on a listrow, appends /list/:id to the URL.
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
            { id: 'project', label: 'keyProject', component: <View viewConfig={viewConfig} /> }
          ],
          activeTab: 'project'
        }
      ]
    }
  ]
};
