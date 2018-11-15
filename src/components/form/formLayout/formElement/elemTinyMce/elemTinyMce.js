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
      init={{ plugins: 'link table' }}
      value={props.configInput.value}
      onEditorChange={(content) => handleEditorChange(content, props.changed)}
    />
  );

};

export default tinyMce;
