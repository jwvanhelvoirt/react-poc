import React from 'react';

import classes from './NavigationItem.scss';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const navigationItem = (props) => {
	return (
		<li className={classes.NavigationItem}>
			<NavLink
				to={props.link}
				exact
				activeStyle={{
					color: 'red'
				}}>
				<div className={classes.IconLabel}>
					<div>
						<FontAwesomeIcon icon={props.icon} />
					</div>
					<div>
						{props.label}
					</div>
				</div>
			</NavLink>
		</li>
	);
};

export default navigationItem;
