import React from 'react';
import UserAvatar from 'react-user-avatar';

const avatar = (props) => {

  const { size, foto, name } = props;

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
