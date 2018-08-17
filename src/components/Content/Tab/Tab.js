import React from 'react';

import { Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

const tab = (props) => {

	let link = null;

	if (props.tabItem.label) {
		link = (
			<NavItem key={props.tabItem.id}>
				<NavLink
					className={classnames({ active: props.activeTab === props.tabItem.id })}
					onClick={props.clicked}>
					{props.tabItem.label}
				</NavLink>
			</NavItem>
		)
	}

	return (
		link
	);
}

export default tab;
