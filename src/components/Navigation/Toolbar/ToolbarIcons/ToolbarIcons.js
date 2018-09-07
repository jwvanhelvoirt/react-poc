import React from 'react';

import classes from './toolbarIcons.scss';
import ToolbarIcon from '../../../ui/toolbarIcon/toolbarIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const toolbarIcons = (props) => {
	const links = props.navIcons.map((icon, index) => {
		let nav = null;
		if (icon.url) {
			nav =<ToolbarIcon key={index} id={index} link={icon.url} label={icon.label}><FontAwesomeIcon icon={icon.icon} /></ToolbarIcon>
		} else if (icon.clicked) {
			nav =<ToolbarIcon key={icon.index} id={icon.index} clicked={icon.clicked} label={icon.label}><FontAwesomeIcon icon={icon.icon} /></ToolbarIcon>
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
