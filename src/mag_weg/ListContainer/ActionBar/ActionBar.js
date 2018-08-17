// import React from 'react';

// const actionBar = () => {
//     return (
//         <div>Search bar, Action, Action, Action</div>
//     )
// }

// export default actionBar;

import React, { Component } from 'react';

import PropTypes from 'prop-types';

class ActionBar extends Component {
    render() {
        return(
            <div>Search bar, Action, Action, Action</div>
        )
    }
}

// Dit is feitelijk een stukje documentatie hoe proptype validatie te gebruiken
// Kan best zijn dat dit straks hier helemaal niet nodig is.
// ActionBar.propTypes = {
//     type: PropTypes.string.isRequired
// };

export default ActionBar;

