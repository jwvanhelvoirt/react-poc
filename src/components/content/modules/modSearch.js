import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './mod.scss';

class ModSearch extends Component {
  render = () => {
    return (
      <div className={classes.Wrapper}>Zoekresultaten voor : {this.props.searchTextOverall}</div>
    );
  };
}

const mapStateToProps = state => {
  const { searchTextOverall } = state.redMain;
  return { searchTextOverall };
};

export default connect(mapStateToProps)(ModSearch);
