import React from 'react';

export const screenConfig = {
  panes: [
    {
      id: 'panes1',
      displayLarge: true,
      displayMedium: true,
      displaySmall: true,
      show: true,
      blocks: [
        {
          id: 'pane1',
          tabs: [
            { id: 'invoice',  label: 'keyInvoices',  component: <div>Factureren</div> },
            { id: 'concept',  label: 'KeyConcept',   component: <div>Concept</div> },
            { id: 'process',  label: 'keyProcess',   component: <div>Verwerken</div> },
            { id: 'invoices', label: 'keyInvoice',   component: <div>Facturen</div> }
          ],
          activeTab: 'invoice'
        }
      ]
    },
    {
      id: 'panes2',
      displayLarge: true,
      displayMedium: true,
      displaySmall: true,
      show: true,
      toggle: true,
      blocks: [
        {
          id: 'pane2',
          tabs: [
            { id: 'correspondence', label: 'keyCorrespondence', component: <div>Correspondentie</div> },
            { id: 'project',        label: 'keyProject',        component: <div>Project</div> }
          ],
          activeTab: 'correspondence'
        }
      ]
    }
  ]
};
