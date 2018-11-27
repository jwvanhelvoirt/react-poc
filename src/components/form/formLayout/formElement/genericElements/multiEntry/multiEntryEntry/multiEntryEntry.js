import React from 'react';
import MultiEntryButton from '../multiEntryButton/multiEntryButton';
import classes from './multiEntryEntry.scss';
import classesFormContent from '../../../../formContent/formContent.scss';

const multiEntryEntry = (props) => {

  const { entryInput, deleteAction } = props;

  const entryInputOutput = entryInput.map((item, index) => {

    const entryLine = item.line.map((input, indexInput) => {
      return <div key={indexInput} className={classesFormContent[input.width]}>{input.input}</div>;
    });

    return <div key={index} className={classes.EntryLine}>{entryLine}</div>;
  });

  const deleteButton = deleteAction ? <MultiEntryButton classButton={'Delete'} clicked={deleteAction} /> : '';

  return (
    <div className={classes.Entry}>
      <div className={classes.Inputs}>
        {entryInputOutput}
      </div>
      <div className={classes.DeleteButton}>
        {deleteButton}
      </div>
    </div>
  );
}

export default multiEntryEntry;
