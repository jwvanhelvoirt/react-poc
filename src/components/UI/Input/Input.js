/**
* @brief   Returns an input element for a form..
* @params  changed          Callback to trigger on the change event of the input.
* @params  elementConfig    Object containing properties and/or option values for selects.
* @params  elementType      String containing the input HTML element (i.e. text, textarea, select etc..).
* @params  invalid          Boolean indicating if the current value meets all validation roles.
* @params  label            String containing the label related to the input.
* @params  shouldValidate   Boolean indicating if the element has validation rules configured.
* @params  touched          Boolean indicating if the input has been touched by the user.
* @params  value            String containing the input's current value.
*/

import React from 'react';

import classes from './Input.scss';

const input = (props) => {
  let inputElement = null;
  let inputClasses = [classes.InputElement];
  let validationError = null;

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>
  }

  switch (props.elementType) {

    case ('input'):
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}/>;
      break;

    case ('textarea'):
      inputElement = <textarea
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}/>;
      break;

    case ('select'):
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}>
          {props.elementConfig.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;

    default:
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        onChange={props.changed}/>;
  }

  return (
    <div className={classes.Input}>
      <label className={classes.Label}>{props.label}</label>
      {validationError}
      {inputElement}
    </div>
  );
};

export default input;
