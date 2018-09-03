import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as types from '../../../../store/Actions';
import { withRouter } from 'react-router-dom';
import { getDisplayValue } from '../../../../libs/generic';
import classes from './ToolbarSearch.scss';

class ToolbarSearch extends Component {
  state = {
    debounceFunction: true,
    searchbarValue: ""
  }

  /**
   * @brief   Submits the search to the server.
   */
  submitSearchHandler(_this) {
    _this.props.onSearch(_this.state.searchbarValue);

    // If we're already on the search results page, we don't navigate to it.
    if (_this.props.history.location.pathname !== '/search') {
      _this.props.history.push('/search?query=' + _this.state.searchbarValue);
    }
    _this.setState({ debounceFunction: true });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  clearSearchbarHandler() {
    this.setState({ searchbarValue: "", debounceFunction: true }, () => { this.submitSearchHandler(this); });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  inputSearchbarHandler(event) {
    console.log('inputSearchbarHandler');
    this.setState({ searchbarValue: event.target.value, debounceFunction: false });
  };

  render() {
    const classesCombinedSearchbar = [classes.Search, classes.Medium].join(' ');

    // The state variable 'debounceFunction' decides wether the debounce function (submitSearchHandler) can be called or not.
    // This is necessary, because after every key stroke in the search field, the state is updated and the render method runs again.
    const debounced = this.state.debounceFunction ? _.debounce(this.submitSearchHandler, 500) : null;
    const search = getDisplayValue('keySearch', 'propercase', true, this.props.translates);

    return (
      <div className={classesCombinedSearchbar}>
        <div onClick={() => this.clearSearchbarHandler()}><FontAwesomeIcon icon='times-circle' /></div>
        <input
          value={this.state.searchbarValue}
          onChange={(event) => {
            this.inputSearchbarHandler(event);
            debounced ? debounced(this) : null;
          }}
          className={classes.SearchInput} type="text" placeholder={search} />
      </div>
    )
  }

}

const mapStateToProps = state => {
  return {
    translates: state.redMain.transTranslates
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onSearch: (searchbarValue) => dispatch( {type: types.SEARCHTEXT_OVERALL_STORE, searchbarValue } )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolbarSearch));
