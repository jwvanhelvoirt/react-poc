import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as input from '../../../libs/constInputs';
import { callServer } from '../../../api/api';
import FormParser from '../../parsers/formParser/formParser';
import formConfig from '../../../config/forms/configFormSupportDetails';
import Aux from '../../../hoc/auxiliary';

class ModSupportDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      configForm: formConfig,
      dataOriginal: null,
      loadedListItem: null,
      id: null
    }
  };

  componentWillMount = () => {
    // Initialize the route data in the store.
    // this.props.storeRoute('');

    const { id } = this.props.match.params; // id on the url.

    // In this follow-up screen we need information from the record selected in the previous screen. Fetch it!
    const params = { MAGIC: localStorage.getItem('magic'), reftaak: id };
    callServer('put', this.state.configForm.url, this.successGetSingleHandler, this.errorGetSingleHandler, params);
  };

  successGetSingleHandler = (response) => {
    const { naam, nr } = response.data.taak;

    this.setState({
      dataOriginal: response.data,
      loadedListItem: {
        [input.INPUT_TASK_NO]: nr,
        [input.INPUT_TASK_NAME]: naam,
        [input.INPUT_TASK_UPDATE_DESCRIPTION]: '',
      },
      id: this.props.match.params
    })
  };

  errorGetSingleHandler = (error) => {
    console.log(error);
  };

  onSubmitHandler = () => {
    this.props.history.goBack();
  };

  onCloseHandler = () => {
    this.props.history.goBack();
  };

  render = () => {
    const { configForm, loadedListItem, id, dataOriginal } = this.state;

    const form = loadedListItem ?
      (
        <FormParser
          configForm={configForm}
          data={loadedListItem}
          dataOriginal={dataOriginal}
          onCancel={this.onCloseHandler}
          onSubmit={this.onSubmitHandler}
          id={id}
          modal={false}
        />
      ) : null;

    return (
      <Aux>
        {form}
        {this.props.dropdownHtml}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { dropdownHtml } = state.redMain;
  return { dropdownHtml };
};

export default withRouter(connect(mapStateToProps)(ModSupportDetails));
