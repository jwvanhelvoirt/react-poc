import React from 'react';
import Label from '../../../../ui/label/label';
import classes from './elemRadio.scss';

const radio = (props) => {

  const { configInput, changed, inputId } = props;
  const { options, value } = configInput;

  const radioHtml = options.map((option, index) => {
    const classOption = option.value === value ? [classes.Radio, classes.Active].join(' ') : classes.Radio;
    return (
      <div key={index} className={classOption} onClick={(event) => changed(event, inputId, option.value)}>
        <Label labelKey={option.displayValue} convertType={'propercase'} />
      </div>
    );
  });

  return (
    <div className={classes.RadioWrapper}>{radioHtml}</div>
  );
};

export default radio;
