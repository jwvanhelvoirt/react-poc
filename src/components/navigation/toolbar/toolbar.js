import React from 'react';
import DrawerToggle from '../sideDrawer/drawerToggle/drawerToggle';
import DrawerToggleIcons from '../sideDrawer/drawerToggle/drawerToggleIcons';
import ToolbarSearch from './toolbarSearch/toolbarSearch';
import ToolbarIcons from './toolbarIcons/toolbarIcons';
import { Large, Medium, Small } from '../../../libs/responsive';
import classes from './toolbar.scss';

const toolbar = (props) => {
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classes.Searchbar}><ToolbarSearch /></div>
      <Large><ToolbarIcons navIcons={props.navIcons} /></Large>
      <Medium><ToolbarIcons navIcons={props.navIcons} /></Medium>
      <Small><DrawerToggleIcons clicked={props.drawerToggleClickedIcons} /></Small>
    </header>
  );
};

export default toolbar;
