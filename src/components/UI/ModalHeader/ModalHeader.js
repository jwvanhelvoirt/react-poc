import React from 'react';
import Label from '../../UI/Label/Label';
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
    <div className={classesHeader}><Label labelKey={props.title} propercase={true} /></div>
  );
}

export default modalHeader;
