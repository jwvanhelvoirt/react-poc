import React from 'react';

import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import classes from './ToolbarSearch.scss';

const toolbarSearch = () => {
	return (
		<div className={classes.ToolbarSearch}>
			<InputGroup>
				<InputGroupAddon addonType="prepend">
					<Button color="secondary" data-tip="React-tooltip" data-for="Searchbar-Delete">
						<FontAwesomeIcon icon="times-circle" />
					</Button>
				</InputGroupAddon>
				<Input placeholder="Zoeken..."/>
				<InputGroupAddon addonType="append">
					<Button color="secondary" data-tip="React-tooltip" data-for="Searchbar-Search">
						<FontAwesomeIcon icon="search" />
					</Button>
				</InputGroupAddon>
			</InputGroup>
			<ReactTooltip id="Searchbar-Delete" place="bottom" type="dark" effect="solid">
				<span>Zoektekst verwijderen</span>
			</ReactTooltip>
			<ReactTooltip id="Searchbar-Search" place="bottom" type="dark" effect="solid">
				<span>Zoeken in database op de server</span>
			</ReactTooltip>
		</div>
	);
}

export default toolbarSearch;
