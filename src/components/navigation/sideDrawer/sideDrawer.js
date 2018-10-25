import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavigationItems from '../navigationItems/navigationItems';
// import Backdrop from '../../ui/backdrop/backdrop';
import * as icons from '../../../libs/constIcons';
import Aux from '../../../hoc/auxiliary';
import classes from './sideDrawer.scss';

class SideDrawer extends Component {

  state = {
    showLabel: false
  };

  // User clicks on the arrow icon to show the normal/hide the navigation item labels.
  labelsToggleHandler = () => {
    this.setState((prevState) => {
      return { showLabel: !prevState.showLabel };
    });
  };

  render = () => {

    const classSideDrawer = this.state.showLabel ? classes.SideDrawerMax : classes.SideDrawerMin;
    const arrowIcon = this.state.showLabel ? icons.ICON_ANGLE_DOUBLE_LEFT : icons.ICON_ANGLE_DOUBLE_RIGHT;

    let attachedClasses = [classes.SideDrawer, classes.Close];
    if (this.props.open) {
      attachedClasses = [classes.SideDrawer, classSideDrawer, classes.Open];
    }

    return (
      <Aux>
        <div className={attachedClasses.join(' ')}>
          <div className={classes.sideBarDivider} />
          <div className={classes.ExpandCollapse} onClick={this.labelsToggleHandler}>
            <FontAwesomeIcon icon={['far', arrowIcon]} />
          </div>
          <nav>
            <NavigationItems navItems={this.props.navItems} showLabel={this.state.showLabel} />
          </nav>
        </div>
      </Aux>
    );
  }
}

export default SideDrawer;
