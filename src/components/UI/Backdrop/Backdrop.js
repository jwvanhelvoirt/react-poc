/**
 * @brief   Returns a backdrop for blocking all interaction with underlying HTML DOM elements.
 * @params  clicked   Callback to remove the backdrop.
 */

import React from 'react';

import classes from './Backdrop.css';

const backdrop = (props) => (
  props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
);

export default backdrop;
