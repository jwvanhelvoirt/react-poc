/**
* @brief   Returns a spinner to use during data loading from a server..
*/

import React from 'react';
import classes from './Spinner.css';

// Spinner from https://projects.lukehaas.me/css-loaders/

const spinner = () => (
  <div className={classes.Loader}>Loading...</div>
);

export default spinner;
