import React from 'react';

import { NavTab } from 'react-router-tabs';
import './NavTab.scss';

const navTab = (props) => {
	return (
		<NavTab to={props.url} replace className="nav-tab-route">{props.children}</NavTab>
	);
}

export default navTab;