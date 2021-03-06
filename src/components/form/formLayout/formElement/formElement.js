/**
* @brief   Returns an input element for a form..
* @params  changed          Callback to trigger on the change event of the input.
* @params  defaultFocus     Boolean indicating the input should get default focus, so the user can start typing.
* @params  elementConfig    Object containing properties and/or option values for selects.
* @params  elementType      String containing the input HTML element (i.e. text, textarea, select etc..).
* @params  invalid          Boolean indicating if the current value meets all validation roles.
* @params  shouldValidate   Boolean indicating if the element has validation rules configured.
* @params  touched          Boolean indicating if the input has been touched by the user.
* @params  value            String containing the input's current value.
*/

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Label from '../../../ui/label/label';
import { getDisplayValue } from '../../../../libs/generic';
import * as trans from '../../../../libs/constTranslates';

// Generic elements.
import ElemCheckbox from './elemCheckbox/elemCheckbox';
import ElemDatePicker from './elemDatePicker/elemDatePicker';
import ElemDisplay from './elemDisplay/elemDisplay';
import ElemFileUpload from './elemFileUpload/elemFileUpload';
import ElemFormLink from './elemFormLink/elemFormLink';
import ElemInput from './elemInput/elemInput';
import ElemMultiAppend from './elemMultiAppend/elemMultiAppend';
import ElemRadio from './elemRadio/elemRadio';
import ElemSelect from './elemSelect/elemSelect';
import ElemSingleCheckbox from './elemSingleCheckbox/elemSingleCheckbox';
import ElemSinglePicture from './elemSinglePicture/elemSinglePicture';
import ElemTextarea from './elemTextarea/elemTextarea';
import ElemTicketUpdates from './elemTicketUpdates/elemTicketUpdates';
import ElemTinyMce from './elemTinyMce/elemTinyMce';

// Custom elements.
import ElemCommunicationInfo from './elemCommunicationInfo/elemCommunicationInfo';
import ElemContactInfo from './elemContactInfo/elemContactInfo';
import ElemOrganizationInfo from './elemOrganizationInfo/elemOrganizationInfo';

import Aux from '../../../../hoc/auxiliary';
import classes from './formElement.scss';

class Input extends Component {

  render = () => {
    // console.log(this.props);
    const { inputId, configInput, changed, keyUp, translates, configForm, removeMultiValueItem, showModal, defaultFocus,
      data, dataOriginal } = this.props;
    const { elementType, valid, validation, touched, label, /*defaultFocus,*/ placeholder } = configInput;
    const placeholderInput = placeholder ? getDisplayValue(placeholder, 'propercase', true, translates): null;

    let inputClasses = [classes.InputElement];
    if (!valid && validation) {
      inputClasses.push(classes.Invalid);
    }

    // Default focus.
    const autoFocus = inputId === defaultFocus ? true : false;

    // Default element is a text input.
    let inputElement = (
      <ElemInput configInput={configInput} inputClasses={inputClasses} placeholderInput={placeholderInput}
        autoFocus={autoFocus} changed={(event) => changed(event, inputId)} keyUp={keyUp}
        />
    );

    // Check for the applicable element type for this form element.
    switch (elementType) {

      // *********** Start generic elements ************
      case ('checkbox'):
      inputElement = <ElemCheckbox configInput={configInput} inputId={inputId} changed={changed} />;
      break;

      case ('datePicker'):
      inputElement = <ElemDatePicker configInput={configInput} inputId={inputId} changed={changed} />;
      break;

      case ('display'):
      inputElement = <ElemDisplay configInput={configInput} inputClasses={inputClasses} />;
      break;

      case ('fileUpload'):
      inputElement = <ElemFileUpload configInput={configInput} inputId={inputId} changed={changed} inputClasses={inputClasses} data={data} />
      break;

      case ('formLink'):
      inputElement = <ElemFormLink configInput={configInput} />;
      break;

      case ('input'):
      break;

      case ('multiAppend'):
      inputElement = (
        <ElemMultiAppend configInput={configInput} removeMultiValueItem={removeMultiValueItem}
          inputId={inputId} showModal={showModal} />
      );
      break;

      case ('radio'):
      inputElement = <ElemRadio configInput={configInput} inputId={inputId} changed={changed} />;
      break;

      case ('select'):
      inputElement = (
        <ElemSelect configInput={configInput} inputClasses={inputClasses} autoFocus={autoFocus}
          changed={changed} keyUp={keyUp} inputId={inputId} translates={translates} dataOriginal={dataOriginal}
          />
      );
      break;

      case ('singleCheckbox'):
      inputElement = <ElemSingleCheckbox configInput={configInput} configForm={configForm}
        changed={(event) => changed(event, inputId)} keyUp={keyUp} />;
      break;

      case ('singlePicture'):
      inputElement = (
        <ElemSinglePicture configInput={configInput} changed={changed} inputId={inputId} configForm={configForm} />
      );
      break;

      case ('textarea'):
      inputElement = (
        <ElemTextarea configInput={configInput} inputClasses={inputClasses} placeholderInput={placeholderInput}
          autoFocus={autoFocus} changed={(event) => changed(event, inputId)} keyUp={keyUp}
          />
      );
      break;

      case ('ticketUpdates'):
      inputElement = (
        <ElemTicketUpdates data={data} />
      );
      break;

      case ('tinyMce'):
      inputElement = (
        <ElemTinyMce configInput={configInput} changed={changed} />
      );
      break;
      // *********** End generic elements ************

      // *********** Start custom elements ************
      case ('componentCommunicationInfo'):
      inputElement = (
        <ElemCommunicationInfo configInput={configInput} changed={changed} />
      );
      break;

      case ('componentContactInfo'):
      inputElement = (
        <ElemContactInfo configInput={configInput} changed={changed} />
      );
      break;

      case ('componentOrganizationInfo'):
      inputElement = (
        <ElemOrganizationInfo configInput={configInput} changed={changed} />
      );
      break;
      // *********** End custom elements ************

      default:
    }

    // Not all input types require a label.
    // TODO: Als we straks het design van Frank gaan implementeren, kan het zijn dat het label naar de elem component gaat.
    // TODO: Array van maken en checken of waarde in array zit.
    const labelPrint = (elementType !== 'formLink' && elementType !== 'singleCheckbox'
      && elementType !== 'componentCommunicationInfo' && elementType !== 'fileUpload') ?
    <label className={classes.Label}>
      <Label labelKey={label} convertType={'propercase'} />
    </label> :
    null;

    // Validation error.
    // TODO: Als we straks het design van Frank gaan implementeren, kan het zijn dat de validatie tekst naar de elem component gaat.
    let validationError = null;
    if (!valid && validation && touched) {
      validationError = <p className={classes.ValidationError}><Label labelKey={trans.KEY_VALID_VALUE} convertType={'propercase'} /></p>
    }

    return(
      <Aux>
        {labelPrint}
        {/*validationError*/}
        {inputElement}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { translates } = state.redMain;
  return { translates };
};

export default connect(mapStateToProps)(Input);
