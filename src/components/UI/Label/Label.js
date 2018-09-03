import React from 'react';
import { connect } from 'react-redux';
import * as types from '../../../store/Actions';
import { propercase } from '../../../libs/generic';
import Aux from '../../../hoc/Auxiliary';
import { getDisplayValue } from '../../../libs/generic';
import classes from './Label.scss';

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
}

const mapStateToProps = state => {
  return {
    translates: state.redMain.transTranslates
  };
}

export default connect(mapStateToProps)(label);
