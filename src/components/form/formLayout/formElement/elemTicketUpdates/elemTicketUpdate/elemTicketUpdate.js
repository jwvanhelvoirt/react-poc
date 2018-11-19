import React from 'react';
import Moment from 'react-moment';
import { Editor } from '@tinymce/tinymce-react';
import classes from './elemTicketUpdate.scss'

const ticketUpdate = (props) => {

  const { ks_naam, description, datumtijd, document, by_support } = props.update;

  // console.log(ks_naam);
  // console.log(description);
  // console.log(datumtijd);
  // console.log(document);
  // console.log(by_support);
  // console.log('-----------');

  return (
    <div className={classes.Update}>
      <div className={classes.UpdateDetails}>
        <div className={classes.UpdateDetailsStatus}>{ks_naam}</div>
        <div className={classes.UpdateDetailsDateTime}><Moment format="DD-MM-YYYY HH:mm">{datumtijd}</Moment></div>
      </div>
      <div className={classes.UpdateContent}>
        <Editor init={{ menubar: false, toolbar: false}} disabled={true} value={description} />
      </div>
    </div>
  );

};

export default ticketUpdate;
