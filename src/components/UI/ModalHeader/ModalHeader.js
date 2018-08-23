import React from 'react';
import classes from './ModalHeader.scss';

const modalHeader = (props) => {
  return(
    <div className={classes.Header}>{props.title}</div>
  );
}

export default modalHeader;
