import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import classes from './ListView.scss';

class ListView extends Component {
	state = {
	}

	render() {
		return (
			<Aux>
				<div className={classes.ListView}>
					ListView
				</div>
			</Aux>
		);
	}
}

export default ListView;