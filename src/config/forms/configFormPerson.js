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
  }
};

export default { ...baseConfig, ...formConfig };
