import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../libs/constIcons';
import { getColumnClasses } from '../../../../libs/views';
import Label from '../../../ui/label/label';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../view.scss';

const headerBar = (props) => {
  const { viewConfig, _this } = props;
  const { row, multiSelect, routeView, columns, showRowHeader } = viewConfig;

  // Header bar: fixed columns selectable.
  const classesCombinedHeaderSelected = _this.state.headerSelected ?
    [classes.Fixed1, classes.HeaderSelectZone, classes.HeaderSelected].join(' ') :
    [classes.Fixed1, classes.HeaderSelectZone].join(' ');

  let columnsFixedSelect = null;
  if (row && row.selectable && !(_this.props.route && _this.props.route.length > 0 && routeView !== false)) {
    multiSelect ?
      // Only if the row is selectable and multiselect is enabled, we print the 'checkbox' to select/deselect all listItems.
      columnsFixedSelect = <div className={classesCombinedHeaderSelected} onClick={(event) => _this.toggleAllRows(event)}></div> :
      columnsFixedSelect = <div className={classes.Fixed1}></div>
  }

  // Header bar: fixed columns menu.
  let columnsFixedMenu = <div className={classes.Fixed0}></div>;
  if (row && row.menu) {
    // Only if the row contains a click menu, we print a div in the header to align equally with the listItems.
    columnsFixedMenu = <div className={classes.Fixed2}></div>;
  }

  // Header bar: fixed columns overall.
  const columnsFixed =
    <div className={classes.Fixed}>
      {columnsFixedSelect}
      {columnsFixedMenu}
    </div>

  // Header bar: columns.
  const classesCombinedHeaders = [classes.Headers, classes.FlexRow].join(' ');
  let columnHeaders = null;
  const columnsVisible = columns.filter((column) => column.show); // TODO : Willen we dit straks nog, als de Screen classes erin zitten?
  if (columnsVisible.length > 0) {
    columnHeaders = (
      <div className={classes.Flex}>
        <div className={classesCombinedHeaders}>
        {
          columnsVisible.map((column, index) => {
            let sortIcon = <FontAwesomeIcon icon='sort' />;
            if (column.sortOn === _this.state.sortedColumn) {
              // In case user clicked on the sortcolumn, we display a different sort icon depending on the current sort order.
              sortIcon = _this.state.sortOrder === 1 ? <FontAwesomeIcon icon={icons.ICON_SORT_UP} /> : <FontAwesomeIcon icon={icons.ICON_SORT_DOWN} />;
            }
            const sortColumn = column.sort ? <span className={classes.Sort}>{sortIcon}</span> : null;
            const labelColumn = <Label labelKey={column.label} convertType={'propercase'} />;
            const onColumn = column.sort ? () => _this.sortOnColumn(column.sortOn) : null;

            const classesDefault = column.sort ?
              [classes.Header, classes[column.size], classes.HeaderSortable] : 
              [classes.Header, classes[column.size]];
            const columnClasses = getColumnClasses(column, classesDefault, classes);

            return(
              <div key={index} onClick={onColumn} className={columnClasses}>
                {labelColumn}
                {sortColumn}
              </div>
            );
          })
        }
        </div>
      </div>


    );
  }

  // Header bar overall.
  const headerBarOverall = showRowHeader ?
    <div className={classes.HeaderRow}>
      {columnsFixed}
      {columnHeaders}
    </div> :
    null;

  return(
    <Aux>{headerBarOverall}</Aux>
  );
}

export default headerBar;
