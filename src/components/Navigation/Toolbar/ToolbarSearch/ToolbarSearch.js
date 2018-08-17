import React, { Component } from 'react';

import { InputGroup, Input } from 'reactstrap';
import Button from '../../../UI/Button/Button';
import { withRouter } from 'react-router-dom';
import classes from './ToolbarSearch.scss';

class ToolbarSearch extends Component {
	state = {
		searchText: ""
	}

	deleteSearchtextHandler = () => {
		this.setState(
			{ searchText: "" }
		);
	}

	executeSearchHandler = () => {
		this.props.history.push('/search?query=' + this.state.searchText);
	}

	changeHandler = (event) => {
		this.setState(
			{ searchText: event.target.value }
		);
	}

	componentDidMount() {
		//console.log(this.props);
	}

	render() {
		return (
			<div className={classes.ToolbarSearch}>
				<InputGroup>
					<Button
						color="secondary"
						dataTip="React-tooltip"
						id="Searchbar-Delete"
						labelIcon="times-circle"
						tooltip="Zoektekst verwijderen"
						clicked={this.deleteSearchtextHandler}
					/>
					<Input placeholder="Zoeken..." value={this.state.searchText} onChange={this.changeHandler} />
					<Button
						color="secondary"
						dataTip="React-tooltip"
						id="Searchbar-Search"
						labelText="Zoeken"
						tooltip="Zoeken in database op de server"
						clicked={this.executeSearchHandler}
					/>
				</InputGroup>
			</div>
		);
	}
}

export default withRouter(ToolbarSearch);
