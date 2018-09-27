import React from 'react';
import Row from './row/row';
import Label from '../../ui/label/label';
import * as trans from '../../../libs/constTranslates';
import classes from './rows.scss';

const rows = (props) => {
  const { viewConfig, _this } = props;
  const { listItems } = _this.state;

  let listItemsHtml = (
    <div className={classes.NoResults}>
      <Label labelKey={trans.KEY_NO_RESULTS_FOUND} convertType={'propercase'} />
    </div>
  );

  if (listItems.length > 0) {
    // Process all listItems.
    listItemsHtml = listItems.map((listItem, index) => {
      return <Row key={index} viewConfig={viewConfig} _this={_this} listItem={listItem} />;
    });
  }

  return (
    <div>{listItemsHtml}</div>
  );
}

export default rows;
