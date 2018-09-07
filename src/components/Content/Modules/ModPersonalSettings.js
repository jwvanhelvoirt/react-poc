import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import Aux from '../../../hoc/auxiliary';
import Spinner from '../../ui/spinner/spinner';
import FormParser from '../../parsers/formParser/formParser';
import formConfig from '../../../config/forms/configFormUserSettings';
import { callServer } from '../../../api/api';

class ModPersonalSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      id: null,
      loading: true,
      userSettings: null
    };

      this.loadUserSettings();
  };

  loadUserSettings = () => {
    callServer('get', '/' + formConfig.url + '/read', (response) => this.successGetHandler(response), this.errorGetHandler);
  }

  successGetHandler = (response) => {
    this.setState({
      id: response.data[0]._id,
      loading: false,
      userSettings: response.data[0]
    });
  };

  errorGetHandler = (error) => {
    this.setState({ loading: false });
  };

  onCloseHandler = () => {
    this.props.history.goBack();
  }

  onSubmitHandler = (response) => {
    this.props.storeLanguage(response.data.language);
    this.props.history.goBack();
  }

  render () {
    let userSettings =
      <FormParser
        configForm={formConfig}
        data={this.state.userSettings}
        onCancel={() => this.onCloseHandler(true)}
        onSubmit={this.onSubmitHandler}
        id={this.state.id}
        modal={false}
      />

    if (this.state.loading) {
      userSettings = <Spinner />;
    }

    return (
        <Aux>{userSettings}</Aux>
    );
	}

}

const mapDispatchToProps = dispatch => {
  return {
    storeLanguage: (language) => dispatch( {type: types.TRANS_LANGUAGE_STORE, language } )
  }
}

export default connect(null, mapDispatchToProps)(withRouter(ModPersonalSettings));
