import React from 'react';
import View from '../../components/parsers/viewParser/viewParser';
import viewConfig from '../../config/views/configListViewDocumentList';
import * as trans from '../../libs/constTranslates';

export const screenConfig = {
  showTabs: false,
  searchIdIn: 'api.project.project.get',
  searchIdFor: 'code',
  breadcrumb: trans.KEY_LIST,
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
          { id: 'documentList', label: trans.KEY_DOCUMENT, component: <View viewConfig={viewConfig} /> }
        ],
        activeTab: 'documentList'
      }
    }
  ]
};
