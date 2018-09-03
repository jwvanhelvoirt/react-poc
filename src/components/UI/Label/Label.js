import React from 'react';
import { connect } from 'react-redux';
import * as types from '../../../store/Actions';
import { propercase } from '../../../libs/generic';
import Aux from '../../../hoc/Auxiliary';
import classes from './Label.scss';

const label = (props) => {
  let labelTranslated = <span className={classes.NoTranslate}>{props.labelKey}</span>;

  if (props.translates[props.labelKey]) {
    // labelKey exists in translates object.
    labelTranslated = props.propercase ?
      propercase(props.translates[props.labelKey]) :
      props.translates[props.labelKey]
  }

  labelTranslated = props.trailingSpace ? labelTranslated + ' ' : labelTranslated;
// console.log(labelTranslated);
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
