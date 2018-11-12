import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../libs/constIcons';
import { storeDropdownHtml } from '../../../store/actions';
import Dropdown from '../../ui/dropdown/dropdown';
import classes from './select.scss';

class Select extends Component {

  showDropdown = (event, rowId, value) => {
    this.toggleDropdown(event, true, rowId, value);
  };

  closeDropdown = (event) => {
    this.toggleDropdown(event, false);
  }

  toggleDropdown = (event, show, rowId, value) => {
    const dropdown = show ?
    <Dropdown
      values={this.props.options}
      valuesIdLabel={{ id: 'id', label: 'naam' }}
      searchBar={true}
      searchType={'client'}
      onSelect={this.props.onChange}
      rowId={rowId}
      show={show}
      dropdownClosed={(event) => this.closeDropdown(event)}
      mousePosX={event.clientX}
      mousePosY={event.clientY}
    /> : null;

    this.props.storeDropdownHtml(dropdown);
  };

  addItem = (id, value) => {

  };

  render = () => {
    const { value, options, optionId, optionLabel, rowId } = this.props;

    let displayValue = '';
    options.forEach((item) => {
      if (item[optionId] === value) {
        displayValue = item[optionLabel];
      }
    });

    return (
      <div className={classes.SelectWrapper} onClick={(event) => this.showDropdown(event, rowId)}>
        <div className={classes.SelectValue}>{displayValue}</div>
        <button className={classes.SelectDropdown}>
          <FontAwesomeIcon icon={['far', icons.ICON_ANGLE_DOWN]} />
        </button>
      </div>
    );
  };

}

const mapDispatchToProps = dispatch => {
  return {
    storeDropdownHtml: (dropdownHtml) => dispatch(storeDropdownHtml(dropdownHtml))
  }
};

export default connect(null, mapDispatchToProps)(Select);
