import React, { Component } from 'react';

import Aux from '../../hoc/auxiliary';
import classes from './layout.scss';
import Toolbar from '../navigation/toolbar/toolbar';
import SideDrawer from '../navigation/sideDrawer/sideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: false,
    showSideDrawerIcons: false
  }

  sideDrawerClosedHandler = () => {
    this.setState({ showSideDrawer: false });
  }

  sideDrawerClosedHandlerIcons = () => {
    this.setState({ showSideDrawerIcons: false });
  }

  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  }

  sideDrawerToggleHandlerIcons = () => {
    this.setState((prevState) => {
      return { showSideDrawerIcons: !prevState.showSideDrawerIcons };
    });
  }

  render() {
    const { toolbar } = this.props;
    let toolbarAndSideDrawers = null;

    if (toolbar) {
      toolbarAndSideDrawers =
        <Aux>
          <Toolbar
            drawerToggleClicked={this.sideDrawerToggleHandler}
            drawerToggleClickedIcons={this.sideDrawerToggleHandlerIcons}
            navIcons={this.props.navIcons}
          />
          <SideDrawer
            open={this.state.showSideDrawer}
            closed={this.sideDrawerClosedHandler}
            navItems={this.props.navItems}
          />
          <SideDrawer
            open={this.state.showSideDrawerIcons}
            closed={this.sideDrawerClosedHandlerIcons}
            navItems={this.props.navIcons}
          />
        </Aux>;
    }

    const contentClass = toolbar ? classes.Content : classes.FullScreen;

    return (
      <Aux>
        {toolbarAndSideDrawers}
        <main className={contentClass}>
          {this.props.children}
        </main>
      </Aux>
    )
  }
}
export default Layout;
