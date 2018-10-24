import React from 'react';
import DrawerToggle from '../sideDrawer/drawerToggle/drawerToggle';
// import DrawerToggleIcons from '../sideDrawer/drawerToggle/drawerToggleIcons';
import ToolbarSearch from './toolbarSearch/toolbarSearch';
import ToolbarIcons from './toolbarIcons/toolbarIcons';
import classes from './toolbar.scss';

const toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Searchbar}><ToolbarSearch /></div>
      <ToolbarIcons navIcons={props.navIcons} />
    </header>
  );
};

export default toolbar;
