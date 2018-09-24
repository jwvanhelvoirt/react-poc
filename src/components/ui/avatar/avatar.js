import React from 'react';
import UserAvatar from 'react-user-avatar';

const avatar = (props) => {

  const { size, foto, name } = props;

  /*
  ES6 destructuring vs non-destructuring.

  const { size, foto, name } = props;

  versus

  const size = props.size;
  const foto = props.foto;
  const name = props.name;
  */

  let avatarSize = 48;
  if (size === 'AvatarMedium') {
    avatarSize = 32;
  } else if (size === 'AvatarSmall') {
    avatarSize = 24;
  }

  const nameAvatar = name ? name : '-';

  return (
    <UserAvatar size={avatarSize} name={nameAvatar} src={foto} color='#bbaa00' />
  );
};

export default avatar;
