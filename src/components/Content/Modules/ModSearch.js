import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aux from '../../../hoc/Auxiliary';

class ModSearch extends Component {
    render () {
        return (
            <Aux>
                <div>Zoekresultaten voor : {this.props.searchText}</div>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
  return {
    searchText: state.redMain.searchTextOverall
  };
}

export default connect(mapStateToProps)(ModSearch);
