import React from 'react';
import Label from '../../../ui/label/label';
import classes from './elemFormLink.scss';

const elemFormLink = (props) => {
  const { func, label } = props.configInput;

  return (
    <div className={classes.FormLink} onClick={() => func()}>
      <a><Label labelKey={label} convertType={'propercase'} /></a>
    </div>
  );
};

export default elemFormLink;
