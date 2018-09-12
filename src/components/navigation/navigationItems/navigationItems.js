import React from 'react';

import classes from './navigationItems.scss';
import NavigationItem from './navigationItem/navigationItem';

const navigationItems = (props) => {
	const links = props.navItems.map((navItem, index) => {
		let nav = null;
		if (navItem.url) {
			nav = <NavigationItem key={index} link={navItem.url} label={navItem.label} icon={navItem.icon} />
		}
		return nav
	});

	return (
		<ul className={classes.NavigationItems}>
			{links}
		</ul>
	);
};

export default navigationItems;
