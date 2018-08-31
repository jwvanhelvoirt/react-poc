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
  const label = props.title.map((item, index) => {
    return index === 0 ?
      <Label key={index} labelKey={item} propercase={true} trailingSpace={true} /> :
      <Label key={index} labelKey={item} />
  });

  return(
    <div className={classesHeader}>{label}</div>
  );
}

export default modalHeader;
