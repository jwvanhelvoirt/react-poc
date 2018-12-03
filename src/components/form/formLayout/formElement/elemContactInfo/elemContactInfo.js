import React, { Component } from 'react';
import { connect } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import * as input from '../../../../../libs/constInputs';
import * as trans from '../../../../../libs/constTranslates';
import { storeDropdownHtml } from '../../../../../store/actions';
import Aux from '../../../../../hoc/auxiliary';
import Dropdown from '../../../../ui/dropdown/dropdown';
import MultiEntryCombiInput from '../genericElements/multiEntry/multiEntryCombiInput/multiEntryCombiInput';
import MultiEntryEntry from '../genericElements/multiEntry/multiEntryEntry/multiEntryEntry';
import MultiEntryWrapper from '../genericElements/multiEntry/multiEntryWrapper/multiEntryWrapper';

const contactId = 'refmedewerkers';
const contactManager = 'isbeheerde';
const contactName = 'naam';

class ContactInfo extends Component {

  constructor(props) {
    super(props);

    this.localData = {
      indexNew: -1
    };
  };

  onChange = (event, id, changeElement) => {
    const { changed, configInput } = this.props;
    let value = cloneDeep(configInput.value); // Value before the change, this is an object containing data for all entries.
    let triggerChangeHandler = true;

    switch (changeElement) {

      case contactManager:
      value = this.changeManager(event, value, id);
      break;

      case 'delete':
      delete value[id];
      break;

      case 'add':
      this.onDropdownShowAddContact(event);
      triggerChangeHandler = false;
      break;

      default:

    };

    // Trigger the inputChangedHandler method in the FormParser, which handles all changes.
    if (triggerChangeHandler) {
      changed(null, input.INPUT_CONTACT_INFO, value);
    }
  };

  changeManager = (event, value, id) => {
    // Change the value so none of the contacts are manager.
    Object.keys(value).map((item) => value[item][contactManager] = '0');

    // Now indicate the contact the user selected as manager.
    value[id][contactManager] = event.target.checked ? '1' : '0';

    return value;
  };

  onDropdownShowAddContact = (event) => {

    const dropdownAddContact = (
      <Dropdown
        values={this.props.employees}
        valuesIdLabel={{ id: 'id', label: 'naam' }}
        searchBar={true}
        searchType={'client'}
        onSelect={this.addContact}
        show={true}
        dropdownClosed={this.onDropdownCloseAddContact}
        mousePosX={event.clientX}
        mousePosY={event.clientY}
      />
    );

    this.props.storeDropdownHtml(dropdownAddContact);
  }

  onDropdownCloseAddContact = () => {
    this.props.storeDropdownHtml(null); // Remove the dropdown.
  };

  addContact = (id, name) => {
    this.props.storeDropdownHtml(null); // Remove the dropdown.

    const { changed, configInput } = this.props;

    // Add an empty contact with a negative id, so the backend knows it's a new entry.
    const object = {
      [contactId]: id,
      [contactManager]: '0',
      [contactName]: name
    };

    let value = cloneDeep(configInput.value); // Value before the change, this is an object containing data for all entries.
    value[this.localData.indexNew] = object; // Add this new entry to the existing entries.

    this.localData.indexNew = this.localData.indexNew - 1; // For a possible next new entry.

    changed(null, input.INPUT_CONTACT_INFO, value);
  };

  render = () => {
    const { configInput } = this.props;

    // All entries.
    const entries = Object.keys(configInput.value).map((item, index) => {
      const { isbeheerde, naam } = configInput.value[item];

      // Radio to select this entry as manager.
      const checkedRadio = parseInt(isbeheerde, 10);
      const radio = (
        <input type='radio' checked={checkedRadio} onChange={(event) => this.onChange(event, item, contactManager)} />
      );
      const contact = <MultiEntryCombiInput inputs={[radio, <div>{naam}</div>]}/>;

        const entryInput = [
            {
              line: [
                { input: contact, width: 'Flex100' }
              ]
            }
        ];

        return <MultiEntryEntry key={index} entryInput={entryInput} deleteAction={(event) => this.onChange(null, item, 'delete')} />;
    });

    const headerLabels = [
      { label: trans.KEY_CONTACT, width: 'Flex100' }
    ];

    const wrapper = (
      <MultiEntryWrapper height={configInput.maxHeight} labels={headerLabels} addAction={(event) => this.onChange(event, null, 'add')} entries={entries}/>
    );

    return (
      <Aux>
        {wrapper}
      </Aux>
    );

  };
}

const mapStateToProps = state => {
  const { functionCodes, employees } = state.redMain;
  return { functionCodes, employees };
};

const mapDispatchToProps = dispatch => {
  return {
    storeDropdownHtml: (dropdownHtml) => dispatch(storeDropdownHtml(dropdownHtml))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactInfo);
