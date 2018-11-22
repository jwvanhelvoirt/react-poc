import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { callServer } from '../../../../../api/api';
import { downloadAttachment } from '../../../../../libs/generic';
import * as icons from '../../../../../libs/constIcons';
import Spinner from '../../../../ui/spinners/spinner/spinner';
import MultiEntryWrapper from '../genericElements/multiEntry/multiEntryWrapper/multiEntryWrapper';
import MultiEntryEntry from '../genericElements/multiEntry/multiEntryEntry/multiEntryEntry';
import Aux from '../../../../../hoc/auxiliary';
import classes from './elemFileUpload.scss';

class FileUpload extends Component {

  constructor(props) {
    super(props);

    this.state = {
      files: [
        // {name: 'jw.jpg', id: '1'},
        // {name: 'frank.jpg', id: '2'}
      ],
      filesUploading: false
    };
  };

  onChange = (event, id, changeElement) => {

    const { files } = this.state;
    const { changed, configInput, inputId } = this.props;
    const value = null;

    switch (changeElement) {

      case 'delete':
      // Delete the applicable entry from the state, so the component gets re-rendered.
      const filesUpdated = files.filter((file) => file.id !== id.id);
      this.setState({ files: filesUpdated });

      // AND remove the applicable value from the values array in configInput.value.
      let value = configInput.value.filter((val) => val !== id.id);

      // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
      changed(null, inputId, value);
      break;

      default:

    };

  };

  fileSelectedHandler = (event, inputId) => {

    const { refniveau5, reftaak } = this.props.data;
    const { files } = event.target;

    const formData = new FormData();

    formData.append('reftaak', reftaak);
    formData.append('refniveau5', refniveau5);
    formData.append('MAGIC', localStorage.getItem('magic'));

    // Attach files
    for (var i = 0; i < files.length; i++) {
      formData.append('upload[]', files[i], files[i].name);
    }

    this.setState({ filesUploading: true });

    callServer('post', 'portal/call/api.document.uploadDocument',
      (response)=> this.successHandlerFileUpload(response), (error) => this.errorHandlerFileUpload, formData);
  };

  successHandlerFileUpload = (response) => {

    const { configInput, inputId, changed } = this.props;
    const filesUpdated = cloneDeep(this.state.files);
    const configInputValueUpdated = cloneDeep(configInput.value);

    response.data.forEach((file) => {
      filesUpdated.push({ name: file.naam + '.' + file.extension, id: file.id });
      configInputValueUpdated.push(file.id);
    });

    // Update the state to re-render the component to display the selected files.
    this.setState({ files: filesUpdated, filesUploading: false });

    // Add the new IDs to the values array in configInput.value.
    changed(null, inputId, configInputValueUpdated);
  };

  errorHandlerFileUpload = (error) => {
    console.log(error);
    this.setState({ filesUploading: false });
  };

  render = () => {

    const { configInput, inputClasses } = this.props;
    const { files, filesUploading } = this.state;

    // All files.
    const entries = files.map((file, index) => { // Entries are printed from state.files

      const filename = (
        <div className={classes.Attachment} onClick={() => downloadAttachment(file.id)}>
          <div className={classes.AttachmentIcon}>
            <FontAwesomeIcon icon={['far', icons.ICON_PAPERCLIP]} />
          </div>
          <div className={classes.AttachmentFilename}>{file.name}</div>
        </div>
      );

      const entryInput = [
          {
            line: [
              { input: filename, width: 'Flex100' }
            ]
          }
      ];

      return <MultiEntryEntry key={index} entryInput={entryInput} deleteAction={(event) => this.onChange(null, file, 'delete')} />;

    });

    const headerLabels = [
      { label: configInput.label, width: 'Flex100' }
    ];

    const wrapper = (
      <MultiEntryWrapper height={configInput.maxHeight} labels={headerLabels} addAction={() => this.fileInput.click()} entries={entries}/>
    );

    const spinner = filesUploading ? <Spinner /> : null;

    return (
      <Aux>
        <input className={classes.FileUpload} type='file' multiple={true}
          onChange={(event) => this.fileSelectedHandler(event, this.props.inputId)}
          ref={fileInput => this.fileInput = fileInput}
        />
        {wrapper}
        {spinner}
      </Aux>
    );

  };

}

export default FileUpload;
