import React from 'react';

import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import Aux from '../../../hoc/Auxiliary';
import classes from './Button.scss';

const button = (props) => {
	// Get the label html for the button.
	let label = null;
	if (props.labelIcon) {
		label = <FontAwesomeIcon icon={props.labelIcon} />
	} else if (props.labelText) {
		label = props.labelText;
	}

	// Get the button and tooltip html.
	let button = (
		<Button
			size="sm"
			className={classes.Button}
			color={props.color}
			onClick={props.clicked}
			disabled={props.disabled}>
			{label}
		</Button>
	);
	let reactTooltip = null;
	if (props.tooltip) {
		button = (
			<Button
				size="sm"
				className={classes.Button}
				color={props.color}
				onClick={props.clicked}
				disabled={props.disabled}
				data-tip={props.dataTip}
				data-for={props.id}>
				{label}
			</Button>
		);
		reactTooltip = (
			<ReactTooltip id={props.id} place="bottom" type="dark" effect="solid">
				<span>{props.tooltip}</span>
			</ReactTooltip>
		);
	}

	return (
		<Aux>
			{button}
			{reactTooltip}
		</Aux>
	);
}

export default button;
