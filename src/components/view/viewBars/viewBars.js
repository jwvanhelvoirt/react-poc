import React from 'react';
import ActionBar from './actionBar/actionBar';
import HeaderBar from './headerBar/headerBar';
import TitleBar from './titleBar/titleBar';
import Aux from '../../../hoc/auxiliary';
import classes from '../view.scss';

const viewBars = (props) => {
  const { viewConfig, _this } = props;

  const listviewHeader = viewConfig.showListViewHeader ?
    <div className={classes.ListviewHeader}>
      <ActionBar viewConfig={viewConfig} _this={_this} />
      <HeaderBar viewConfig={viewConfig} _this={_this} />
      <TitleBar viewConfig={viewConfig} _this={_this} />
      <div className={classes.HorizontalRuler}></div>
    </div> :
    null;

  return(
    <Aux>{listviewHeader}</Aux>
  );
}

export default viewBars;
