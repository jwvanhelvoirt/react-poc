import React from 'react';
import Moment from 'react-moment';
import { Editor } from '@tinymce/tinymce-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../../../libs/constIcons';
// import Aux from '../../../../../../hoc/auxiliary';
// import { callServer } from '../../../../../../api/api';
import { downloadAttachment } from '../../../../../../libs/generic';
import classes from './elemTicketUpdate.scss'

const ticketUpdate = (props) => {

  const { ks_naam, description, datumtijd, document, by_support } = props.update;

  const attachments = document.map((item, index) => {
    return (
      <div key={index} className={classes.Attachment} onClick={() => downloadAttachment(item.id)}>
        <div className={classes.AttachmentIcon}>
          <FontAwesomeIcon icon={['far', icons.ICON_PAPERCLIP]} />
        </div>
        <div className={classes.AttachmentFilename}>{item.naam + '.' + item.extension}</div>
      </div>
    );
  });

  const attachmentsContainer = document.length > 0 ?
  (
    <div className={classes.AttachmentsWrapper}>
      {attachments}
    </div>
  ) : null;

  const updateClass = by_support === '1' ?
    (document.length > 0 ? classes.UpdateBySupport : [classes.UpdateBySupport, classes.NoAttachements].join(' ')) :
    (document.length > 0 ? classes.Update : [classes.Update, classes.NoAttachements].join(' '))

  return (
    <div className={classes.UpdateWrapper}>
      <div className={updateClass}>
        <div className={classes.UpdateDetails}>
          <div className={classes.UpdateDetailsStatus}>{ks_naam}</div>
          <div className={classes.UpdateDetailsDateTime}><Moment format="DD-MM-YYYY HH:mm">{datumtijd}</Moment></div>
        </div>
        <div className={classes.UpdateContent}>
          <Editor init={{ menubar: false, toolbar: false }} disabled={true} value={description} />
        </div>
      </div>
      {attachmentsContainer}
    </div>
  );

};

export default ticketUpdate;
