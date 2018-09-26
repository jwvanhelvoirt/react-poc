import React from 'react';
import { getDisplayValue } from '../../../../libs/generic';

const elemSelect = (props) => {
  const { configInput, inputClasses, autoFocus, changed, translates } = props;
  const { elementConfig, value, convertDisplayValues, translateDisplayValues } = configInput;

  return (
    <select
      className={inputClasses.join(' ')}
      value={value}
      autoFocus={autoFocus}
      onChange={changed}>
      {elementConfig.options.map(option => {
        const displayValue = getDisplayValue(option.displayValue, convertDisplayValues, translateDisplayValues, translates);
        return <option key={option.value} value={option.value}>
          {displayValue}
        </option>
      })}
    </select>
  );
};

export default elemSelect;
