import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../libs/constIcons';
import Avatar from '../../../ui/avatar/avatar';
import ToolbarIcon from './toolbarIcon/toolbarIcon';
import ActionMenu from '../../../view/actionMenu/actionMenu';
import Aux from '../../../../hoc/auxiliary';
import classes from './toolbarIcons.scss';

class ToolbarIcons extends Component {

  state = {
    mousePosX: 0, // Horizontal positioning of the action menu.
    mousePosY: 0, // Vertical postioning of the action menu.
    showMenu: false,
    showMenuType: '',
  }

  showPersonalMenu = (event) => {
    this.setState({ showMenu: true, showMenuType: 'showInPersonalMenu', mousePosX: event.clientX, mousePosY: event.clientY });
  };

  onPersonalMenuCloseHandler = () => {
    this.setState({ showMenu: false });
  };

  render = () => {
    let actionMenuPersonal = null;

    const links = this.props.navIcons.map((icon, index) => {
      let nav = null;
      if (icon.url) {
        nav = (
          <ToolbarIcon key={index} id={index} link={icon.url} label={icon.label}>
            <FontAwesomeIcon icon={icon.icon} />
          </ToolbarIcon>
        );

      } else if (icon.clicked) {
        nav = (
          <ToolbarIcon key={icon.index} id={icon.index} clicked={icon.clicked} label={icon.label}>
            <FontAwesomeIcon icon={icon.icon} />
          </ToolbarIcon>
        );
      } else if (icon.actions) {
        nav = this.props.userInfo ?
          <div key={index} className={classes.AvatarWrapper} onClick={(event) => this.showPersonalMenu(event)}>
            <Avatar size={'AvatarLarge'} foto={this.props.userInfo.foto} name={this.props.userInfo.naam} />

            <div className={classes.DropDownIconWrapper}>
              <div className={classes.DropDownIcon}>
                <FontAwesomeIcon icon={icons.ICON_SORT_DOWN} />
              </div>
            </div>


          </div> :
          null;

        actionMenuPersonal = (
          <ActionMenu
            actions={icon.actions}
            actionMenuHeader={icon.actionMenuHeader}
            subActions={null}
            show={true}
            showType={'showInPersonalMenu'}
            actionMenuClosed={this.onPersonalMenuCloseHandler}
            listItems={[]}
            selectedListItems={[]}
            mousePosX={this.state.mousePosX}
            mousePosY={this.state.mousePosY}
            _this={this}
          />
        );

      }
      return nav;
    });

    const actionMenu = this.state.showMenu ? actionMenuPersonal : null;

    return (
      <Aux>
        <ul className={classes.ToolbarIcons}>
          {links}
        </ul>
        {actionMenu}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { userInfo } = state.redMain;
  return { userInfo };
};

export default connect(mapStateToProps)(ToolbarIcons);
