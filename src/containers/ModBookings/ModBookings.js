import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Content from '../../components/Content/Content';
import ListViewTabs from '../../components/GeneralUI/ListviewTabs/ListviewTabs';

class ModBookings extends Component {
	tabs = [
		{ key: '0', label: 'Opdracht', url: '/1' },
		{ key: '1', label: 'Certificering', url: '/2' }
	];

    render () {
        return (
            <Aux>
                <div>Urenregistratie</div>
                <ListViewTabs tabs={this.tabs}/>
                <Content/>
            </Aux>
        );
    }
}

export default ModBookings;