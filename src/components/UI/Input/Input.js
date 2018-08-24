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

import React from 'react';

import classes from './Input.scss';

const input = (props) => {
  // console.log(props.defaultFocus);
  let inputElement = null;
  let inputClasses = [classes.InputElement];
  let validationError = null;

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
    validationError = <p className={classes.ValidationError}>Please enter a valid value!</p>
  }

  // Default focus.
  const autoFocus = props.defaultFocus ? true : false;

  switch (props.elementType) {

    case ('input'):
      inputElement = <input
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        autoFocus={autoFocus}
        onChange={props.changed}/>;
      break;

    case ('textarea'):
      inputElement = <textarea
        className={inputClasses.join(' ')}
        {...props.elementConfig}
        value={props.value}
        autoFocus={autoFocus}
        onChange={props.changed}/>;
      break;

    case ('select'):
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          value={props.value}
          autoFocus={autoFocus}
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
        autoFocus={autoFocus}
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
