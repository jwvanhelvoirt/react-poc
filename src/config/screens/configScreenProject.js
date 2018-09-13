import React from 'react';
import TabContent from '../../components/content/tabContent/project';

export const screenConfig = {
  showTabs: false,
  route: 'list', // This screen will contain one list, a click on a listrow, appends /list/row_id to the URL.
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
            { id: 'project', label: 'keyProject', component: <TabContent /> }
          ],
          activeTab: 'project'
        }
      ]
    }
  ]
};
