import React from 'react';

const display = (props) => {

  return (
    <div className={props.inputClasses.join(' ')}>
      {props.configInput.value}
    </div>
  );

};

export default display;
