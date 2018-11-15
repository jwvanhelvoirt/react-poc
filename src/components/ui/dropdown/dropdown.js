import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cloneDeep from 'lodash/cloneDeep';
// import _ from 'lodash';
import * as icons from '../../../libs/constIcons';
import * as trans from '../../../libs/constTranslates';
import { getDisplayValue } from '../../../libs/generic';
import { callServer } from '../../../api/api';
import Backdrop from '../backdrop/backdrop';
import Aux from '../../../hoc/auxiliary';
import classes from './dropdown.scss';

class Dropdown extends Component {

  constructor(props) {
    super(props);

    // In case we have values injected as a prop, we use these to fill the list (that fills the dropdown).
    // The other option is that we search on the server to fill the list.
    const list = props.values ?
      props.values.map((item) => {
        return {
          id: item[props.valuesIdLabel.id],
          label: item[props.valuesIdLabel.label]
        }
      }) : [];

    this.state = {
      list,
      listOriginal: cloneDeep(list), // to filter the original values
      searchbarValue: ''
    };

  };

  clearSearchbarHandler = () => {
    this.setState({ searchbarValue: '' });
  };

  inputSearchbarHandler = (event) => {
    const { listOriginal } = this.state;
    const newValue = event.target.value;

    let listFiltered = listOriginal;

    if (this.props.searchType === 'server') {
      this.submitSearchHandler(newValue);
    } else {
      if (newValue !== '') {
        // Filter the current values based on the original values list.
        listFiltered = listOriginal.filter((item) => item.label.toLowerCase().indexOf(newValue.toLowerCase()) >= 0);
      }
    }

    this.setState({ searchbarValue: newValue, list: listFiltered });
  };

  submitSearchHandler = (value) => {
    // Trigger a server search.
    const params = { MAGIC: localStorage.getItem('magic'), filter: value.toLowerCase() };
    callServer('put', this.props.searchApi.api,
      (response) => this.successSearchHandler(response),
      (error) => this.errorSearchHandler(error), params
    );
  };

  successSearchHandler = (response) => {
    const { entity, id, label } = this.props.searchApi;
    const arrayResponse = entity ? response.data[entity] : response.data; // Array can be directly at response.data or at response.data[entity].

    const listNew = arrayResponse.map((item) => {
      return { id: item[id], label: item[label] };
    });

    this.setState({ list: listNew });
  };

  errorSearchHandler = (error) => {
    console.log(error);
  };

  getValues = () => {
    const { dropdownClosed, searchBar, onSelect, rowId, mousePosX, mousePosY } = this.props;

    // We take these out of dropdown.scss.
    const dropdownWidth = 260;
    const searchWrapperPadding = 10;
    const searchHeight = 40;
    const valueWrapperHeight = 300;

    const browserWidth = window.innerWidth || document.body.clientWidth;
    const browserHeight = window.innerHeight || document.body.clientHeight;

    const dropdownHeight = (searchWrapperPadding * 2) + searchHeight + valueWrapperHeight;

    // Prevent the dropdown from leaving the browser screen both horizontally and vertically.
    const dropdownTop = (mousePosY + 20) + dropdownHeight > browserHeight ? browserHeight - dropdownHeight - 10 : (mousePosY + 20);
    const dropdownLeft = mousePosX + dropdownWidth > browserWidth ? browserWidth - dropdownWidth - 10 : mousePosX;

    const searchPlaceholder = getDisplayValue(trans.KEY_SEARCH, 'propercase', true, this.props.translates);

    const dropdownInlineStyle = dropdownWidth + 'px';
    const searchWrapperInlineStyle = searchWrapperPadding + 'px';
    const searchInlineStyle = searchHeight + 'px';
    const valueWrapperInlineStyle = valueWrapperHeight + 'px';

    const search = searchBar ?
      (
        <div style={{ padding: searchWrapperInlineStyle }}>
          <div className={classes.Search} style={{ height: searchInlineStyle }}>
            <div className={classes.SearchErase} onClick={() => this.clearSearchbarHandler()}>
              <FontAwesomeIcon icon={['far', icons.ICON_TIMES_CIRCLE]} />
            </div>
            <input
              autoFocus
              value={this.state.searchbarValue}
              onChange={(event) => this.inputSearchbarHandler(event)}
              className={classes.SearchInput} type="text" placeholder={searchPlaceholder} />
          </div>
        </div>
      ) : null;

    const valuesOutput = this.state.list.length > 0 ?
      this.state.list.map((item, index) => {

        // Get the action to be executed once the user selects a value from the dropdown.
        const onSelectHandler = this.props.inputChangeHandler ?
          // This is the generic input change handler for individual inputs.
          () => { dropdownClosed(); onSelect(null, this.props.inputId, item.id) } :
          // This is the input change handler for input fields that are part of a group of inputs.
          () => { onSelect(item.id, item.label, rowId) };

        return (
          <button key={index} className={classes.Value} autoFocus={(index === 0 && !searchBar) ? true : false}
            onClick={onSelectHandler}>
            <div className={classes.Label}>
              {item.label}
            </div>
          </button>
        );
      }) :
        (
          <div className={classes.Value}>
              <div className={classes.Label}>
                {searchPlaceholder}
              </div>
          </div>
        );

    return (
      <div className={classes.Dropdown} style={{ width: dropdownInlineStyle, top: dropdownTop, left: dropdownLeft }}>
        {search}
        <div className={classes.ValueWrapper} style={{ maxHeight: valueWrapperInlineStyle, minHeight: valueWrapperInlineStyle }}>
          {valuesOutput}
        </div>
      </div>
    );
  };

  render = () => {
    const { show, dropdownClosed, messageBox1, messageBox2 } = this.props;

    let dropdown = null;
    if (show) {
      dropdown = this.getValues();
    }

    return (
      <Aux>
        <Backdrop show={show} clicked={dropdownClosed} messageBox1={messageBox1} messageBox2={messageBox2} />
        {dropdown}
      </Aux>
    );
  };
}

const mapStateToProps = state => {
  const { messageBox1, messageBox2, translates } = state.redMain;
  return { messageBox1, messageBox2, translates };
};

export default connect(mapStateToProps)(Dropdown);
