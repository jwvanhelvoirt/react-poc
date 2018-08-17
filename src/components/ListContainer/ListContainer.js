import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Aux from '../../hoc/Auxiliary';
import ActionBar from './ActionBar/ActionBar';
import List from './List/List';

class ListContainer extends Component {
    componentDidMount () {
        // Met withRouter krijg je toegang tot router props (history, location, match)
        //console.log(this.props);
    }

    render () {
        return (
        <Aux>
            <ActionBar/>
            <List/>
        </Aux>
        )
    }
}

export default withRouter(ListContainer);