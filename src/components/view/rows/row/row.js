import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../libs/constIcons';
import { getViewActions, getColumnClasses } from '../../../../libs/views';
import Avatar from '../../../ui/avatar/avatar';
import Timespan from '../../../ui/timespan/timespan';
import RowHoverIcon from './rowHoverIcon/rowHoverIcon';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../view.scss';

const row = (props) => {
  const { viewConfig, _this, listItem } = props;
  const { row, routeView, multiSelect, columns, actions } = viewConfig;
  const { route, lookup } = _this.props;
  const { selectedListItems } = _this.state;
  const currentUrl = _this.props.match.url;
  const columnsVisible = columns.filter((column) => column.show); // TODO : Willen we dit straks nog, als de Screen classes erin zitten?

  // In case the listItem has been edited during this client session, it gets additional styling.
  const classesCombinedListItem = listItem.edit ? [classes.Row, classes.RowEdit].join(' ') : classes.Row;

  // Is it a radio or a checkbox?
  let classesCombinedSelected = null;
  if (selectedListItems.indexOf(listItem.id) ===  -1) {
    // Non-selected.
    if (multiSelect) {
      // Checkbox.
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone].join(' ');
    } else {
      // Radio.
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.Radio].join(' ');
    }
  } else {
    // Selected.
    if (multiSelect) {
      // Checkbox.
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.RowSelected].join(' ');
    } else {
      // Radio.
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.RowSelected, classes.Radio].join(' ');
    }
  }

  let listItemsFixedSelect = null;
  if (row && row.selectable && !(route && route.length > 0 && routeView !== false)) {
    // Only if the row is selectable, we print the 'checkbox' to select/deselect a listItems or 'radio' to select an item.
    listItemsFixedSelect = <div className={classesCombinedSelected}></div>;
  }

  // Fixed columns menu.
  let listItemsFixedMenu = <div className={classes.Fixed0}></div>;
  let rightMouseClickMenu = null;
  if (row && row.menu) {
    const classesDropDown = [classes.Fixed2, classes.DropDownIcon].join(' ');
    // Only if the row contains a click menu, we print a div in the row to align equally with the listItems.
    listItemsFixedMenu = (
      <div className={classesDropDown} onClick={(event) => _this.showRowMenu(event, listItem.id)}>
        <FontAwesomeIcon icon={icons.ICON_ANGLE_DOWN} />
      </div>
    );
    rightMouseClickMenu = (event) => _this.showRowMenu(event, listItem.id);
  }

  // Fixed columns overall.
  const listItemsFixed = (
    <div className={classes.Fixed}>
      {listItemsFixedSelect}
      {listItemsFixedMenu}
    </div>
  );

  // Only onDoubleClick event in case of mulitple selection of rows and NOT a lookup context.
  const doubleClick = (multiSelect && !lookup) ? () => _this.onClickItemHandler(listItem.id) : null;

  // Hover actions.
  let actionsHoverOutput = null;
  if (actions) {
    const actionsHover = getViewActions(actions, 'showOnRowHover', selectedListItems, _this);
    actionsHoverOutput = actionsHover.map((action, index) =>
      <RowHoverIcon key={index} index={index.toString()} action={action} _this={_this} id={listItem.id} />);
  }

  const listItemDiv = (
    <div className={classesCombinedListItem}
      onClick={(event) => _this.toggleRowHandler(listItem.id)}
      onDoubleClick={doubleClick}
      onContextMenu={rightMouseClickMenu}>
      {listItemsFixed}

      <div className={classes.Flex}>
        <div className={classes.FlexRow}>
          {
            columnsVisible.map((column, index) => {

              let listItemColumnContent = null;
              switch (column.contentType) {
                case 'avatar':
                  listItemColumnContent = <Avatar size={column.size} foto={listItem[column.content]} name={listItem[column.avatarName]} />
                  break;
                case 'timespan':
                  listItemColumnContent = <Timespan size={column.size} start={listItem[column.data.start]} end={listItem[column.data.end]} />;
                  break;
                default:
                  if (typeof column.content === 'string') {
                    // Printing a single attribute.
                    listItemColumnContent = listItem[column.content];
                  } else {
                    // Printing concatenated attributes or multiple lines.

                    // Loop through all lines.
                    listItemColumnContent = column.content.lines.map((line, index) => {

                      // Loop through all parts of data to be printed on a single line.
                      const lineParts = line.lineData.map((part, index) => {
                        let additionalClasses = null;
                        if (part.classes) {
                          const arrayAdditionalClasses = part.classes.map((className) => {
                            return classes[className];
                          });
                          additionalClasses = arrayAdditionalClasses.join(' ');
                        }

                        switch (part.type) {
                          case 'prop':
                            return <span key={index} className={additionalClasses}>{listItem[part.value]}</span>;
                          default:
                            return <span key={index} className={additionalClasses}>{part.value}</span>;
                        }
                      });

                      return <div key={index}>{lineParts}</div>
                    });

                  }
              };

              const columnClasses = getColumnClasses(column, [classes[column.size]], classes);
              return <div key={index} className={columnClasses}>{listItemColumnContent}</div>;
            })
          }
        </div>
        <div className={[classes.FlexRow, classes.RowHover].join(' ')}>
          {actionsHoverOutput}
        </div>
      </div>

    </div>
  );

  let listItemPrint = <Aux>{listItemDiv}</Aux>;
  // Check if we should display a new screen when clicking on a row.
  if (route && route.length > 0 && routeView !== false) {
    listItemPrint = (
      <Link to={currentUrl + '/' + route + '/' + listItem.id}>
        {listItemDiv}
      </Link>
    );
  }

  return(
    <Aux>{listItemPrint}</Aux>
  );
}

export default row;
