import React from 'react';
import Row from './row/row';
import Label from '../../ui/label/label';
import * as trans from '../../../libs/constTranslates';
import classes from './rows.scss';

const rows = (props) => {
  const { listItems, selectedListItems, row, route, routeView, multiSelect, lookup, onClickItemHandler,
    toggleRowHandler, columnsVisible, currentUrl } = props;

  let listItemsHtml = (
    <div className={classes.NoResults}>
      <Label labelKey={trans.KEY_NO_RESULTS_FOUND} convertType={'propercase'} />
    </div>
  );

  if (listItems.length > 0) {
    // Process all listItems.
    listItemsHtml = listItems.map((listItem, index) => {
      return (
        <Row
          key={listItem.id}
          listItem={listItem}
          selectedListItems={selectedListItems}
          row={row}
          route={route}
          routeView={routeView}
          multiSelect={multiSelect}
          lookup={lookup}
          onClickItemHandler={onClickItemHandler}
          toggleRowHandler={toggleRowHandler}
          columnsVisible={columnsVisible}
          currentUrl={currentUrl}
        />
      );
    });
  }

  return (
    <div>{listItemsHtml}</div>
  );
}

export default rows;