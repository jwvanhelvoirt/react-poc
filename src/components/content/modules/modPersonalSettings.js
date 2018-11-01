import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { storeLanguage } from '../../../store/actions';
import Aux from '../../../hoc/auxiliary';
import Spinner from '../../ui/spinners/spinner/spinner';
import FormParser from '../../parsers/formParser/formParser';
import formConfig from '../../../config/forms/configFormUserSettings';
import { callServer } from '../../../api/api';
import classes from './mod.scss';

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

  // Call to the server to fetch user settings.
  loadUserSettings = () => {
    callServer('get', '/' + formConfig.url + '/read', (response) => this.successGetHandler(response), this.errorGetHandler);
  };

  // User settings fetched successfully.
  successGetHandler = (response) => {
    this.setState({
      id: response.data[0].id,
      loading: false,
      userSettings: response.data[0]
    });
  };

  // User settings NOT fetched successfully.
  errorGetHandler = (error) => {
    this.setState({ loading: false });
  };

  // Close the user settings.
  onCloseHandler = () => {
    this.props.history.goBack();
  };

  // User settings successfully updated in the database.
  onSubmitHandler = (response) => {
    this.props.storeLanguage(response.data.language);
    this.props.history.goBack();
  };

  render = () => {
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
        <Aux><div className={classes.Wrapper}>Personal settings</div></Aux>
    );
	};

}

const mapDispatchToProps = dispatch => {
  return {
    storeLanguage: (language) => dispatch(storeLanguage(language))
  }
}

export default connect(null, mapDispatchToProps)(withRouter(ModPersonalSettings));
