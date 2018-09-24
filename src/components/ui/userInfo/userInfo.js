import React from 'react';
import { connect } from 'react-redux';
import Label from '../label/label';
import Aux from '../../../hoc/auxiliary';
import classes from './userInfo.scss';

const userInfo = (props) => {

  const msg = props.msgFailedSubmit && props.formShowUserInfo ?
    <div className={classes.UserInfo}>
      <div><Label labelKey={props.msgFailedSubmit} convertType={'propercase'} /></div>
    </div> :
    null;

  return (<Aux>{msg}</Aux>);
};

const mapStateToProps = state => {
  const { formShowUserInfo } = state.redMain;
  return { formShowUserInfo };
};

export default connect(mapStateToProps)(userInfo);
