import React from 'react';
import { connect } from 'react-redux';
import Label from '../Label/Label';
import Aux from '../../../hoc/Auxiliary';
import classes from './UserInfo.scss';

const userInfo = (props) => {

  const msg = props.msgFailedSubmit && props.formShowUserInfo ?
    <div className={classes.UserInfo}>
      <div><Label labelKey={props.msgFailedSubmit} convertType={'propercase'} /></div>
    </div> :
    null;

  return (<Aux>{msg}</Aux>);
};

const mapStateToProps = state => {
  return {
    formShowUserInfo: state.redMain.formShowUserInfo
  };
}

export default connect(mapStateToProps)(userInfo);
