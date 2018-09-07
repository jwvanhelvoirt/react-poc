import React, { Component } from 'react';
import { connect } from 'react-redux';

class ModSearch extends Component {
  render = () => {
    return (
      <div>Zoekresultaten voor : {this.props.searchText}</div>
    );
  };
}

const mapStateToProps = state => {
  return {
    searchText: state.redMain.searchTextOverall
  };
};

export default connect(mapStateToProps)(ModSearch);
