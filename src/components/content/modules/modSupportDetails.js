import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as input from '../../../libs/constInputs';
import * as trans from '../../../libs/constTranslates';
import { callServer } from '../../../api/api';
import FormParser from '../../parsers/formParser/formParser';
import formConfig from '../../../config/forms/configFormSupportDetails';
import Breadcrumb from '../../navigation/breadcrumb/breadcrumb';
import Aux from '../../../hoc/auxiliary';
import classesScreen from '../../parsers/screenParser/screenParser.scss';

class ModSupportDetails extends Component {

  constructor(props) {
    super(props);

    this.state = {
      configForm: formConfig,
      dataOriginal: null,
      loadedListItem: null
    }
  };

  componentWillMount = () => {
    // Initialize the route data in the store.
    // this.props.storeRoute('');

    const { id } = this.props.match.params; // id on the url.

    // In this follow-up screen we need information from the record selected in the previous screen. Fetch it!
    const params = { MAGIC: localStorage.getItem('magic'), reftaak: id };
    callServer('put', this.state.configForm.url + '.get', this.successGetSingleHandler, this.errorGetSingleHandler, params);
  };

  successGetSingleHandler = (response) => {
    const { naam, nr, id, reftaakprioriteit, refniveau5 } = response.data.taak;

    const status = response.data.status.length === 1 ? response.data.status[0].id : '';

    this.setState({
      dataOriginal: response.data,
      loadedListItem: {
        [input.INPUT_TASK_NO]: nr,
        [input.INPUT_TASK_NAME]: naam,
        [input.INPUT_TASK_UPDATE_DESCRIPTION]: '',
        [input.INPUT_TASK_STATUS]: status,
        [input.INPUT_TASK_PROJECT]: refniveau5,
        [input.INPUT_TASK_PRIORITY]: reftaakprioriteit,
        [input.INPUT_TASK_ID]: id,
        [input.INPUT_TASK_ATTACHMENTS]: [],
        [input.INPUT_TASK_LIST]: response.data.list
      },
      id: this.props.match.params
    });

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
    const { configForm, loadedListItem, dataOriginal } = this.state;

    const form = loadedListItem ?
      (
        <FormParser
          configForm={configForm}
          data={loadedListItem}
          dataOriginal={dataOriginal}
          onCancel={() => this.onCloseHandler(true)}
          onSubmit={this.onSubmitHandler}
          id={null}
          modal={false}
        />
      ) : null;

    return (
      <Aux>
          <div className={classesScreen.PaneWrapper}>
            <div className={classesScreen.Pane}>
              <div>
                <Breadcrumb followUpScreenData={null} breadcrumb={trans.KEY_DETAILS} />
                {form}
              </div>
            </div>
          </div>
        {this.props.dropdownHtml}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { dropdownHtml, formTouched } = state.redMain;
  return { dropdownHtml, formTouched };
};

export default withRouter(connect(mapStateToProps)(ModSupportDetails));
