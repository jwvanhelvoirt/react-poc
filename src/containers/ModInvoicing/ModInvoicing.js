import React, { Component } from 'react';

import Aux from '../../hoc/Auxiliary';

class ModInvoicing extends Component {
	tabs = [
		{ key: '0', label: 'Factureren', url: '/1' },
		{ key: '1', label: 'Concept', url: '/2' },
		{ key: '2', label: 'Verwerken', url: '/3' },
		{ key: '3', label: 'Facturen', url: '/4' }
	];

    render () {
        return (
            <Aux>
                <div>Facturering</div>
            </Aux>
        );
    }
}

export default ModInvoicing;
