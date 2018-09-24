import React, { Component } from 'react';
import { connect } from 'react-redux';

class ModSearch extends Component {
  render = () => {
    return (
      <div>Zoekresultaten voor : {this.props.searchTextOverall}</div>
    );
  };
}

const mapStateToProps = state => {
  const { searchTextOverall } = state.redMain;
  return { searchTextOverall };
};

export default connect(mapStateToProps)(ModSearch);
