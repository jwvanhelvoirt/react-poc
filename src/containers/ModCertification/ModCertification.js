import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';
import Content from '../../components/Content/Content';
import ListViewTabs from '../../components/GeneralUI/ListviewTabs/ListviewTabs';

class ModCertification extends Component {
	tabs = [
		{ key: '0', label: 'Opdracht', url: '/1' },
		{ key: '1', label: 'Offline', url: '/2' },
		{ key: '2', label: 'Email', url: '/3' }
	];

    render () {
        return (
            <Aux>
                <div>Certificering</div>
                <ListViewTabs tabs={this.tabs}/>
                <Content/>
            </Aux>
        );
    }
}

export default ModCertification;