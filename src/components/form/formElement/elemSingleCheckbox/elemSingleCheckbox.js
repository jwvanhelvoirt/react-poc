import React from 'react';
import Label from '../../../ui/label/label';
import Aux from '../../../../hoc/auxiliary';
import classes from './elemSingleCheckbox.scss';

const elemSingleCheckbox = (props) => {
  const { configInput, configForm, changed } = props;
  const { func, label, value } = configInput;
  const click = func ? (event) => func(event, configForm) : null;

  return (
    <Aux>
      <input type='checkbox' checked={value} className={classes.SingleCheckbox} onChange={changed} onClick={click} />
      <Label labelKey={label} convertType={'propercase'} />
    </Aux>
  );
};

export default elemSingleCheckbox;
