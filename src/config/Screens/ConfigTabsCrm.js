import React from 'react';
import TabContentOrganisation from '../../components/Content/TabContent/Organisation';
import TabContentPerson from '../../components/Content/TabContent/Person';

export const tabsConfig = [
  {
    id: 'panes1',
    displaySmall: true,
    displayMedium: true,
    toggle: true,
    show: true,
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
    id: 'panes2',
    displayLarge: true,
    show: true,
    toggle: true,
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
    id: 'panes3',
    displayLarge: true,
    show: true,
    toggle: true,
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
    id: 'panes4',
    displaySmall: true,
    displayMedium: true,
    displayLarge: true,
    show: true,
    toggle: true,
    blocks: [
      {
        id: 'pane4',
        tabs: [
          { id: 'correspondence', label: 'Correspondentie', component: <div>Correspondentie</div> },
          { id: 'email',          label: 'Email',           component: <div>Email</div> },
          { id: 'booking',        label: 'Boeking',         component: <div>Boeking</div> },
          { id: 'organigram',     label: 'Organigram',      component: <div>Organigram</div> }
        ],
        activeTab: 'correspondence'
      }
    ]
  }
];
