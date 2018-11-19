import React from 'react';
import TicketUpdate from './elemTicketUpdate/elemTicketUpdate';

const ticketUpdates = (props) => {

  const list = props.data.list.map((item, index) => <TicketUpdate key={index} update={item} />);

  return (
    <div>{list}</div>
  );

};

export default ticketUpdates;
