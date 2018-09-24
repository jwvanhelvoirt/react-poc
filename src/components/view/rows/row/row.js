import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../../../ui/avatar/avatar';
import Timespan from '../../../ui/timespan/timespan';
import Aux from '../../../../hoc/auxiliary';
import classes from '../../../../scss/view.scss';

const row = (props) => {
  const { listItem, selectedListItems, row, route, routeView, multiSelect, lookup, onClickItemHandler,
    toggleRowHandler, columnsVisible, currentUrl } = props;

  // In case the listItem has been edited during this client session, it gets additional styling.
  const classesCombinedListItem = listItem.edit ? [classes.Row, classes.RowEdit].join(' ') : classes.Row;

  // Is it a radio or a checkbox?
  let classesCombinedSelected = null;
  if (selectedListItems.indexOf(listItem.id) ===  -1) {
    if (multiSelect) {
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone].join(' ');
    } else {
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.Radio].join(' ');
    }
  } else {
    if (multiSelect) {
      classesCombinedSelected = [classes.Fixed1, classes.RowSelectZone, classes.RowSelected].join(' ');
    } else {
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
  if (row && row.menu) {
    // Only if the row contains a click menu, we print a div in the row to align equally with the listItems.
    listItemsFixedMenu = <div className={classes.Fixed2}></div>;
  }

  // Fixed columns overall.
  const listItemsFixed = (
    <div className={classes.Fixed}>
      {listItemsFixedSelect}
      {listItemsFixedMenu}
    </div>
  );

  // Only onDoubleClick event in case of mulitple selection of rows and NOT a lookup context.
  const doubleClick = (multiSelect && !lookup) ? () => onClickItemHandler(listItem.id) : null;

  const listItemDiv = (
    <div className={classesCombinedListItem}
      onClick={(event) => toggleRowHandler(listItem.id)}
      onDoubleClick={doubleClick}>
      {listItemsFixed}
      <div className={classes.Flex}>
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

                  // listItemColumnContent = (
                  //   <Aux>
                  //     <div>
                  //       <span className={classes.smallFont}>KLM Health Services</span>
                  //       <span className={[classes.preSpace, classes.smallFont].join(' ')}>(</span>
                  //       <span className={classes.smallFont}>14747</span>
                  //       <span className={classes.smallFont}>)</span>
                  //     </div>
                  //     <div>
                  //       <span>KLM Health Services</span>
                  //       <span className={classes.preSpace}>(</span>
                  //       <span>14747</span>
                  //       <span>)</span>
                  //     </div>
                  //     <div>
                  //       <span className={classes.largeFont}>KLM Health Services</span>
                  //       <span className={[classes.preSpace, classes.largeFont].join(' ')}>(</span>
                  //       <span className={classes.largeFont}>14747</span>
                  //       <span className={classes.largeFont}>)</span>
                  //     </div>
                  //   </Aux>
                  // );

                  listItemColumnContent = column.content.lines.map((line, index) => {
                    // Loop through all parts of data to be printed on a single line.
                    const lineParts = line.lineData.map((part, i) => {
                      let additionalClasses = null;
                      if (part.classes) {
                        const arrayAdditionalClasses = part.classes.map((className) => {
                          return classes[className];
                        });
                        additionalClasses = arrayAdditionalClasses.join(' ');
                      }

                      switch (part.type) {
                        case 'prop':
                          return <span key={i} className={additionalClasses}>{listItem[part.value]}</span>;
                        default:
                          return <span key={i} className={additionalClasses}>{part.value}</span>;
                      }
                    });

                    return <div key={index}>{lineParts}</div>
                  });



                }
            };

            return <div key={index} className={classes[column.size]}>{listItemColumnContent}</div>;
          })
        }
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
