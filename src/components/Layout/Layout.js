import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import classes from './Layout.scss';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

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
    return (
      <Aux>
        <Toolbar
          drawerToggleClicked={this.sideDrawerToggleHandler}
          drawerToggleClickedIcons={this.sideDrawerToggleHandlerIcons}
          navIcons={this.props.navIcons} />
        <SideDrawer
          open={this.state.showSideDrawer}
          closed={this.sideDrawerClosedHandler}
          navItems={this.props.navItems} />
        <SideDrawer
          open={this.state.showSideDrawerIcons}
          closed={this.sideDrawerClosedHandlerIcons}
          navItems={this.props.navIcons} />
        <main className={classes.Content}>
          {this.props.children}
        </main>
      </Aux>
    )
  }
}
export default Layout;
