import React from 'react';

import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import Label from '../label/label';
import classes from './toolbarIcon.scss';

const toolbarIcon = (props) => {
	const tooltipId = "tb_icon_" + props.id;

	let containerLink = null;
	if (props.link) {
		// Support for route to display a particular component after clicking the icon.
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
		// Support for executing a callback function after clicking the icon.
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
				  <Label labelKey={props.label} convertType={'propercase'} />
			</ReactTooltip>
		</li>
	);
};

export default toolbarIcon;
