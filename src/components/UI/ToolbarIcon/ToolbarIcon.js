import React from 'react';

import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import classes from './ToolbarIcon.scss';

const toolbarIcon = (props) => {
	const tooltipId = "tb_icon_" + props.id;

	let containerLink = null;
	if (props.link) {
		containerLink =
			<NavLink
				to={props.link}
				exact
				data-tip="React-tooltip"
				data-for={tooltipId}
				activeStyle={{
					color: 'red'
				}}>
				{props.children}
			</NavLink>
	} else if (props.clicked) {
		containerLink =
			<a
				onClick={props.clicked}
				data-tip="React-tooltip"
				data-for={tooltipId}>
				{props.children}
			</a>
	}

	return (
		<li className={classes.ToolbarIcon}>
			{containerLink}
			<ReactTooltip id={tooltipId} place="bottom" type="dark" effect="solid">
				<span>{props.label}</span>
			</ReactTooltip>
		</li>
	);
}

export default toolbarIcon;
