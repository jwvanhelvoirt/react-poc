import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getCategory } from '../../modules/category-list';

class CategoryNodeContainer extends Component {
  render() {
    const { category = {} } = this.props;
    let children = category.children || [];
    return (
      <div className="category-node">
        <span>arrow</span>
        <span>{category.name}</span>
        {children.length > 0 && children.map((child, i) => {
          return (<CategoryNodeContainer key={i} name={child} />);
        })}
      </div>
    );
  }
}

const mapStateToProps = (state, { name }) => {
  return {
    category: getCategory(state, name),
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CategoryNodeContainer);
