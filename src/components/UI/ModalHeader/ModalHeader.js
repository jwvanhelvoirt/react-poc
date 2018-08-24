import React from 'react';
import classes from './ModalHeader.scss';

const modalHeader = (props) => {
  let classColor = classes.Info;
  switch (props.type) {
    case 'warning':
      classColor = classes.Warning;
      break;
    case 'error':
      classColor = classes.Error;
      break;
  }

  const classesHeader = [classes.Header, classColor].join(' ');

  return(
    <div className={classesHeader}>{props.title}</div>
  );
}

export default modalHeader;
