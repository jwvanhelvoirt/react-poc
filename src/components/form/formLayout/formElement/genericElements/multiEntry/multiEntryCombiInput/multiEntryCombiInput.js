import React from 'react';
import Aux from '../../../../../../../hoc/auxiliary';
import classes from './multiEntryCombiInput.scss';

const multiEntryCombiInput = (props) => {

  const combiInput = props.inputs.map((input, index) => <Aux key={index}>{input}</Aux>);

  return (
    <div className={classes.CombiInput}>
      {combiInput}
    </div>
  );

}

export default multiEntryCombiInput;
