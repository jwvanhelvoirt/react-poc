import React, { Component } from 'react';

import Aux from '../../../hoc/Auxiliary';

class ModBookings extends Component {
	tabs = [
		{ key: '0', label: 'Opdracht', url: '/1' },
		{ key: '1', label: 'Certificering', url: '/2' }
	];

    render () {
        return (
            <Aux>
                <div>Urenregistratie</div>
            </Aux>
        );
    }
}

export default ModBookings;
