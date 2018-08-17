import React, { Component } from 'react';

class CrmOrganization extends Component {
	list = [
		{ id: 1, name: 'ez2xs', city: 'Eindhoven' },
		{ id: 2, name: 'Philips', city: 'Amsterdam' },
		{ id: 3, name: 'Hertek', city: 'Apeldoorn' },
		{ id: 4, name: 'Normec', city: 'Etten-Leur' }
	];

    render () {
        return (
            <Aux>
                <div>CRM</div>
            </Aux>
        );
    }
}

export default CrmOrganization;
