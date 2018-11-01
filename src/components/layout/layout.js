import React, { Component } from 'react';

import Aux from '../../hoc/auxiliary';
import classes from './layout.scss';
import Toolbar from '../navigation/toolbar/toolbar';
import SideDrawer from '../navigation/sideDrawer/sideDrawer';

class Layout extends Component {
  state = {
    showSideDrawer: true
  };

  // User closes the normal sideBar.
  sideDrawerClosedHandler = () => this.setState({ showSideDrawer: false });

  // User clicks on the icon (hamburger) to show the normal sideBar.
  sideDrawerToggleHandler = () => {
    this.setState((prevState) => {
      return { showSideDrawer: !prevState.showSideDrawer };
    });
  };

  componentWillMount = () => {
    const browserWidth = window.innerWidth || document.body.clientWidth;

    if (browserWidth < 768) {
      this.setState({showSideDrawer: false});
    }
  };

  render = () => {
    const { toolbar } = this.props;
    let toolbarOutput = null;

    if (toolbar) {
      toolbarOutput =
        <Toolbar
          drawerToggleClicked={this.sideDrawerToggleHandler}
          drawerToggleClickedIcons={this.sideDrawerToggleHandlerIcons}
          navIcons={this.props.navIcons}
          showSideDrawer={this.state.showSideDrawer}
        />
    }

    const sideDrawer = this.props.navItems ?
    (
      <SideDrawer
        open={this.state.showSideDrawer}
        navItems={this.props.navItems}
      />
  ) :
  null;

    const contentClass = toolbar ? classes.Content : classes.FullScreen;

    return (
      <Aux>
        {toolbarOutput}
        <main className={contentClass}>
          {sideDrawer}
          {this.props.children}
        </main>
      </Aux>
    );
  };

}
export default Layout;
