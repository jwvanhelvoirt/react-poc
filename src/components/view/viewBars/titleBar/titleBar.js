import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';
import Label from '../../../ui/label/label';
import Aux from '../../../../hoc/auxiliary';
import classes from './titleBar.scss';

const titleBar = (props) => {
  const { viewConfig, _this } = props;
  const { count, skip } = _this.state;

  // Navigation.
  let navLeftEnd = null;
  let navLeftMult = null;
  let navLeft = null;
  let navInfo = null;
  let navRight = null;
  let navRightMult = null;
  let navRightEnd = null;

  const of = <Label labelKey={trans.KEY_OF} />;

  if (viewConfig.showNavigation) {
      navLeftEnd =  <div key="1" className={classes.PreviousNext} onClick={() => _this.nav(false, false)}><FontAwesomeIcon icon={icons.ICON_ARROW_TO_LEFT} /></div>;
      navLeftMult = <div key="2" className={classes.PreviousNext} onClick={() => _this.nav(false, true)}>{_this.navStep}</div>;
      navLeft =     <div key="3" className={classes.PreviousNext} onClick={() => _this.nav(false, false)}><FontAwesomeIcon icon={icons.ICON_ARROW_LEFT} /></div>;

      if (count > skip) {
          navInfo = <div key="4" className={classes.Counter}><div>{skip + 1}-{skip + viewConfig.limit > count ?
            count :
            skip + viewConfig.limit} {of} {count}</div></div>;
      } else if (count === 0) {
        navInfo = <div key="4" className={classes.Counter}>0</div>;
      } else {
        navInfo = <div key="4" className={classes.Counter}>1-{count} {of} {count}</div>;
      }

      navRight =     <div key="5" className={classes.PreviousNext} onClick={() => _this.nav(true, false)}><FontAwesomeIcon icon={icons.ICON_ARROW_RIGHT} /></div>;
      navRightMult = <div key="6" className={classes.PreviousNext} onClick={() => _this.nav(true, true)}>{_this.navStep}</div>;
      navRightEnd =  <div key="7" className={classes.PreviousNext} onClick={() => _this.nav(true, false)}><FontAwesomeIcon icon={icons.ICON_ARROW_TO_RIGHT} /></div>;
  }

  const navPrev = [navLeftEnd, navLeftMult, navLeft];
  const navNext = [navRight, navRightMult, navRightEnd];

  // navInfo = <div key="4" className={classes.Counter}>99.900-99.950 of 99.999</div>;

  const nav = (
    <Aux>
      <div className={classes.PreviousNextWrapper}>{navPrev}</div>
      {navInfo}
      <div className={classes.PreviousNextWrapper}>{navNext}</div>
    </Aux>
  );

  // Title bar overall.
  const titleBarOverall = viewConfig.showRowTitle ?
    <div className={classes.TitleRow}>
      <div className={classes.Navigation}>
        {nav}
      </div>
    </div> :
    null;

  return(
    <Aux>{titleBarOverall}</Aux>
  );
}

export default titleBar;
