import React from 'react';
import TabContentOrganisation from '../../components/content/tabContent/organisation';
import TabContentPerson from '../../components/content/tabContent/person';

export const screenConfig = {
  panes: [
    {
      id: 'panes1',
      displaySmall: true,
      displayMedium: true,
      // displayLarge: true, // added
      toggle: true,
      show: true,
      blocks: [
        {
          id: 'pane1',
          tabs: [
            { id: 'organisation', label: 'keyOrganisation', component: <TabContentOrganisation /> },
            { id: 'person',       label: 'keyPerson',       component: <TabContentPerson /> },
            { id: 'project',      label: 'keyProject',      component: <div>Project</div> },
            { id: 'task',         label: 'keyTask',         component: <div>Taak</div> }
          ],
          activeTab: 'organisation'
        }
      ]
    },
    {
      id: 'panes2',
      displayLarge: true, // was true
      show: true,
      toggle: true,
      blocks: [
        {
          id: 'pane2',
          tabs: [
            { id: 'organisation', label: 'keyOrganisation', component: <TabContentOrganisation /> }
          ],
          activeTab: 'organisation'
        }
      ]
    },
    {
      id: 'panes3',
      displayLarge: true, // was true
      show: true,
      toggle: true,
      blocks: [
        {
          id: 'pane3',
          tabs: [
            { id: 'person',  label: 'keyPerson',  component: <TabContentPerson /> },
            { id: 'project', label: 'keyProject', component: <div>Project</div> },
            { id: 'task',    label: 'keyTask',    component: <div>Taak</div> }
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
            { id: 'correspondence', label: 'keyCorrespondence', component: <div>Correspondentie</div> },
            { id: 'email',          label: 'keyEmail',          component: <div>Email</div> },
            { id: 'booking',        label: 'keyBooking',        component: <div>Boeking</div> },
            { id: 'organigram',     label: 'keyOrganigram',     component: <div>Organigram</div> }
          ],
          activeTab: 'correspondence'
        }
      ]
    }
  ]
};
