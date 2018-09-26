import React from 'react';

const elemInput = (props) => {
  const { configInput, inputClasses, placeholderInput, autoFocus, changed } = props;
  const { elementConfig, value } = configInput;

  return (
    <input
      className={inputClasses.join(' ')}
      {...elementConfig}
      placeholder={placeholderInput}
      value={value}
      autoFocus={autoFocus}
      autoComplete='off'
      onChange={changed}
    />
  );
};

export default elemInput;
