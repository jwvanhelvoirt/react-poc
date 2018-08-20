import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import DrawerToggleIcons from '../SideDrawer/DrawerToggle/DrawerToggleIcons';
import ToolbarSearch from './ToolbarSearch/ToolbarSearch';
import ToolbarIcons from './ToolbarIcons/ToolbarIcons';
import { Large, Medium, Small } from '../../../classes/responsive';
import classes from './Toolbar.scss';

const toolbar = (props) => {
  const classesDynamicSearchbar = [classes.GrowMedium, classes.Searchbar].join(' ');
  return (
    <header className={classes.Toolbar}>
      <DrawerToggle clicked={props.drawerToggleClicked} />
      <div className={classesDynamicSearchbar}><ToolbarSearch /></div>
      <Large><ToolbarIcons navIcons={props.navIcons} /></Large>
      <Medium><ToolbarIcons navIcons={props.navIcons} /></Medium>
      <Small><DrawerToggleIcons clicked={props.drawerToggleClickedIcons} /></Small>
    </header>
  );
};

export default toolbar;
