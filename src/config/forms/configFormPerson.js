import * as icons from '../../libs/constIcons';
import * as input from '../../libs/constInputs';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configFormBase';

const formConfig = {
  id: 'person',
  defaultFocus: input.INPUT_FIRST_NAME,
  title: trans.KEY_PERSON,
  titleIcon: icons.ICON_USER,
  size: 'ModalExtraLarge',
  url: 'api.relatiebeheer.niveau9',
  inputs: {

    [input.INPUT_GENDER]: {
      label: trans.KEY_GENDER,
      elementType: 'radio',
      options: [
        { displayValue: trans.KEY_UNKNOWN, value: '0' },
        { displayValue: trans.KEY_MALE, value: '1' },
        { displayValue: trans.KEY_FEMALE, value: '2' }
      ],
      value: '1'
    },

    [input.INPUT_FIRST_NAME]: {
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

    [input.INPUT_INITIALS]: {
      label: trans.KEY_INITIALS,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_INITIALS,
      value: ''
    },

    [input.INPUT_INSERTIONS]: {
      label: trans.KEY_INSERTIONS,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_INSERTIONS,
      value: ''
    },

    [input.INPUT_LAST_NAME]: {
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
    },

    [input.INPUT_COMMUNICATION_INFO]: {
      elementType: 'componentCommunicationInfo'
    },

    [input.INPUT_PRIVATE_ADDRESS_STREET]: {
      label: trans.KEY_ADDRESS_STREET,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: '',
      ids: [] // When data is retrieved, the object key id is stored here, so we have a handle to the id once we save data.
    },
    [input.INPUT_PRIVATE_ADDRESS_NO]: {
      label: trans.KEY_ADDRESS_NO,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: '',
      ids: []
    },
    [input.INPUT_PRIVATE_ADDRESS_COUNTRY]: {
      label: trans.KEY_COUNTRY,
      elementType: 'select',
      elementConfig: {
        options: []
      },
      optionsSource: {
        url: 'api.relatiebeheer.getCountries',
        displayValue: 'naam',
        value: 'id'
      },
      value: '1347063',
      ids: []
    },

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
                  { id: input.INPUT_FIRST_NAME, width: 'Flex70' },
                  { id: input.INPUT_INITIALS, width: 'Flex30' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_GENDER, width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_PRIVATE_ADDRESS_STREET, width: 'Flex80' },
                  { id: input.INPUT_PRIVATE_ADDRESS_NO, width: 'Flex20' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_PRIVATE_ADDRESS_COUNTRY, width: 'Flex100' }
                ]
              }
            ]
          },
          {
            width: 'Flex50',
            columnClasses: ['ColEmphasize'],
            rows: [
              {
                inputs: [
                  { id: input.INPUT_FIRST_NAME, width: 'Flex25' },
                  { id: input.INPUT_INITIALS, width: 'Flex25' },
                  { id: input.INPUT_INSERTIONS, width: 'Flex25' },
                  { id: input.INPUT_LAST_NAME, width: 'Flex25' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_FIRST_NAME, width: 'Flex25' },
                  { id: input.INPUT_INITIALS, width: 'Flex25' },
                  { id: input.INPUT_INSERTIONS, width: 'Flex25' },
                  { id: input.INPUT_LAST_NAME, width: 'Flex25' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_COMMUNICATION_INFO, width: 'Flex100' }
                ]
              }
            ]
          },
          {
            width: 'Flex20',
            rows: [
              {
                inputs: [
                  { id: input.INPUT_FIRST_NAME, width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_INITIALS, width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_INSERTIONS, width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_LAST_NAME, width: 'Flex100' }
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
                  { id: input.INPUT_FIRST_NAME, width: 'Flex40' },
                  { id: input.INPUT_INITIALS, width: 'Flex10' },
                  { id: input.INPUT_INSERTIONS, width: 'Flex10' },
                  { id: input.INPUT_LAST_NAME, width: 'Flex40' }
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
            tabs: [
              {
                label: 'tab1',
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_FIRST_NAME, width: 'Flex50' },
                              { id: input.INPUT_INITIALS, width: 'Flex50' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: 'tab2',
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_INSERTIONS, width: 'Flex50' },
                              { id: input.INPUT_LAST_NAME, width: 'Flex50' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: 'Frank',
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_FIRST_NAME, width: 'Flex70' },
                              { id: input.INPUT_INITIALS, width: 'Flex30' }
                            ]
                          },
                          {
                            inputs: [
                              { id: input.INPUT_INSERTIONS, width: 'Flex50' },
                              { id: input.INPUT_LAST_NAME, width: 'Flex50' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

export default { ...baseConfig, ...formConfig };
