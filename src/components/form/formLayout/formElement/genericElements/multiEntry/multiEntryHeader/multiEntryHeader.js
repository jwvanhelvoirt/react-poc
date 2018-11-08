import React from 'react';
import Label from '../../../../../../ui/label/label';
import MultiEntryButton from '../multiEntryButton/multiEntryButton';
import classes from './multiEntryHeader.scss';
import classesFormContent from '../../../../formContent/formContent.scss';

const multiEntryHeader = (props) => {

  const { labels, addAction } = props;

  const labelsOutput = labels.map((item, index) => {
    return (
      <div key={index} className={classesFormContent[item.width]}>
        <Label labelKey={item.label} convertType={'propercase'} />
      </div>
    );
  });

  const addButton = addAction ? <MultiEntryButton classButton={'Add'} clicked={addAction} /> : '';

  return (
    <div className={classes.Header}>
      <div className={classes.Labels}>{labelsOutput}</div>
      <div>{addButton}</div>
    </div>
  );
}

export default multiEntryHeader;
