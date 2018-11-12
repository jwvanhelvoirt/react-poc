import React from 'react';
import MultiEntryHeader from '../multiEntryHeader/multiEntryHeader';
import classes from './multiEntryWrapper.scss';

const multiEntryWrapper = (props) => {

  const { height, labels, addAction, entries } = props;

  const header = labels || addAction ? <MultiEntryHeader labels={labels} addAction={addAction} /> : null;

  return (
    <div>
      {header}
      <div className={classes.EntriesWrapper} style={height ? {maxHeight: height} : '' }>{entries}</div>
    </div>
  );

};

export default multiEntryWrapper;
