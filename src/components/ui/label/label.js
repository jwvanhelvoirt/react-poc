import React from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/auxiliary';
import { getDisplayValue } from '../../../libs/generic';
import classes from './label.scss';

const label = (props) => {
  let labelTranslated = (
    <span className={classes.NoTranslate}>
      {props.trailingSpace ? props.labelKey + ' ' : props.labelKey}
    </span>
  );

  if (props.translates[props.labelKey]) {
    labelTranslated = getDisplayValue(props.labelKey, props.convertType, true, props.translates);
    labelTranslated = props.trailingSpace ? labelTranslated + ' ' : labelTranslated;
  }

  return(
    <Aux>{labelTranslated}</Aux>
  );
};

const mapStateToProps = state => {
  const { translates } = state.redMain;
  return { translates };
};

export default connect(mapStateToProps)(label);
