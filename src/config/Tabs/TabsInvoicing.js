import React from 'react';
// import TabContentOrganisation from '../../components/Content/TabContent/Organisation/Organisation';

export const tabsConfig = [
  {
    displayLarge: true,
    displayMedium: true,
    displaySmall: true,
    blocks: [
      {
        id: 'pane1',
        tabs: [
          { id: 'invoice',  label: 'Factureren',  component: <div>Factureren</div> },
          { id: 'concept',  label: 'Concept',     component: <div>Concept</div> },
          { id: 'process',  label: 'Verwerken',   component: <div>Verwerken</div> },
          { id: 'invoices', label: 'Facturen',    component: <div>Facturen</div> }
        ],
        activeTab: 'invoice'
      }
    ]
  },
  {
    displayLarge: true,
    displayMedium: true,
    displaySmall: true,
    blocks: [
      {
        id: 'pane2',
        tabs: [
          { id: 'correspondence', label: 'Correspondentie', component: <div>Correspondentie</div> },
          { id: 'project',        label: 'Project',         component: <div>Project</div> }
        ],
        activeTab: 'correspondence'
      }
    ]
  }
];
