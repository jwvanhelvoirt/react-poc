import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Label from '../../../UI/Label/Label';
import classes from './NavigationItem.scss';

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
						<Label labelKey={props.label} propercase={true} />
					</div>
				</div>
			</NavLink>
		</li>
	);
};

export default navigationItem;
