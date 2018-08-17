import React from 'react';

import classes from './Toolbar.scss';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import ToolbarSearch from './ToolbarSearch/ToolbarSearch';
import ToolbarIcons from './ToolbarIcons/ToolbarIcons';

const toolbar = (props) => (
	<header className={classes.Toolbar}>
		<DrawerToggle clicked={props.drawerToggleClicked} />
		<nav className={classes.DesktopOnly}>
			<NavigationItems navItems={props.navItems} />
		</nav>
		<ToolbarSearch />
		<ToolbarIcons navIcons={props.navIcons} />
	</header>
);

export default toolbar;