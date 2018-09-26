import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactTooltip from 'react-tooltip';
import _ from 'lodash';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';
import { getDisplayValue } from '../../../../libs/generic';
import Label from '../../../ui/label/label';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../view.scss';

const actionBar = (props) => {
  const { viewConfig, _this } = props;
  const { filterOptions, showFilter, sortOptions, showSort, showActions, actions, showSearchbar, showRowActions } = viewConfig;

  // Actions bar: Filtering.
  const showFilterAction = filterOptions && filterOptions.length > 0 && showFilter ? true : false;
  const filter = showFilterAction ?
    <div onClick={() => _this.onClickFilterHandler()} data-tip="React-tooltip" data-for={trans.KEY_FILTER_ACTION}>
      <FontAwesomeIcon icon={icons.ICON_FILTER} />
      <ReactTooltip id={trans.KEY_FILTER_ACTION} place="bottom" type="dark" effect="solid">
        <Label labelKey={trans.KEY_FILTER_ACTION} convertType={'propercase'} />
      </ReactTooltip>
    </div> :
    null;

  // Actions bar: Sorting.
  const showSortAction = sortOptions && sortOptions.options && sortOptions.options.length > 0 && showSort ? true : false;
  const sort = showSortAction ?
    <div onClick={() => _this.onClickSortHandler()} data-tip="React-tooltip" data-for={trans.KEY_SORT_ACTION}>
      <FontAwesomeIcon icon={icons.ICON_SORT} />
      <ReactTooltip id={trans.KEY_SORT_ACTION} place="bottom" type="dark" effect="solid">
        <Label labelKey={trans.KEY_SORT_ACTION} convertType={'propercase'} />
      </ReactTooltip>
    </div> :
    null;

  // Filtering and sorting overall.
  const filterSort = showFilterAction || showSortAction ? <div className={classes.FilterSort}>{filter}{sort}</div> : null;

  // Action bar: Actions.
  let actionsOutput = null;
  if (showActions) {
    const actionsPrimary = actions.filter((action) => action.showInBarPrimary);
    if (actionsPrimary.length > 0) {
      actionsOutput = (
        <div className={classes.ActionRowActions}>
          {
            actionsPrimary.map((action, index) => {
              return <div key={index} onClick={() => action.callback(_this)} data-tip="React-tooltip" data-for={action.id}>
                <FontAwesomeIcon icon={action.labelIcon} />
                <ReactTooltip id={action.id} place="bottom" type="dark" effect="solid">
                  <Label labelKey={action.tooltip} convertType={'propercase'} />
                </ReactTooltip>
              </div>
            })
          }
        </div>
      );
    }
  }

  // Action bar: Searchbar.
  const classesCombinedSearchbar = [classes.Search, classes.Medium].join(' ');

  // The state variable 'debounceFunction' decides wether the debounce function (submitSearchHandler) can be called or not.
  // This is necessary, because after every key stroke in the search field, the state is updated and the render method runs again.
  const debounced = _this.state.debounceFunction ? _.debounce(_this.submitSearchHandler, 800) : null; // TODO: WERKT DIT??? ZO JA, HOEVEN WE DE CALLBACKS NIET MEER DOOR TE GEVEN.
  const search = getDisplayValue(trans.KEY_SEARCH, 'propercase', true, _this.props.translates);

  let searchBar = null;
  if (showSearchbar) {
    searchBar = (
      <div className={classesCombinedSearchbar}>
        <div onClick={() => _this.clearSearchbarHandler()}><FontAwesomeIcon icon={icons.ICON_TIMES_CIRCLE} /></div>
        <input
          value={_this.state.searchbarValue}
          onChange={(event) => {
            _this.inputSearchbarHandler(event);
            if (debounced) {
              debounced(_this)
            }
          }}
          autoFocus
          className={classes.SearchInput} type="text" placeholder={search} />
      </div>
    );
  }

  // Action bar overall.
  const actionBarOverall = showRowActions ?
    <div className={classes.ActionRow}>
      {filterSort}
      {actionsOutput}
      {searchBar}
    </div> :
    null;

  return(
    <Aux>{actionBarOverall}</Aux>
  );
}

export default actionBar;
