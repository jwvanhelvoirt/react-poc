import React from 'react';

import classes from './ToolbarIcons.scss';
import ToolbarIcon from './ToolbarIcon/ToolbarIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const toolbarIcons = (props) => {
	const links = props.navIcons.map((icon, index) => {
		let nav = null;
		if (icon.url) {
			nav =<ToolbarIcon key={index} id={index} link={icon.url} label={icon.label}><FontAwesomeIcon icon={icon.icon} /></ToolbarIcon>
		}
		return nav
	});

	return (
		<ul className={classes.ToolbarIcons}>
			{links}
		</ul>
	);
}

export default toolbarIcons;
