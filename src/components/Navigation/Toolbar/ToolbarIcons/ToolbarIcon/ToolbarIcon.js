import React from 'react';

import { NavLink } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import classes from './ToolbarIcon.css';

const toolbarIcon = (props) => {
	const tooltipId = "tb_icon_" + props.id;

	return (
		<li className={classes.ToolbarIcon}>
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
			<ReactTooltip id={tooltipId} place="bottom" type="dark" effect="solid">
				<span>{props.label}</span>
			</ReactTooltip>
		</li>
	);	
}

export default toolbarIcon;
