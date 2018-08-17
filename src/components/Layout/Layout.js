import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import classes from './Layout.scss';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
	state = {
		showSideDrawer: false
	}

	sideDrawerClosedHandler = () => {
		this.setState({ showSideDrawer: false });
	}

	sideDrawerToggleHandler = () => {
		this.setState((prevState) => {
			return { showSideDrawer: !prevState.showSideDrawer };
		});
	}

	render() {
		return (
			<Aux>
				<Toolbar
					drawerToggleClicked={this.sideDrawerToggleHandler}
					navItems={this.props.navItems}
					navIcons={this.props.navIcons} />
				<SideDrawer
					open={this.state.showSideDrawer}
					closed={this.sideDrawerClosedHandler}
					navItems={this.props.navItems} />
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</Aux>
		)
	}
}
export default Layout;
