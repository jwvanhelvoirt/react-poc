import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from '../../ui/label/label';
import classes from './modalHeader.scss';

const modalHeader = (props) => {

  let classColor = classes.Info;
  switch (props.type) {
    case 'warning':
      classColor = classes.Warning;
      break;
    case 'error':
      classColor = classes.Error;
      break;
    default:
      break;
  };

  const headerClass = props.modal ? classes.Header : classes.HeaderFullScreen;

  const classesHeader = [headerClass, classColor, classes[props.headerSize], classes[props.titleAlign]].join(' ');
  const label = props.title.map((item, index) => {
    return index === 0 ?
      <Label key={index} labelKey={item} convertType={'propercase'} trailingSpace={true} /> :
      <Label key={index} labelKey={item} />
  });

  const icon = props.titleIcon ? <FontAwesomeIcon icon={['far', props.titleIcon]} /> : null;

  return(
    <div className={classesHeader}>
      {icon}
      {label}
    </div>
  );
};

export default modalHeader;
