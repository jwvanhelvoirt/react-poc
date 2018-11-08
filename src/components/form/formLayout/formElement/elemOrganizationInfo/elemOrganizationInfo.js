import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as icons from '../../../../../libs/constIcons';
import * as input from '../../../../../libs/constInputs';
import * as trans from '../../../../../libs/constTranslates';
import Aux from '../../../../../hoc/auxiliary';
import MultiEntryCombiInput from '../genericElements/multiEntry/multiEntryCombiInput/multiEntryCombiInput';
import MultiEntryEntry from '../genericElements/multiEntry/multiEntryEntry/multiEntryEntry';
import MultiEntryWrapper from '../genericElements/multiEntry/multiEntryWrapper/multiEntryWrapper';
import classesFormElement from '../formElement.scss';

const organizationMain = 'hoofd';
const organizationFunction = 'functienaam';
const organizationFunctionCode = 'reffunctiecode';
const organizationLeft = 'vertrokken';
const organizationLeftOn = 'vertrokkenper';
const organizationSecretary = 'secretaresse';
const organizationDepartment = 'afdeling';
const organizationLocationCode = 'locatiecode';

class CommunicationInfo extends Component {

  constructor(props) {
    super(props);

    this.localData = {
      indexNew: -1
    };
  };

  onChange = (event, id, changeElement) => {

    const { changed, configInput } = this.props;
    let value = cloneDeep(configInput.value); // Value before the change, this is an object containing data for all entries.

    switch (changeElement) {

      case organizationMain:
      value = this.changeMainOrganization(event, value, id);
      break;

      case organizationFunction:
      value[id][organizationFunction] = event.target.value;
      break;

      case organizationFunctionCode:
      value[id][organizationFunctionCode] = event.target.value;
      break;

      case organizationLeft:
      value[id][organizationLeft] = event.target.checked ? '1' : '0';
      break;

      case organizationLeftOn:
      value[id][organizationLeftOn] = event.target.value;
      break;

      case organizationSecretary:
      value[id][organizationSecretary] = event.target.value;
      break;

      case organizationDepartment:
      value[id][organizationDepartment] = event.target.value;
      break;

      case organizationLocationCode:
      value[id][organizationLocationCode] = event.target.value;
      break;

      case 'delete':
      delete value[id];
      break;

      case 'add':
      value = this.addOrganization(value);
      break;

      default:

    };

    // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
    changed(null, input.INPUT_ORGANIZATION_INFO, value);
  };

  changeMainOrganization = (event, value, id) => {
    // Change the value so no organization is related as main organization.
    Object.keys(value).map((item) => value[item][organizationMain] = '0');

    // Now relate the organization the user selected as main organization.
    value[id][organizationMain] = event.target.checked ? '1' : '0';

    return value;
  };

  addOrganization = (value) => {
    console.log('addOrganization');
    // // Add an empty communication type with a negative id, so the backend knows it's a new entry.
    // const object = {
    //   [communicationTypeValue]: '',
    //   [communicationTypeRef]: '8', // id of 'Email generally'
    //   [communicationTypeDefault]: '0'
    // }
    // value[this.localData.indexNew] = object; // Add this new entry to the existing entries.
    //
    // this.localData.indexNew = this.localData.indexNew - 1; // For a possible next new entry.
    //
    return value;
  };

  render = () => {
    const { configInput } = this.props;

    // All entries.
    const entries = Object.keys(configInput.value).map((item, index) => {

      const { naam, hoofd, functienaam, reffunctiecode, vertrokken, refniveau4,
        secretaresse, afdeling, locatiecode } = configInput.value[item];

      let { vertrokkenper } = configInput.value[item];

        // Radio to select this entry as default organization.
        const checkedRadio = parseInt(hoofd, 10);
        const radio = (
          <input type='radio' checked={checkedRadio} onChange={(event) => this.onChange(event, item, organizationMain)} />
        );
        const organization = <MultiEntryCombiInput inputs={[radio, <div>{naam}</div>]}/>;

        const functionInput = (
          <input
            className={classesFormElement.InputElement}
            type={'text'}
            value={functienaam}
            onChange={(event) => this.onChange(event, item, organizationFunction)}
          />
        );

        // Dropdown to select a particular type. The entire list of function types is stored in the store and injected as a prop.
        const functionCode = (
          <select
            className={classesFormElement.InputElement}
            value={reffunctiecode}
            onChange={(event) => this.onChange(event, item, organizationFunctionCode)}>
            {this.props.functionCodes.map(option => {
              return <option key={option.id} value={option.id}>
                {option.naam}
              </option>
            })}
          </select>
        );

        // Radio to select this entry as default organization.
        vertrokkenper = vertrokkenper ? vertrokkenper : '';
        const checkedBox = parseInt(vertrokken, 10);
        const checkbox = (
          <input type='checkbox' checked={checkedBox} onChange={(event) => this.onChange(event, item, organizationLeft)} />
        );
        const leftOn = (
          <input
            className={classesFormElement.InputElement}
            type={'text'}
            value={vertrokkenper}
            onChange={(event) => this.onChange(event, item, organizationLeftOn)}
          />
        );
        const leftOrganization = <MultiEntryCombiInput inputs={[checkbox, leftOn]}/>;


        const secretaryInput = (
          <input
            className={classesFormElement.InputElement}
            type={'text'}
            value={secretaresse}
            onChange={(event) => this.onChange(event, item, organizationSecretary)}
          />
        );

        const departmentInput = (
          <input
            className={classesFormElement.InputElement}
            type={'text'}
            value={afdeling}
            onChange={(event) => this.onChange(event, item, organizationDepartment)}
          />
        );

        const locationCodeInput = (
          <input
            className={classesFormElement.InputElement}
            type={'text'}
            value={locatiecode}
            onChange={(event) => this.onChange(event, item, organizationLocationCode)}
          />
        );

        const entryInput = [
            {
              line: [
                { input: organization, width: 'Flex40' },
                { input: functionInput, width: 'Flex20' },
                { input: functionCode, width: 'Flex20' },
                { input: leftOrganization, width: 'Flex20' }
              ]
            },
            {
              line: [
                { input: secretaryInput, width: 'Flex40' },
                { input: departmentInput, width: 'Flex20' },
                { input: locationCodeInput, width: 'Flex40' }
              ]
            }
        ];

        return <MultiEntryEntry key={index} entryInput={entryInput} deleteAction={(event) => this.onChange(null, item, 'delete')} />;

    });

    const headerLabels = [
      { label: trans.KEY_ORGANISATION, width: 'Flex40' },
      { label: trans.KEY_FUNCTION, width: 'Flex20' },
      { label: trans.KEY_TYPE, width: 'Flex20' },
      { label: trans.KEY_END_EMPLOYMENT, width: 'Flex20' }
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
  const { functionCodes } = state.redMain;
  return { functionCodes };
};

export default connect(mapStateToProps)(CommunicationInfo);
