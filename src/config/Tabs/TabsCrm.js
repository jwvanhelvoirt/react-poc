import React from 'react';
import TabContentOrganisation from '../../components/Content/TabContent/Organisation/Organisation';
import TabContentPerson from '../../components/Content/TabContent/Person/Person';

export const tabsConfig = [
  {
    displaySmall: true,
    displayMedium: true,
    blocks: [
      {
        id: 'pane1',
        tabs: [
          { id: 'organisation', label: 'Organisatie', component: <TabContentOrganisation /> },
          { id: 'person',       label: 'Persoon',     component: <TabContentPerson /> },
          { id: 'project',      label: 'Project',     component: <div>Project</div> },
          { id: 'task',         label: 'Taak',        component: <div>Taak</div> }
        ],
        activeTab: 'organisation'
      }
    ]
  },
  {
    displayLarge: true,
    blocks: [
      {
        id: 'pane2',
        tabs: [
          { id: 'organisation', label: 'Organisatie', component: <TabContentOrganisation /> }
        ],
        activeTab: 'organisation'
      }
    ]
  },
  {
    displayLarge: true,
    blocks: [
      {
        id: 'pane3',
        tabs: [
          { id: 'person',  label: 'Persoon',  component: <TabContentPerson /> },
          { id: 'project', label: 'Project',  component: <div>Project</div> },
          { id: 'task',    label: 'Taak',     component: <div>Taak</div> }
        ],
        activeTab: 'person'
      }
    ]
  },
  {
    displaySmall: true,
    displayMedium: true,
    displayLarge: true,
    blocks: [
      {
        id: 'pane4',
        tabs: [
          { id: 'correspondence', label: 'Correspondentie', component: <div>Correspondentie<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1<br/>1</div> },
          { id: 'email',          label: 'Email',           component: <div>Email</div> },
          { id: 'booking',        label: 'Boeking',         component: <div>Boeking</div> },
          { id: 'organigram',     label: 'Organigram',      component: <div>Organigram</div> }
        ],
        activeTab: 'correspondence'
      }
    ]
  }
];
