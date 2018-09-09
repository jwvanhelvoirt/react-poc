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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import View from '../../parsers/viewParser/viewParser';
import Button from '../button/button';
import Label from '../label/label';
import Aux from '../../../hoc/auxiliary'
import { getDisplayValue } from '../../../libs/generic';
import classes from './input.scss';

class Input extends Component {

  render = () => {
    let inputElement = null;
    let inputClasses = [classes.InputElement];
    let validationError = null;

    const { inputId } = this.props;

    const { elementType, elementConfig, value, valid, validation, touched, label,
      defaultFocus, lookup, lookupTitle, placeholder,
      translateDisplayValues, convertDisplayValues, func } = this.props.configInput;

    const placeholderInput = placeholder ? getDisplayValue(placeholder, 'propercase', true, this.props.translates): null;

    if (!valid && validation) {
      inputClasses.push(classes.Invalid);
    }

    if (!valid && validation && touched) {
      validationError = <p className={classes.ValidationError}><Label labelKey={'keyValidValue'} convertType={'propercase'} /></p>
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
          autoComplete='off'
          onChange={this.props.changed}/>;
        break;

      case ('textarea'):
        inputElement = <textarea
          className={inputClasses.join(' ')}
          {...elementConfig}
          placeholder={placeholderInput}
          value={value}
          autoFocus={autoFocus}
          autoComplete='off'
          onChange={this.props.changed}/>;
        break;

      case ('select'):
        inputElement = (
          <select
            className={inputClasses.join(' ')}
            value={value}
            autoFocus={autoFocus}
            onChange={this.props.changed}>
            {elementConfig.options.map(option => {
              const displayValue = getDisplayValue(option.displayValue, convertDisplayValues, translateDisplayValues, this.props.translates);
              return <option key={option.value} value={option.value}>
                {displayValue}
              </option>
            })}
          </select>
        );
        break;

      case ('triggerFunctionLink'):
        inputElement = (
          <div className={classes.TriggerFunctionLink} onClick={() => func()}>
            <a><Label labelKey={label} convertType={'propercase'} /></a>
          </div>
        );
        break;

      case ('triggerFunctionCheckbox'):
        const click = func ? (event) => func(event, this.props.configForm) : null;
        inputElement = (
          <Aux>
            <input type='checkbox' checked={value} className={classes.TriggerFunctionCheckbox} onChange={this.props.changed} onClick={click} />
            <Label labelKey={label} convertType={'propercase'} />
          </Aux>
        );
        break;

      case ('multiAppend'):
        const multiLineItems = value.map((item, index) => {
          const valueId = item._id;
          return (
            <div key={index} className={classes.Multiline}>
              <div className={classes.MultilineRemove} onClick={() => this.props.removeMultiValueItem(inputId, valueId)}>
                <FontAwesomeIcon icon='times-circle' />
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
              <View viewConfig={lookup} lookup={true} lookupBindedInputId={inputId} />, 'butOkCancel')}
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
          autoComplete='off'
          onChange={this.props.changed}/>;
    }

    // Not all input types require a label.
    const labelPrint = (elementType !== 'triggerFunctionLink' && elementType !== 'triggerFunctionCheckbox') ?
      <label className={classes.Label}>
        <Label labelKey={label} convertType={'propercase'} />
      </label> :
      null;

    return(
      <div className={classes.Input}>
        {labelPrint}
        {validationError}
        {inputElement}
      </div>
    );
  };

}

const mapStateToProps = state => {
  return {
    translates: state.redMain.transTranslates
  };
};

export default connect(mapStateToProps)(Input);
