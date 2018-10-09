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
import Label from '../../ui/label/label';
import { getDisplayValue } from '../../../libs/generic';
import * as trans from '../../../libs/constTranslates';
import { storeFormFocussedField } from '../../../store/actions';
import ElemFormLink from './elemFormLink/elemFormLink';
import ElemInput from './elemInput/elemInput';
import ElemMultiAppend from './elemMultiAppend/elemMultiAppend';
import ElemSelect from './elemSelect/elemSelect';
import ElemSingleCheckbox from './elemSingleCheckbox/elemSingleCheckbox';
import ElemTextarea from './elemTextarea/elemTextarea';
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
    if (autoFocus) {
      // This input has cursor focus, update the store.
      this.props.storeFormFocussedField(configForm.id, inputId);
    }

    // Default element is a text input.
    let inputElement = (
      <ElemInput configInput={configInput} inputClasses={inputClasses} placeholderInput={placeholderInput}
        autoFocus={autoFocus} changed={changed} keyUp={keyUp}
        onClick={() => onInputClickHandler(this.props, configForm.id, inputId)}
      />
    );

    // Check for the applicable element type for this form element.
    switch (elementType) {

      case ('input'):
        break;

      case ('textarea'):
        inputElement = (
          <ElemTextarea configInput={configInput} inputClasses={inputClasses} placeholderInput={placeholderInput}
            autoFocus={autoFocus} changed={changed} keyUp={keyUp}
            onClick={() => onInputClickHandler(this.props, configForm.id, inputId)}
          />
        );
        break;

      case ('select'):
        inputElement = (
          <ElemSelect configInput={configInput} inputClasses={inputClasses} autoFocus={autoFocus}
            changed={changed} keyUp={keyUp} translates={translates}
            onClick={() => onInputClickHandler(this.props, configForm.id, inputId)}
          />
        );
        break;

      case ('formLink'):
        inputElement = <ElemFormLink configInput={configInput} />;
        break;

      case ('singleCheckbox'):
        inputElement = <ElemSingleCheckbox configInput={configInput} configForm={configForm}
          changed={changed} keyUp={keyUp} />;
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
      <div className={classes.Input}>
        {labelPrint}
        {validationError}
        {inputElement}
      </div>
    );
  };

}

const onInputClickHandler = (props, formId, inputId) => {
  // To update the store which field is cursor focussed) in case the user doesn't TAB to an input, but clicks on it.
  props.storeFormFocussedField(formId, inputId);
};

const mapStateToProps = state => {
  const { translates } = state.redMain;
  return { translates };
};

const mapDispatchToProps = dispatch => {
  return {
    storeFormFocussedField: (formId, fieldId) => dispatch(storeFormFocussedField(formId, fieldId))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Input);
