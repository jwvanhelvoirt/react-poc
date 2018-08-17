import React from 'react';
import TabContentOrganisation from '../../components/Content/TabContent/Organisation/Organisation';
import TabContentPerson from '../../components/Content/TabContent/Person/Person';

export const tabsConfigLeft = [
  { id: 'organisation', label: 'Organisatie', component: <TabContentOrganisation /> },
  { id: 'person', label: 'Persoon', component: <TabContentPerson /> },
  { id: 'project', label: 'Project', component: <div>Project</div> },
  { id: 'task', label: 'Taak', component: <div>Taak</div> }
];

export const tabsConfigRight = [
  { id: 'correspondence', label: 'Correspondentie', component: <div>Correspondentie</div> },
  { id: 'email', label: 'Email', component: <div>Email</div> },
  { id: 'organigram', label: 'Organigram', component: <div>Organigram</div> }
];
