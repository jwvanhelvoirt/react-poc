import * as icons from '../../libs/constIcons';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configFormBase';

const formConfig = {
  id: 'person',
  defaultFocus: 'roepnaam',
  title: trans.KEY_PERSON,
  titleIcon: icons.ICON_USER,
  url: 'api.relatiebeheer.niveau9',
  inputs: {
    roepnaam: {
      label: trans.KEY_FIRST_NAME,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_FIRST_NAME,
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    initialen: {
      label: trans.KEY_INITIALS,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_INITIALS,
      value: ''
    },
    tussenvoeg: {
      label: trans.KEY_INSERTIONS,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_INSERTIONS,
      value: ''
    },
    naam: {
      label: trans.KEY_LAST_NAME,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_LAST_NAME,
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    }
  },

  layout: {

    rows: [
      {
        cols: [
          {
            width: 'Flex30',
            rows: [
              {
                inputs: [
                  { id: 'roepnaam', width: 'Flex70' },
                  { id: 'initialen', width: 'Flex30' }
                ]
              }
            ]
          },
          {
            width: 'Flex50',
            rows: [
              {
                inputs: [
                  { id: 'roepnaam', width: 'Flex25' },
                  { id: 'initialen', width: 'Flex25' },
                  { id: 'tussenvoeg', width: 'Flex25' },
                  { id: 'naam', width: 'Flex25' }
                ]
              },
              {
                inputs: [
                  { id: 'roepnaam', width: 'Flex25' },
                  { id: 'initialen', width: 'Flex25' },
                  { id: 'tussenvoeg', width: 'Flex25' },
                  { id: 'naam', width: 'Flex25' }
                ]
              }
            ]
          },
          {
            width: 'Flex20',
            rows: [
              {
                inputs: [
                  { id: 'roepnaam', width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: 'initialen', width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: 'tussenvoeg', width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: 'naam', width: 'Flex100' }
                ]
              }
            ]
          }
        ]
      },
      {
        cols: [
          {
            width: 'Flex100',
            rows: [
              {
                inputs: [
                  { id: 'roepnaam', width: 'Flex40' },
                  { id: 'initialen', width: 'Flex10' },
                  { id: 'tussenvoeg', width: 'Flex10' },
                  { id: 'naam', width: 'Flex40' }
                ]
              }
            ]
          }
        ]
      }
    ]




    //
    //
    // rows: [
    //   {
    //     // Twee kolommen voor naast elkaar roepnaam en initialen
    //     cols: [
    //       {
    //         width: 'Flex50',
    //         rows: [
    //           {
    //             inputs: [
    //               { id: 'roepnaam', width: 'Flex50' },
    //               { id: 'initialen', width: 'Flex50' }
    //             ]
    //           }
    //         ]
    //       },
    //       {
    //         width: 'Flex50',
    //         inputs: [
    //           { id: 'roepnaam', width: 'Flex100' },
    //           { id: 'initialen', width: 'Flex100' }
    //         ]
    //       }
    //     ]
    //   },
    //   {
    //     // Tab1 en Tab2 voor resp. tussenvoeg en naam
    //     cols: [
    //       {
    //         width: 'Flex100',
    //         tabs: [
    //           {
    //             label: 'tab1',
    //             rows: [
    //               {
    //                 cols: [
    //                   {
    //                     inputs: [
    //                       { id: 'roepnaam', width: 'Flex50' },
    //                       { id: 'initialen', width: 'Flex50' }
    //                     ]
    //                   }
    //                 ]
    //               }
    //             ]
    //           },
    //           {
    //             label: 'tab2',
    //             rows: [
    //               {
    //                 cols: [
    //                   {
    //                     inputs: [
    //                       { id: 'tussenvoeg', width: 'Flex50' },
    //                       { id: 'naam', width: 'Flex50' }
    //                     ]
    //                   }
    //                 ]
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
    //   }
    // ]

  }

};

export default { ...baseConfig, ...formConfig };
