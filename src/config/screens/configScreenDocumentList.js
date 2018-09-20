import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewDocumentList';
import * as trans from '../../libs/translates';

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
            { id: 'documentList', label: trans.KEY_DOCUMENT, component: <View viewConfig={viewConfig} /> }
          ],
          activeTab: 'documentList'
        }
      ]
    }
  ]
};
