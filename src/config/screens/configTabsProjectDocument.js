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
      blocks: [
        {
          id: 'pane1',
          tabs: [
            { id: 'projectDocument', label: 'keyDocument', component: <TabContentProjectDocument /> }
          ],
          activeTab: 'projectDocument'
        }
      ]
    }
  ]
};

// import React from 'react';
// import TabContentProject from '../../components/content/tabContent/project';
//
// export const tabsConfig = {
//   showTabs: false,
//   route: 'document', // This screen will contain one list, a click on a listrow, appends /document/row_id to the URL.
//   panes: [
//     {
//       id: 'panes1',
//       displaySmall: true,
//       displayMedium: true,
//       displayLarge: true,
//       toggle: false,
//       show: true,
//       blocks: [
//         {
//           id: 'pane1',
//           tabs: [
//             { id: 'project', label: 'keyProject', component: <TabContentProject /> }
//           ],
//           activeTab: 'project'
//         }
//       ]
//     }
//   ]
// };
