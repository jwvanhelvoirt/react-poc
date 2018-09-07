/**
* @brief   Returns a spinner to use during data loading from a server..
*/

import React from 'react';
import classes from './spinnerInit.scss';

// Spinner from https://projects.lukehaas.me/css-loaders/

const spinner = () => (
  <div className={classes.Loader}>Loading...</div>
);

export default spinner;
