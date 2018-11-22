import React from 'react';

const elemInput = (props) => {
  const { configInput, inputClasses, placeholderInput, autoFocus, changed, keyUp } = props;
  const { elementConfig, value } = configInput;

  return (
    <input
      className={inputClasses.join(' ')}
      {...elementConfig}
      placeholder={placeholderInput}
      value={value || ''}
      autoFocus={autoFocus}
      autoComplete='off'
      onChange={changed}
      onKeyUp={keyUp}
    />
  );
};

export default elemInput;
