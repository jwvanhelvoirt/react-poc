import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../../libs/constIcons';
import * as input from '../../../../../libs/constInputs';
import Aux from '../../../../../hoc/auxiliary';
import Label from '../../../../ui/label/label';
import classes from './elemCommunicationInfo.scss';
import classesForm from '../formElement.scss';

const communicationTypeValue = 'naam';
const communicationTypeRef = 'refteltype';
const communicationTypeDefault = 'standaard';

class CommunicationInfo extends Component {

  constructor(props) {
    super(props);

    this.localData = {
      indexNew: -1
    };
  };

  onChange = (event, id, changeElement) => {
    const { changed, configInput } = this.props;
    let value = cloneDeep(configInput.value);

    switch (changeElement) {
      case communicationTypeDefault:
        value[id][communicationTypeDefault] = event.target.checked ? '1' : '0';
        break;
      case communicationTypeValue:
        value[id][communicationTypeValue] = event.target.value;
        break;
      case communicationTypeRef:
        value[id][communicationTypeRef] = event.target.value;
        break;
      case 'delete':
        delete value[id];
        break;
      case 'add':
        value = this.addCommunicationType(value);
        break;
      default:
    };

    changed(null, input.INPUT_COMMUNICATION_INFO, value);
  };

  addCommunicationType = (value) => {
    const object = {
      [communicationTypeValue]: '',
      [communicationTypeRef]: '',
      [communicationTypeDefault]: '0'
    }
    value[this.localData.indexNew] = object;

    this.localData.indexNew = this.localData.indexNew - 1;

    return value;
  };

  render = () => {
    const { changed, configInput } = this.props;

    const communicationInfoHeader = (
      <div className={classes.Header}>
        <div className={[classesForm.Label, classes.Label].join(' ')}>
          <Label labelKey={configInput.label} convertType={'propercase'} />
        </div>
        <button className={classes.Add} onClick={(event) => this.onChange(null, null, 'add')}>
          <FontAwesomeIcon icon={['far', icons.ICON_PLUS]} />
        </button>
      </div>
    );

    const communicationInfoEntries = Object.keys(configInput.value).map((item, index) => {
      const { standaard, naam, refteltype } = configInput.value[item];

      const checked = parseInt(standaard);
      const checkbox = (
        <input type='checkbox' checked={checked} className={classes.Checkbox}
          onChange={(event) => this.onChange(event, item, communicationTypeDefault)} />
      );

      const select = (
        <select
          className={[classes.Select, classesForm.InputElement].join(' ')}
          value={refteltype}
          onChange={(event) => this.onChange(event, item, communicationTypeRef)}>
          {this.props.communicationTypes.map(option => {
            return <option key={option.id} value={option.id}>
              {option.naam}
            </option>
          })}
        </select>
      );

      const input = (
        <input
          className={[classes.Input, classesForm.InputElement].join(' ')}
          type={'text'}
          value={naam}
          onChange={(event) => this.onChange(event, item, communicationTypeValue)}
        />
      );

      const deleteEntry = (
        <button className={classes.Delete} onClick={(event) => this.onChange(null, item, 'delete')}>
          <FontAwesomeIcon icon={['far', icons.ICON_MINUS]} />
        </button>
      );

      return (
        <div key={index} className={classes.Entry}>
          {checkbox}
          {select}
          {input}
          {deleteEntry}
        </div>
      );

    });

    const communicationInfoEntriesWrapper = <div className={classes.EntriesWrapper}>{communicationInfoEntries}</div>

    return (
      <Aux>
        {communicationInfoHeader}
        {communicationInfoEntriesWrapper}
      </Aux>
    );
  };
}

const mapStateToProps = state => {
  const { communicationTypes } = state.redMain;
  return { communicationTypes };
};

export default connect(mapStateToProps)(CommunicationInfo);
