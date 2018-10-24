import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import * as icons from '../../../../libs/constIcons';
import * as trans from '../../../../libs/constTranslates';
import { getDisplayValue } from '../../../../libs/generic';
import { getViewActions } from '../../../../libs/views';
import Label from '../../../ui/label/label';
import Tooltip from '../../../ui/tooltip/tooltip';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../view.scss';

const actionBar = (props) => {
  const { viewConfig, _this } = props;
  const { filterOptions, showFilter, sortOptions, showSort, showActions, actions, showSearchbar, showRowActions } = viewConfig;
  const { selectedListItems, debounceFunction, searchbarValue } = _this.state;

  // Actions bar: Filtering.
  const showFilterAction = filterOptions && filterOptions.length > 0 && showFilter ? true : false;
  const filter = showFilterAction ?
    <div onClick={() => _this.onClickFilterHandler()} data-tip="React-tooltip" data-for={trans.KEY_FILTER_ACTION}>
      <FontAwesomeIcon icon={icons.ICON_FILTER} />
      <Tooltip id={trans.KEY_FILTER_ACTION}>
        <Label labelKey={trans.KEY_FILTER_ACTION} convertType={'propercase'} />
      </Tooltip>
    </div> :
    null;

  // Actions bar: Sorting.
  const showSortAction = sortOptions && sortOptions.options && sortOptions.options.length > 0 && showSort ? true : false;
  const sort = showSortAction ?
    <div onClick={() => _this.onClickSortHandler()} data-tip="React-tooltip" data-for={trans.KEY_SORT_ACTION}>
      <FontAwesomeIcon icon={icons.ICON_SORT} />
      <Tooltip id={trans.KEY_SORT_ACTION}>
        <Label labelKey={trans.KEY_SORT_ACTION} convertType={'propercase'} />
      </Tooltip>
    </div> :
    null;

  // Filtering and sorting overall.
  const filterSort = showFilterAction || showSortAction ? <div className={classes.FilterSort}>{filter}{sort}</div> : null;

  // Action bar: Actions.
  let actionsPrimaryOutput = null;
  let actionsMenuOutput = null;

  if (showActions) {

    // Function 'getViewActions' filters the actions array for the current context.
    const actionsPrimary = getViewActions(actions, 'showInBarPrimary', selectedListItems);
    if (actionsPrimary.length > 0) {
      actionsPrimaryOutput = (
        <div className={classes.ActionRowActions}>
          {
            actionsPrimary.map((action, index) => {

              // Calculate action classes. We can configure actions to show only on particular screen sizes.
              let arrayClassesAction = [];
              if (action.actionClasses) {
                arrayClassesAction = action.actionClasses.map((className) => {
                  return classes[className];
                });
              }
              const classesAction = arrayClassesAction.join(' ');

              // Check if this action contains subActions.
              const callback = action.subActions ?
                // SubActions: show a action menu with the subActions.
                (event) => _this.showBarMenuPrimary(event, action.subActions) :
                // No subActions: Fire the callback.
                () => action.callback(_this);

              return (
                <div key={index} className={classesAction} onClick={callback} data-tip="React-tooltip" data-for={action.id}>
                  <FontAwesomeIcon icon={action.labelIcon} />
                  <Tooltip id={action.id}>
                    <Label labelKey={action.tooltip} convertType={'propercase'} />
                  </Tooltip>
                </div>
              );
            })
          }
        </div>
      );
    }

    const actionsMenu = getViewActions(actions, 'showInBarMenu', selectedListItems);
    if (actionsMenu.length > 0) {
      actionsMenuOutput = (
        <div className={classes.ActionRowActions}>
          <div onClick={(event) => _this.showBarMenu(event)}>
            <FontAwesomeIcon icon={icons.ICON_ELLIPSIS_V} />
          </div>
      </div>
      );
    }

  }

  // Action bar: Searchbar.
  const classesCombinedSearchbar = [classes.Search, classes.Medium].join(' ');

  // The state variable 'debounceFunction' decides wether the debounce function (submitSearchHandler) can be called or not.
  // This is necessary, because after every key stroke in the search field, the state is updated and the render method runs again.
  const debounced = debounceFunction ? _.debounce(_this.submitSearchHandler, 800) : null; // TODO: WERKT DIT??? ZO JA, HOEVEN WE DE CALLBACKS NIET MEER DOOR TE GEVEN.
  const search = getDisplayValue(trans.KEY_SEARCH, 'propercase', true, _this.props.translates);

  let searchBar = null;
  if (showSearchbar) {
    searchBar = (
      <div className={classesCombinedSearchbar}>
        <div className={classes.SearchErase} onClick={() => _this.clearSearchbarHandler()}><FontAwesomeIcon icon={icons.ICON_TIMES_CIRCLE} /></div>
        <input
          value={searchbarValue}
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
      {searchBar}
      {filterSort}
      {actionsPrimaryOutput}
      {actionsMenuOutput}
    </div> :
    null;

  return(
    <Aux>{actionBarOverall}</Aux>
  );
};

export default actionBar;
