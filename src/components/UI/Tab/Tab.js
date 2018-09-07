import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import Label from '../../ui/label/label';
import classnames from 'classnames';

const tab = (props) => {

	let link = null;

	if (props.tabItem.label) {
		link = (
			<NavItem key={props.tabItem.id}>
				<NavLink
					className={classnames({ active: props.activeTab === props.tabItem.id })}
					onClick={props.clicked}>
					<Label labelKey={props.tabItem.label} convertType={'propercase'} />
				</NavLink>
			</NavItem>
		)
	}

	return (
		link
	);
};

export default tab;
