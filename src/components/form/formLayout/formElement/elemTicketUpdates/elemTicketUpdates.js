import React from 'react';
import classes from './elemTicketUpdates.scss'
import TicketUpdate from './elemTicketUpdate/elemTicketUpdate';
import Aux from '../../../../../hoc/auxiliary';

const ticketUpdates = (props) => {

  const { data } = props;

  console.log(data);

  const list = props.data.list.map((item, index) => <TicketUpdate key={index} update={item} />);

  return (
    <div>{list}</div>
  );

};

export default ticketUpdates;
