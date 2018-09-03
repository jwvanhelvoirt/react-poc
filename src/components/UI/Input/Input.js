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
import * as types from '../../../store/Actions';
import cloneDeep from 'lodash/cloneDeep';
import View from '../../Parsers/ViewParser/ViewParser';
import Button from '../Button/Button';
import Label from '../Label/Label';
import Aux from '../../../hoc/Auxiliary'
import classes from './Input.scss';

class Input extends Component {

  render() {
    // console.log(this.props);
    let inputElement = null;
    let inputClasses = [classes.InputElement];
    let validationError = null;

    const { elementType, elementConfig, value, valid, validation, touched, label,
      defaultFocus, lookup, lookupFieldForDisplay, lookupTitle, placeholder} = this.props.configInput;

    // We cannot use the <Label> component, because that returns an object and we can only use a plain text for the placeholder.
    const placeholderInput = this.props.translates[placeholder] ? this.props.translates[placeholder] : null;

    if (!valid && validation) {
      inputClasses.push(classes.Invalid);
    }

    if (!valid && validation && touched) {
      validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>
    }

    // Default focus.
    const autoFocus = defaultFocus ? true : false;

    switch (elementType) {

      case ('input'):
        inputElement = <input
          className={inputClasses.join(' ')}
          {...elementConfig}
          placeholder={placeholderInput}
          value={value}
          autoFocus={autoFocus}
          onChange={this.props.changed}/>;
        break;

      case ('textarea'):
        inputElement = <textarea
          className={inputClasses.join(' ')}
          {...elementConfig}
          placeholder={placeholderInput}
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

      case ('multiAppend'):
        const multiLineItems = value.map((item, index) => {
          const valueId = item._id;
          return (
            <div key={index} className={classes.Multiline}>
              <div onClick={() => this.props.removeMultiValueItem(this.props.inputId, valueId)}>
                <Button outline='true' color="danger" labelIcon="times" />
              </div>
              <div className={classes.DisplayValue}>{item.name}</div>
            </div>
          );
        });

        const multiLines =
          <div className={classes.MultilineWrapper}>
            {multiLineItems}
          </div>;

        inputElement = (
          <Aux>
            <Button clicked={() => this.props.showModal('showModalLookup', 'ModalMedium', ['keySelect', lookupTitle], 'info',
              <View viewConfig={lookup} />, 'butOkCancel')}
              color="primary" labelText={['keyPlus', lookupTitle]}
            />
            {multiLines}
          </Aux>
        );
        break;

      default:
        inputElement = <input
          className={inputClasses.join(' ')}
          {...elementConfig}
          placeholder={placeholderInput}
          value={value}
          autoFocus={autoFocus}
          onChange={this.props.changed}/>;
    }

    return(
      <div className={classes.Input}>
        <label className={classes.Label}>
          <Label labelKey={label} propercase={true} />
        </label>
        {validationError}
        {inputElement}
      </div>
    );
  }

}

const mapStateToProps = state => {
  return {
    translates: state.redMain.transTranslates
  };
}

export default connect(mapStateToProps)(Input);
