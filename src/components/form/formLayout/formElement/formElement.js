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
import ElemCheckbox from './elemCheckbox/elemCheckbox';
import ElemComInfo from './elemComInfo/elemComInfo';
import ElemFormLink from './elemFormLink/elemFormLink';
import ElemInput from './elemInput/elemInput';
import ElemMultiAppend from './elemMultiAppend/elemMultiAppend';
import ElemRadio from './elemRadio/elemRadio';
import ElemSelect from './elemSelect/elemSelect';
import ElemSingleCheckbox from './elemSingleCheckbox/elemSingleCheckbox';
import ElemTextarea from './elemTextarea/elemTextarea';
import Aux from '../../../../hoc/auxiliary';
import classes from './formElement.scss';

class Input extends Component {

  render = () => {
    const { inputId, configInput, changed, keyUp, translates, configForm, removeMultiValueItem, showModal, defaultFocus } = this.props;
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

      case ('input'):
        break;

      case ('radio'):
        inputElement = <ElemRadio configInput={configInput} inputId={inputId} changed={changed} />;
        break;

      case ('checkbox'):
        inputElement = <ElemCheckbox configInput={configInput} inputId={inputId} changed={changed} />;
        break;

      case ('textarea'):
        inputElement = (
          <ElemTextarea configInput={configInput} inputClasses={inputClasses} placeholderInput={placeholderInput}
            autoFocus={autoFocus} changed={(event) => changed(event, inputId)} keyUp={keyUp}
          />
        );
        break;

      case ('select'):
        inputElement = (
          <ElemSelect configInput={configInput} inputClasses={inputClasses} autoFocus={autoFocus}
            changed={(event) => changed(event, inputId)} keyUp={keyUp} translates={translates}
          />
        );
        break;

      case ('formLink'):
        inputElement = <ElemFormLink configInput={configInput} />;
        break;

      case ('singleCheckbox'):
        inputElement = <ElemSingleCheckbox configInput={configInput} configForm={configForm}
          changed={(event) => changed(event, inputId)} keyUp={keyUp} />;
        break;

      case ('componentComInfo'):
        inputElement = <ElemComInfo />
        break;

      case ('multiAppend'):
        inputElement = (
          <ElemMultiAppend configInput={configInput} removeMultiValueItem={removeMultiValueItem}
            inputId={inputId} showModal={showModal} />
        );
        break;

      default:
    }

    // Not all input types require a label.
    // TODO: Als we straks het design van Frank gaan implementeren, kan het zijn dat het label naar de elem component gaat.
    const labelPrint = (elementType !== 'formLink' && elementType !== 'singleCheckbox') ?
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
