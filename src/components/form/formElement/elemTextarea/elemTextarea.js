import React from 'react';

const elemTextarea = (props) => {
  const { configInput, inputClasses, placeholderInput, autoFocus, changed } = props;
  const { elementConfig, value } = configInput;

  return (
    <textarea
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

export default elemTextarea;
