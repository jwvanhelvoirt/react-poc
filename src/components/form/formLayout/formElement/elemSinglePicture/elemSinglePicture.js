import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../../libs/constIcons';
import { getBase64 } from '../../../../../libs/generic';
import Aux from '../../../../../hoc/auxiliary';
import classes from './elemSinglePicture.scss';

class SinglePicture extends Component {

  fileSelectedHandler = (event, id) => {
    getBase64(event.target.files[0])
    .then((result) => {
        // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
        this.props.changed(null, id, result);
    });
  };

  fileRemoveHandler = (id) => {
    this.props.changed(null, id, ''); // Removes the image.
  };

  render = () => {

    let emptyString = this.props.configForm.inputs[this.props.configInput.useIfEmpty].value;
    emptyString = emptyString ? emptyString.substr(0, 1) : '-';

    const image = this.props.configInput.value ?
      <img src={this.props.configInput.value} alt='' /> :
      <div className={classes.Empty}>
        {emptyString}
      </div>;

    return (
      <Aux>
        <input className={classes.FileUpload} type='file' 
          onChange={(event) => this.fileSelectedHandler(event, this.props.inputId)}
          ref={fileInput => this.fileInput = fileInput}
        />
        <div className={classes.Wrapper}>
          <button className={classes.Delete} onClick={() => this.fileRemoveHandler(this.props.inputId)}>
            <FontAwesomeIcon icon={['far', icons.ICON_TIMES]} />
          </button>
          <button className={classes.Image} onClick={() => this.fileInput.click()}>
            {image}
          </button>
        </div>
      </Aux>
    );
  };

}

export default SinglePicture;
