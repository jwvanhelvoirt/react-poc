import React, { Component } from 'react';

import Aux from '../../../hoc/Auxiliary';

class ModPersonal extends Component {
    render () {
        return (
            <Aux>
                <div>Persoonlijke instellingen</div>
            </Aux>
        );
	}

	componentDidMount() {
		console.log("Component Peronal did mount");
	}
}

export default ModPersonal;
