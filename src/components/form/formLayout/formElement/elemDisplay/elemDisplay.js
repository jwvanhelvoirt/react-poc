import React from 'react';
import classes from './elemDisplay.scss';

const display = (props) => {

  return (
    <div className={classes.DisplayElement}>
      {props.configInput.value}
    </div>
  );

};

export default display;
