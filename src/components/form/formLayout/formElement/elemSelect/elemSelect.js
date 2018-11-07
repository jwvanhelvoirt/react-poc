import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDisplayValue } from '../../../../../libs/generic';
import { callServer } from '../../../../../api/api';

class ElemSelect extends Component {

  state = {
    options: []
  };

  componentWillMount = () => {
    // If applicable, fetch data source to show a list of options.
    const { optionsSource, elementConfig } = this.props.configInput;

    // const sourceOptions = this.props.configInput.optionsSource;
    if (optionsSource) {
      const magic = localStorage.getItem('magic');
      const submitData = { MAGIC: magic };
      const language = optionsSource.language ? this.props.language : '';

      callServer('put', optionsSource.url,
        (response) => this.successHandlerGetOptions(response),
        (error) => this.errorHandlerGetOptions(error), submitData, language);
    } else {
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
    const { configInput, inputClasses, autoFocus, changed, keyUp, translates } = this.props;
    const { value, convertDisplayValues, translateDisplayValues } = configInput;

    return (
      <select
        className={inputClasses.join(' ')}
        value={value}
        autoFocus={autoFocus}
        onChange={changed}
        onKeyUp={keyUp}>
        {this.state.options.map(option => {
          const displayValue = getDisplayValue(option.displayValue, convertDisplayValues, translateDisplayValues, translates);
          return <option key={option.value} value={option.value}>
            {displayValue}
          </option>
        })}
      </select>
    );
  }
}

const mapStateToProps = state => {
  const { language } = state.redMain;
  return { language };
};

export default connect(mapStateToProps)(ElemSelect);
