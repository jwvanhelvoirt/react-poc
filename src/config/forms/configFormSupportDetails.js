import * as icons from '../../libs/constIcons';
import * as input from '../../libs/constInputs';
import * as trans from '../../libs/constTranslates';
import baseConfig from './configFormBase';

const formConfig = {
  id: 'supportDetails',
  defaultFocus: input.INPUT_TASK_PRIORITY,
  title: trans.KEY_SUPPORT_DETAILS,
  titleIcon: icons.ICON_HEADPHONES,
  // size: 'ModalExtraLarge',
  url: 'portal/call/api.support.history.list',
  inputs: {

    [input.INPUT_TASK_NO]: {
      label: trans.KEY_TASK_NO,
      elementType: 'display',
      value: '',
      save: false
    },

    [input.INPUT_TASK_NAME]: {
      label: trans.KEY_TASK,
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      placeholder: trans.KEY_TASK,
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },

    [input.INPUT_TASK_UPDATE_DESCRIPTION]: {
      elementType: 'tinyMce',
      value: ''
    },

    [input.INPUT_TASK_PRIORITY]: {
      label: trans.KEY_PRIORITY,
      elementType: 'select',
      optionsSource: {
        property: 'priority',
        displayValue: 'naam',
        value: 'id'
      },
      value: ''
    },

    [input.INPUT_TASK_STATUS]: {
      label: trans.KEY_STATUS,
      elementType: 'select',
      optionsSource: {
        property: 'status',
        displayValue: 'naam',
        value: 'id'
      },
      value: ''
    },

    [input.INPUT_TASK_PROJECT]: {
      label: trans.KEY_PROJECT,
      elementType: 'select',
      optionsSource: {
        property: 'niveau5',
        displayValue: 'naam',
        value: 'id'
      },
      value: ''
    },


  },

  layout: {
    rows: [
      {
        cols: [
          {
            width: 'Flex100',
            rows: [
              {
                inputs: [
                  { id: input.INPUT_TASK_NO, width: 'Flex20' },
                  { id: input.INPUT_TASK_NAME, width: 'Flex80' }
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
                  { id: input.INPUT_TASK_UPDATE_DESCRIPTION, width: 'Flex100' }
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
                  { id: input.INPUT_TASK_PRIORITY, width: 'Flex33' },
                  { id: input.INPUT_TASK_PROJECT, width: 'Flex33' },
                  { id: input.INPUT_TASK_STATUS, width: 'Flex34' }
                ]
              }
            ]
          }
        ]
      },
    ]
  }
};

export default { ...baseConfig, ...formConfig };
