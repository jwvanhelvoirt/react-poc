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
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import * as types from '../../../store/Actions';
import Button from '../Button/Button';
import Aux from '../../../hoc/Auxiliary'
import classes from './Input.scss';

class Input extends Component {

  removeMultiValueItem = (fieldId, valueId) => {
    const clone = cloneDeep(this.props.configForm);

    const updatedForm = {
      ...clone.inputs
    }

    let updatedFormElement = {
      ...updatedForm[fieldId]
    }

    const updatedValue = updatedForm[fieldId].value.filter((item) => item._id !== valueId);
    updatedFormElement.value = updatedValue;

    // Check for validity.
    if (updatedFormElement.validation && updatedFormElement.value.length > 0) {
      updatedFormElement.valid = this.props.checkValidity(updatedFormElement.value, updatedFormElement.validation);
      if (!updatedFormElement.valid) {
        updatedFormElement.touched = true;
      }
    }

    updatedForm[fieldId] = updatedFormElement;


    // Is the entire form valid? (For enabling submit button yes or no).
    let isValidForm = true;
    for (let id in updatedForm) {
      if (updatedForm[id].validation) {
        isValidForm = this.props.checkValidity(updatedForm[id].value, updatedForm[id].validation) && isValidForm;
      }
    }
    this.props.setIsValidForm(isValidForm);

    clone.inputs = updatedForm;
    this.props.configForm.inputs = updatedForm;
    this.props.setActiveConfigForm(clone);
  }

  render() {
    let inputElement = null;
    let inputClasses = [classes.InputElement];
    let validationError = null;

    const { elementType, elementConfig, value, valid, validation, touched, label,
      defaultFocus, lookup, lookupFieldForDisplay, lookupTitle} = this.props.configInput;

    if (!valid && validation && touched) {
      inputClasses.push(classes.Invalid);
      validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>
    }

    // Default focus.
    const autoFocus = defaultFocus ? true : false;

    switch (elementType) {

      case ('input'):
        inputElement = <input
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          autoFocus={autoFocus}
          onChange={this.props.changed}/>;
        break;

      case ('textarea'):
        inputElement = <textarea
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          autoFocus={autoFocus}
          onChange={this.props.changed}/>;
        break;

      case ('select'):
        inputElement = (
          <select
            className={inputClasses.join(' ')}
            value={value}
            autoFocus={autoFocus}
            onChange={this.props.changed}>
            {elementConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayValue}
              </option>
            ))}
          </select>
        );
        break;

  //HIER BEN IK GEBLEVEN: VOLGENDE STAP IS OM DE LISTVIEW TE OPENEN IN EEN MESSAGEBOX
  //DENK DAT DE METHOD DAARVOOR VANUIT FORMPARSER.JS MOET KOMEN
      case ('multiAppend'):
        const multiLineItems = value.map((item, index) => {
          const valueId = item._id;
          // console.log(lookupFieldForDisplay);
          return (
            <div key={index} className={classes.Multiline}>
              <div onClick={() => this.removeMultiValueItem(this.props.inputId, valueId)}>
                <Button outline='true' color="danger" labelIcon="times" />
              </div>
              <div className={classes.DisplayValue}>{item.name}</div>
            </div>
          );
        });

        const multiLines =
          <div className={classes.MultilineWrapper}>
            {multiLineItems}
          </div>

        inputElement = (
          <Aux>
            <Button clicked={() => console.log('clicked a button')} color="primary" labelText="+ Organisatie" />
            {multiLines}
          </Aux>
        );
        break;



        // this.showModal('showModalSort', 'ModalWide', 'Sorteren', 'info',
        //   <View viewConfig={viewConfigSort} listItems={this.state.viewConfig.sortOptions} />, 'butOkCancel',
        //    () => this.processSelectedSortOption(), () => this.onModalSortCloseHandler());

        /**
         * @brief   Toont een modal voor specifiek foutafhandeling, info naar gebruiker..
         */
        // showModal = (modalState, modalClass, title, type, content, buttons,
        //   callBackOk = () => this.onModalMessageCloseHandler(),
        //   callBackCancel = () => this.onModalMessageCloseHandler()) => {
        //   this.localData.modalClass = modalClass;
        //   this.localData.messageTitle = title;
        //   this.localData.messageType = type;
        //   this.localData.messageContent = content;
        //   this.localData.messageButtons = buttons;
        //   this.localData.callBackCancel = callBackCancel;
        //   this.localData.callBackOk = callBackOk;
        //   this.setState({ [modalState]: true });
        // }






      default:
        inputElement = <input
          className={inputClasses.join(' ')}
          {...elementConfig}
          value={value}
          autoFocus={autoFocus}
          onChange={this.props.changed}/>;
    }

    return(
      <div className={classes.Input}>
        <label className={classes.Label}>{label}</label>
        {validationError}
        {inputElement}
      </div>
    );
  }

}

const mapDispatchToProps = dispatch => {
  return {
    setIsValidForm: (isValidForm) => dispatch( {type: types.IS_VALID_FORM, isValidForm } ),
    setActiveConfigForm: (configForm) => dispatch( {type: types.FORM_CONFIG_SET, configForm } )
  }
}

export default connect(null, mapDispatchToProps)(Input);
