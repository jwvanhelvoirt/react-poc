import * as icons from '../../libs/constIcons';
import * as input from '../../libs/constInputs';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configFormBase';

const formConfig = {
  id: 'person',
  defaultFocus: input.INPUT_FIRST_NAME,
  inputs: {

    [input.INPUT_FOTO]: {
      elementType: 'singlePicture',
      useIfEmpty: input.INPUT_FIRST_NAME
    },

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

    [input.INPUT_TITLE]: {
      label: trans.KEY_TITLE,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_TITLE,
      value: ''
    },

    [input.INPUT_TITLE_SUFFIX]: {
      label: trans.KEY_TITLE_SUFFIX,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_TITLE_SUFFIX,
      value: ''
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

    [input.INPUT_NOTE]: {
      elementType: 'textarea',
      elementConfig: {
        rows: '4'
      }
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
      label: trans.KEY_COMMUNICATION_INFO,
      elementType: 'componentCommunicationInfo',
      maxHeight: '200px',
      value: {}
    },

    [input.INPUT_ORGANIZATION_INFO]: {
      elementType: 'componentOrganizationInfo',
      maxHeight: '300px',
      value: {}
    },

    [input.INPUT_CONTACT_INFO]: {
      // label: trans.KEY_COMMUNICATION_INFO,
      elementType: 'componentContactInfo',
      maxHeight: '200px',
      value: {}
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
    [input.INPUT_PRIVATE_ADDRESS_ZIP]: {
      label: trans.KEY_ZIP,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: '',
      ids: []
    },
    [input.INPUT_PRIVATE_ADDRESS_CITY]: {
      label: trans.KEY_CITY,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: '',
      ids: []
    },
    [input.INPUT_PRIVATE_ADDRESS_STATE]: {
      label: trans.KEY_STATE,
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
      optionsSource: {
        url: 'api.relatiebeheer.getCountries',
        displayValue: 'naam',
        value: 'id',
        language: true
      },
      value: '1347063',
      ids: []
    },

    [input.INPUT_POST]: {
      label: trans.KEY_POST,
      elementType: 'radio',
      options: [
        { displayValue: trans.KEY_ADDRESS_WORK, value: '0' },
        { displayValue: trans.KEY_ADDRESS_PRIVATE, value: '1' }
      ],
      value: '0'
    },

    [input.INPUT_BIRTHDAY]: {
      label: trans.KEY_BIRTHDAY,
      // elementType: 'datePicker',
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },

    [input.INPUT_CANDIDATE]: {
      label: trans.KEY_CANDIDATE,
      elementType: 'select',
      elementConfig: {
        options: [
          { value: '0', displayValue: trans.KEY_NO_RECRUITMENT },
          { value: '1', displayValue: trans.KEY_RECRUITMENT },
          { value: '-1', displayValue: trans.KEY_BLACKLIST },
        ]
      },
      translateDisplayValues: true,
      convertDisplayValues: 'propercase',
      value: '0'
    },
    [input.INPUT_PASSED_AWAY]: {
      label: trans.KEY_PASSED_AWAY,
      // elementType: 'datePicker',
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },

    [input.INPUT_PARTNER]: {
      label: trans.KEY_PARTNER,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },
    [input.INPUT_TAX_NO]: {
      label: trans.KEY_TAX_NO,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },
    [input.INPUT_DEBTOR_NO]: {
      label: trans.KEY_DEBTOR_NO,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },
    [input.INPUT_ACCOUNT_NO]: {
      label: trans.KEY_ACCOUNT_NO,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },
    [input.INPUT_BIC]: {
      label: trans.KEY_BIC,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      value: ''
    },

  },
  layout: {
    rows: [
      {
        cols: [
          {
            width: 'Flex50',
            rows: [
              {
                cols: [
                  {
                    width: 'Flex15',
                    rows: [
                      {
                        inputs: [
                          { id: input.INPUT_FOTO, width: 'Flex100' }
                        ]
                      }
                    ]
                  },
                  {
                    width: 'Flex85',
                    rows: [
                      {
                        inputs: [
                          { id: input.INPUT_GENDER, width: 'Flex40' },
                          { id: input.INPUT_TITLE, width: 'Flex20' },
                          { id: input.INPUT_FIRST_NAME, width: 'Flex40' }
                        ]
                      },
                      {
                        inputs: [
                          { id: input.INPUT_INITIALS, width: 'Flex20' },
                          { id: input.INPUT_INSERTIONS, width: 'Flex20' },
                          { id: input.INPUT_LAST_NAME, width: 'Flex40' },
                          { id: input.INPUT_TITLE_SUFFIX, width: 'Flex20' }
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
                        label: trans.KEY_NOTE,
                        rows: [
                          {
                            cols: [
                              {
                                width: 'Flex100',
                                rows: [
                                  {
                                    inputs: [
                                      { id: input.INPUT_NOTE, width: 'Flex100' } //xxx
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        label: trans.KEY_CONTACT,
                        rows: [
                          {
                            cols: [
                              {
                                width: 'Flex100',
                                rows: [
                                  {
                                    inputs: [
                                      { id: input.INPUT_CONTACT_INFO, width: 'Flex100' }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      {
                        label: trans.KEY_ADDRESS_PRIVATE,
                        rows: [
                          {
                            cols: [
                              {
                                width: 'Flex100',
                                rows: [
                                  {
                                    inputs: [
                                      { id: input.INPUT_PRIVATE_ADDRESS_STREET, width: 'Flex100' },
                                      { id: input.INPUT_PRIVATE_ADDRESS_NO, width: 'Flex100' },
                                      { id: input.INPUT_PRIVATE_ADDRESS_ZIP, width: 'Flex100' }
                                    ]
                                  },
                                  {
                                    inputs: [
                                      { id: input.INPUT_PRIVATE_ADDRESS_CITY, width: 'Flex40' },
                                      { id: input.INPUT_PRIVATE_ADDRESS_COUNTRY, width: 'Flex30' },
                                      { id: input.INPUT_PRIVATE_ADDRESS_STATE, width: 'Flex30' }
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
          },
          {
            width: 'Flex50',
            rows: [
              {
                inputs: [
                  { id: input.INPUT_COMMUNICATION_INFO, width: 'Flex100' }
                ]
              },
              {
                inputs: [
                  { id: input.INPUT_POST, width: 'Flex35' },
                  { id: input.INPUT_BIRTHDAY, width: 'Flex20' },
                  { id: input.INPUT_CANDIDATE, width: 'Flex25' },
                  { id: input.INPUT_PASSED_AWAY, width: 'Flex20' },
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
                label: trans.KEY_ORGANISATIONS,
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_ORGANIZATION_INFO, width: 'Flex100' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: trans.KEY_EXTRA_DATA,
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_PARTNER, width: 'Flex30' },
                              { id: input.INPUT_TAX_NO, width: 'Flex15' },
                              { id: input.INPUT_DEBTOR_NO, width: 'Flex15' },
                              { id: input.INPUT_ACCOUNT_NO, width: 'Flex25' },
                              { id: input.INPUT_BIC, width: 'Flex15' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: trans.KEY_CATEGORIES,
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_STREET, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_NO, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_ZIP, width: 'Flex100' }
                            ]
                          },
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_CITY, width: 'Flex40' },
                              { id: input.INPUT_PRIVATE_ADDRESS_COUNTRY, width: 'Flex30' },
                              { id: input.INPUT_PRIVATE_ADDRESS_STATE, width: 'Flex30' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: trans.KEY_SELECTION_MARKS,
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_STREET, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_NO, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_ZIP, width: 'Flex100' }
                            ]
                          },
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_CITY, width: 'Flex40' },
                              { id: input.INPUT_PRIVATE_ADDRESS_COUNTRY, width: 'Flex30' },
                              { id: input.INPUT_PRIVATE_ADDRESS_STATE, width: 'Flex30' }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                label: trans.KEY_LINKEDIN,
                rows: [
                  {
                    cols: [
                      {
                        width: 'Flex100',
                        rows: [
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_STREET, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_NO, width: 'Flex100' },
                              { id: input.INPUT_PRIVATE_ADDRESS_ZIP, width: 'Flex100' }
                            ]
                          },
                          {
                            inputs: [
                              { id: input.INPUT_PRIVATE_ADDRESS_CITY, width: 'Flex40' },
                              { id: input.INPUT_PRIVATE_ADDRESS_COUNTRY, width: 'Flex30' },
                              { id: input.INPUT_PRIVATE_ADDRESS_STATE, width: 'Flex30' }
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
  },
  newEntryFromServer: false,
  size: 'ModalExtraLarge',
  title: trans.KEY_PERSON,
  titleIcon: icons.ICON_USER,
  url: 'call/api.relatiebeheer.niveau9'
};

export default { ...baseConfig, ...formConfig };
