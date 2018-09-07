import React from 'react';

import NavigationItems from '../navigationItems/navigationItems';
import classes from './sideDrawer.scss';
import Backdrop from '../../ui/backdrop/backdrop';
import Aux from '../../../hoc/auxiliary';

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];
  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')} onClick={props.closed}>
        <nav>
          <NavigationItems navItems={props.navItems} />
        </nav>
      </div>
    </Aux>
  );
}

export default sideDrawer;
