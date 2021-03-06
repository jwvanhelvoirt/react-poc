import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { connect } from 'react-redux';
import { onSearch } from '../../../../store/actions';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';
import { withRouter } from 'react-router-dom';
import { getDisplayValue } from '../../../../libs/generic';
import classes from './toolbarSearch.scss';

class ToolbarSearch extends Component {
  state = {
    debounceFunction: true,
    searchbarValue: ""
  };

  /**
   * @brief   Submits the search to the server.
   */
  submitSearchHandler = (_this) => {
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
  clearSearchbarHandler = () => {
    this.setState({ searchbarValue: "", debounceFunction: true }, () => { this.submitSearchHandler(this); });
  };

  /**
   * @brief   Updates the state for the search value.
   */
  inputSearchbarHandler = (event) => {
    this.setState({ searchbarValue: event.target.value, debounceFunction: false });
  };

  render = () => {

    // The state variable 'debounceFunction' decides wether the debounce function (submitSearchHandler) can be called or not.
    // This is necessary, because after every key stroke in the search field, the state is updated and the render method runs again.
    const debounced = this.state.debounceFunction ? _.debounce(this.submitSearchHandler, 500) : null;
    const search = getDisplayValue(trans.KEY_SEARCH, 'propercase', true, this.props.translates);

    return (
      <div className={classes.Search}>
        <div onClick={() => this.clearSearchbarHandler()}><FontAwesomeIcon icon={['far', icons.ICON_TIMES_CIRCLE]} /></div>
        <input
          value={this.state.searchbarValue}
          onChange={(event) => {
            this.inputSearchbarHandler(event);
            if (debounced) {
              debounced(this)
            }
          }}
          className={classes.SearchInput} type="text" placeholder={search} />
      </div>
    )
  };

}

const mapStateToProps = state => {
  const { translates } = state.redMain;
  return { translates };
};

const mapDispatchToProps = dispatch => {
  return {
    onSearch: (searchbarValue) => dispatch(onSearch(searchbarValue))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolbarSearch));
