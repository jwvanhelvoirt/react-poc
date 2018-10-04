import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';
import Label from '../../../ui/label/label';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../view.scss';

const titleBar = (props) => {
  const { viewConfig, _this } = props;
  const { count, skip } = _this.state;

  // Navigation.
  let navInfo = null;
  let navBack = null;
  let navBackMult = null;
  let navForw = null;
  let navForwMult = null;

  const of = <Label labelKey={trans.KEY_OF} />;

  if (viewConfig.showNavigation) {
      navBack =     <div key="2" className={classes.PreviousNext} onClick={() => _this.nav(false, false)}>&lt;</div>;
      navBackMult = <div key="3" className={classes.PreviousNext} onClick={() => _this.nav(false, true)}>&lt;{_this.navStep}</div>;
      navForwMult = <div key="4" className={classes.PreviousNext} onClick={() => _this.nav(true, true)}>&gt;{_this.navStep}</div>;
      navForw =     <div key="5" className={classes.PreviousNext} onClick={() => _this.nav(true, false)}>&gt;</div>;
      if (count > skip) {
          navInfo = <div key="1" className={classes.Counter}><div>{skip + 1}-{skip + viewConfig.limit > count ?
            count :
            skip + viewConfig.limit} {of} {count}</div></div>;
      } else if (count === 0) {
        navInfo = <div key="1" className={classes.Counter}>0</div>;
      } else {
        navInfo = <div key="1" className={classes.Counter}>1-{count} {of} {count}</div>;
      }
  }
  const nav = [navInfo, navBack, navBackMult, navForwMult, navForw];

  // Column configurator.
  const columnConfig = viewConfig.showColumnConfigurator ?
    <div onClick={() => _this.onClickColumnConfiguratorHandler()}
      className={classes.ColumnConfigurator}>
      <FontAwesomeIcon icon={icons.ICON_ELLIPSIS_V} />
    </div> :
    null;

  // Title bar overall.
  const titleBarOverall = viewConfig.showRowTitle ?
    <div className={classes.TitleRow}>
      <Label labelKey={viewConfig.title} convertType={'propercase'} />
      <div className={classes.Navigation}>
        {columnConfig}
        {nav}
      </div>
    </div> :
    null;

  return(
    <Aux>{titleBarOverall}</Aux>
  );
}

export default titleBar;
