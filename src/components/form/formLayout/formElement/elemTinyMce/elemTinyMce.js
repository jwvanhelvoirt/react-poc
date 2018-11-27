import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import * as input from '../../../../../libs/constInputs';

const handleEditorChange = (content, changed) => {
  // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
  changed(null, input.INPUT_TASK_UPDATE_DESCRIPTION, content);
}

const tinyMce = (props) => {

  return (
    <Editor
      init={{
        menubar: false,
        plugins: 'charmap, code, emoticons, fullscreen, image, insertdatetime, link, lists, media, print, searchreplace, table, textcolor colorpicker',
        toolbar: 'undo redo | styleselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | forecolor backcolor fontselect fontsizeselect removeformat link unlink | searchreplace media charmap emoticons insertdatetime code fullscreen print image'
      }}
      value={props.configInput.value}
      onEditorChange={(content) => handleEditorChange(content, props.changed)}
    />
  );
};

export default tinyMce;
