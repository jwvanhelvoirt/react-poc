import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDisplayValue } from '../../../../../libs/generic';
import { callServer } from '../../../../../api/api';
import Select from '../../../../ui/select/select';

class ElemSelect extends Component {

  state = {
    options: []
  };

  componentWillMount = () => {
    // If applicable, fetch data source to show a list of options.
    const { configInput, dataOriginal } = this.props;
    const { optionsSource, elementConfig } = configInput;

    if (optionsSource) {
      if (optionsSource.property) {
        // Source comes from a property from the loaded entry.

        const options = dataOriginal[optionsSource.property].map((item) => {
          return { value: item[optionsSource.value], displayValue: item[optionsSource.displayValue] }
        });

        this.setState({ options });

      } else {
        // Source must be retrieved from the server.

        const magic = localStorage.getItem('magic');
        const submitData = { MAGIC: magic };
        const language = optionsSource.language ? this.props.language : '';

        callServer('put', 'call/' + optionsSource.url,
          (response) => this.successHandlerGetOptions(response),
          (error) => this.errorHandlerGetOptions(error), submitData, language);

      }
    } else {
      // Options are hardcoded in the config of the form.
      this.setState({ options: elementConfig.options });
    }

  };

  successHandlerGetOptions = (response) => {
    const { optionsSource } = this.props.configInput;

    const options = response.data.map((item) => {
      return { value: item[optionsSource.value], displayValue: item[optionsSource.displayValue] }
    });

    this.setState({ options });
  };

  errorHandlerGetOptions = (error) => {
    console.log(error);
  };

  render = () => {

    const { configInput, autoFocus, changed, translates, inputId } = this.props;
    const { value, convertDisplayValues, translateDisplayValues } = configInput;

    const options = this.state.options.map(option => {
      const displayValue = getDisplayValue(option.displayValue, convertDisplayValues, translateDisplayValues, translates);
      return {id: option.value, naam: displayValue };
    });

    return (
      <div style={{ height: '30px' }}>
        <Select
          inputChangeHandler={true}
          inputId={inputId}
          value={value}
          onChange={changed}
          autoFocus={autoFocus}
          options={options} optionId={'id'} optionLabel={'naam'} rowId={inputId}>
        </Select>
      </div>
    );

  }
}

const mapStateToProps = state => {
  const { language } = state.redMain;
  return { language };
};

export default connect(mapStateToProps)(ElemSelect);
