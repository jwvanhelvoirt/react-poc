import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import * as input from '../../../../../libs/constInputs';
import Aux from '../../../../../hoc/auxiliary';
import MultiEntryCombiInput from '../genericElements/multiEntry/multiEntryCombiInput/multiEntryCombiInput';
import MultiEntryEntry from '../genericElements/multiEntry/multiEntryEntry/multiEntryEntry';
import MultiEntryWrapper from '../genericElements/multiEntry/multiEntryWrapper/multiEntryWrapper';
import classesFormElement from '../formElement.scss';

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
    // Changes can be:
    // 1. (De)select an entry as default.
    // 2. Change the communication type.
    // 3. Change the value.
    // 4. Delete an entry.
    // 5. Add an entry.

    const { changed, configInput } = this.props;
    let value = cloneDeep(configInput.value); // Value before the change, this is an object containing data for all entries.

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

    // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
    changed(null, input.INPUT_COMMUNICATION_INFO, value);
  };

  addCommunicationType = (value) => {
    // Add an empty communication type with a negative id, so the backend knows it's a new entry.
    const object = {
      [communicationTypeValue]: '',
      [communicationTypeRef]: '8', // id of 'Email generally'
      [communicationTypeDefault]: '0'
    };

    value[this.localData.indexNew] = object; // Add this new entry to the existing entries.

    this.localData.indexNew = this.localData.indexNew - 1; // For a possible next new entry.

    return value;
  };

  render = () => {
    const { configInput } = this.props;

    // All entries.
    const entries = Object.keys(configInput.value).map((item, index) => {
      const { standaard, naam, refteltype } = configInput.value[item];

      // Checkbox to (de)select this entry as default.
      const checked = parseInt(standaard, 10);
      const checkbox = (
        <input type='checkbox' checked={checked} onChange={(event) => this.onChange(event, item, communicationTypeDefault)} />
      );

      // Dropdown to select a particular communication type. The entire list of communication types is stored in the store and injected as a prop.
      const select = (
        <select
          className={classesFormElement.InputElement}
          value={refteltype}
          onChange={(event) => this.onChange(event, item, communicationTypeRef)}>
          {this.props.communicationTypes.map(option => {
            return (
              <option key={option.id} value={option.id}>
                {option.naam}
              </option>
            );
          })}
        </select>
      );

      // We combine the select and the dropdown in one element.
      const communicationType = <MultiEntryCombiInput inputs={[checkbox, select]}/>;

      // The input where user can type the value.
      const input = (
        <input
          className={classesFormElement.InputElement}
          type={'text'}
          value={naam}
          onChange={(event) => this.onChange(event, item, communicationTypeValue)}
        />
      );

      const entryInput = [
          {
            line: [
              { input: communicationType, width: 'Flex40' },
              { input: input, width: 'Flex60' }
            ]
          }
      ];

      return <MultiEntryEntry key={index} entryInput={entryInput} deleteAction={(event) => this.onChange(null, item, 'delete')} />;

    });

    const headerLabels = [
      { label: configInput.label, width: 'Flex100' }
    ];

    const wrapper = (
      <MultiEntryWrapper height={configInput.maxHeight} labels={headerLabels} addAction={(event) => this.onChange(null, null, 'add')} entries={entries}/>
    );

    return (
      <Aux>
        {wrapper}
      </Aux>
    );

  };
}

const mapStateToProps = state => {
  const { communicationTypes } = state.redMain;
  return { communicationTypes };
};

export default connect(mapStateToProps)(CommunicationInfo);
