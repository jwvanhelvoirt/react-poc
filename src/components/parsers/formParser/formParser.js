/**
* @brief   Returns all HTML to display a form to show a new or existing record.
* @params  configForm   Object containing all configuration of the form. Is also updates data after every change and submits this data.
* @params  data         Object containing the data of the selected item, only for display in the form.
*                       In case of a new record it contains the default values as configured in the form configuration.
* @params  id           Sting containing the id of the record which data is currently displayed in the form.
*                       In case this id is undefined, it's a creation of new data.
* @params  onCancel     Callback to close the form without saving.
* @params  onSubmit     Callback to submit the form data to the server.
*/

import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import * as types from '../../../store/actions';
import Aux from '../../../hoc/auxiliary';
import Input from '../../ui/input/input';
import MessageBox from '../../ui/messageBox/messageBox';
import * as trans from '../../../libs/translates';
import { callServer } from '../../../api/api';

class Form extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showModalLookup: false,
      configForm: cloneDeep(this.props.configForm),
      isValidForm: false
    };

    this.localData = {
      modalClass: '',
      messageTitle: [],
      messageType: '',
      messageContent: '',
      messageButtons: '',
      callBackOk: null,
      callBackCancel: null
    };
  };

  componentWillMount = () => {
    // state property 'configForm' contains default values, update these with the values of the selected entry and update state.

    const clone = cloneDeep(this.state.configForm);
    const updatedFormInputs = clone.inputs;

    const arrayRecords = Object.keys(this.props.data);
    for (let index in arrayRecords) {
      let updatedFormElement = {
        ...updatedFormInputs[arrayRecords[index]]
      }

      // Get the initial value.
      if (updatedFormElement.valueLocalStorage && localStorage.getItem(updatedFormElement.valueLocalStorage)) {
        if (updatedFormElement.elementType === 'triggerFunctionCheckbox') {
          updatedFormElement.value = 1;
        } else {
          updatedFormElement.value = localStorage.getItem(updatedFormElement.valueLocalStorage);
        }
      } else {
        updatedFormElement.value = this.props.data[arrayRecords[index]];
      }

      // Check for validity.
      if (Array.isArray(updatedFormElement.value)) {
        if (updatedFormElement.validation && updatedFormElement.value.length > 0) {
          updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
          if (!updatedFormElement.valid) {
            updatedFormElement.touched = true;
          }
        }
      } else {
        if (updatedFormElement.validation && updatedFormElement.value.trim() !== '') {
          updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
          if (!updatedFormElement.valid) {
            updatedFormElement.touched = true;
          }
        }
      }

      updatedFormInputs[arrayRecords[index]] = updatedFormElement;
    }

    clone.inputs = updatedFormInputs;
    this.setState({ configForm: clone });
  };

  checkValidity = (value, rules) => {
    const isArray = Array.isArray(value);

    let isValid = true;

    if (rules) {
      if (isArray) {
        if (rules.required) {
          isValid = value.length > 0 && isValid;
        }
      } else {
        if (rules.required) {
          isValid = value.trim() !== '' && isValid;
        }
      }

      if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
      }

      if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
      }
    }

    return isValid;
  };

  inputChangedHandler = (event, id) => {
    // Set the state 'formTouched' in the store to 'true'.
    this.props.touchForm(); // Info the onCloseHandler in the ViewParser (parent component) needs to know when closing the form.

    const clone = cloneDeep(this.state.configForm);
    const updatedFormInputs = clone.inputs;

    const updatedFormElement = updatedFormInputs[id];

    // Update the value.
    updatedFormElement.value = event.target.type === 'checkbox' ?
      (event.target.checked ? 1 : 0) : // Backend doesn't understand boolean value (true/false), only a 1 for true and a 0 for false.
      event.target.value;

    // Check for validation.
    if (updatedFormElement.validation) {
      updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
    }

    // Is the entire form valid? (For enabling submit button yes or no).
    const isValidForm = this.isValidForm(updatedFormInputs);

    clone.inputs = updatedFormInputs;
    this.setState({ configForm: clone, isValidForm });
  };

  isValidForm = (updatedFormInputs) => {
    let isValidForm = true;
    for (let id in updatedFormInputs) {
      if (updatedFormInputs[id].validation) {
        isValidForm = this.checkValidity(updatedFormInputs[id].value, updatedFormInputs[id].validation) && isValidForm;
      }
    }
    return isValidForm;
  };

  submitHandler = (event) => {
    event.preventDefault();

    const submitData = {};
    for (let id in this.state.configForm.inputs) {
      submitData[id] = this.state.configForm.inputs[id].value;
    }

    let url = '';
    if (this.props.submitUrl) {
      url = this.props.submitUrl;
    } else {
      url = this.props.id ?
      '/' + this.state.configForm.url + '/update/' + this.props.id :
      '/' + this.state.configForm.url + '/create';
    }

    const type = this.props.id ? 'put' : 'post';

    // Store submitData in store for processing in other components in general.
    this.props.storeFormSubmitData(submitData);

    callServer(type, url, this.successSubmitHandler, this.errorSubmitHandler, submitData);
  };

  successSubmitHandler = response => this.props.onSubmit(response);

  errorSubmitHandler = (error) => {
    if (this.props.onError) {
      this.props.onError(error);
    } else {
      console.log(error);
    }
  };

  showModal = (modalState, modalClass, title, type, content, buttons,
    callBackOk = () => this.onModalLookupSubmitHandler(),
    callBackCancel = () => this.onModalLookupCloseHandler()) => {

    this.localData.modalClass = modalClass;
    this.localData.messageTitle = title;
    this.localData.messageType = type;
    this.localData.messageContent = content;
    this.localData.messageButtons = buttons;
    this.localData.callBackCancel = callBackCancel;
    this.localData.callBackOk = callBackOk;
    this.setState({ [modalState]: true });
  };

  removeMultiValueItem = (fieldId, valueId) => {
    const clone = cloneDeep(this.state.configForm);
    const updatedFormInputs = clone.inputs;

    let updatedFormElement = updatedFormInputs[fieldId];

    const updatedValue = updatedFormInputs[fieldId].value.filter((item) => item.id !== valueId);
    updatedFormElement.value = updatedValue;

    // Check for validity.
    if (updatedFormElement.validation) {
      updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
      if (!updatedFormElement.valid) {
        updatedFormElement.touched = true;
      }
    }

    updatedFormInputs[fieldId] = updatedFormElement;

    // Is the entire form valid? (For enabling the submit button).
    const isValidForm = this.isValidForm(updatedFormInputs);

    clone.inputs = updatedFormInputs;
    this.setState({ configForm: clone, isValidForm });
  };

  onModalLookupSubmitHandler = () => {
    // Now we have to grab the selected records and append them to the applicable input in configForm.

    // lookupInputId : input to which the selected entries should be appended.
    // lookupListItemsSelected: array of IDs of the selected listItems.
    // lookupListItems: array of objects of listItems, which contains all data but also the non-selected listItems.
    const { lookupInputId, lookupListItemsSelected, lookupListItems } = this.props;

    // Filter the selected items from the lookupListItems array.
    const listItemsSelected = lookupListItems.filter((item) => {
      return lookupListItemsSelected.includes(item.id);
    });

    // Prevent appending selected listItems that were appended before.
    const listItemsToAppend = listItemsSelected.filter((item) => {
      let append = true;
      this.state.configForm.inputs[lookupInputId].value.forEach((current) => {
        append = current.id === item.id ? false : append;
      });
      return append;
    });

    // If any, append the selected listItems to the applicable input and change the state so the component ges re-rendered.
    if (listItemsToAppend.length > 0) {
      const clone = cloneDeep(this.state.configForm);
      clone.inputs[lookupInputId].value = [
        ...clone.inputs[lookupInputId].value,
        ...listItemsToAppend
      ];
      clone.inputs[lookupInputId].touched = true; // input has been touched.

      // Update the valid property.
      clone.inputs[lookupInputId].valid = this.checkValidity(clone.inputs[lookupInputId].value, clone.inputs[lookupInputId].validation);

      // Is the entire form valid? (For enabling submit button yes or no).
      const isValidForm = this.isValidForm(clone.inputs);

      // Update the state to re-render the component.
      this.setState({ configForm: clone, isValidForm });

      // Info the onCloseHandler in the ViewParser (parent component) needs to know when closing the form.
      this.props.touchForm();
    }

    // Close the lookup selection.
    this.onModalLookupCloseHandler();
  };

  onModalLookupCloseHandler = () => {
    this.setState({ showModalLookup: false });
    this.emptyLookupDataInStore(); // Clean up the store.
  };

  emptyLookupDataInStore = () => {
    this.props.storeLookupListItems([]);
    this.props.storeLookupListItemsSelected([]);
    this.props.storeLookupInputId('');
  };

  render = () => {
    const { modalClass, messageButtons, messageTitle, messageType, messageContent, callBackOk, callBackCancel} = this.localData;
    const { inputs, title, titleAlign, titleIcon, size, buttons, headerSize, noCreate, okButtonLabel,
      cancelButtonLabel, buttonsClass, msgFailedSubmit } = this.state.configForm;

    let lookupModal = null;
    if (this.state.showModalLookup) {
      lookupModal = (
        <MessageBox modalClass={modalClass} messageTitle={messageTitle} type={messageType}
          messageContent={messageContent} buttons={messageButtons}
          callBackOk={callBackOk} callBackCancel={callBackCancel} modal={true}
        />
      );
    }

    let formElementsArray = [];
    for (let inputId in inputs) {
      if (inputId !== 'id' && inputId !== '__v') { // These are system fields returned by Mongo, we don't want them to be displayed.
        formElementsArray.push({
          inputId,
          configInput: inputs[inputId]
        });
      }
    }

    const content =
      <div>
        {formElementsArray.map(formElement => {
            return (
              (
                <Input
                  key={formElement.inputId}
                  inputId={formElement.inputId}
                  changed={(event) => this.inputChangedHandler(event, formElement.inputId)}
                  configInput={formElement.configInput}
                  showModal={(modalState, modalClass, title, type, content, buttons, callBackOk, callBackCancel) =>
                    this.showModal(modalState, modalClass, title, type, content, buttons, callBackOk, callBackCancel)}
                  removeMultiValueItem={(fieldId, valueId) => this.removeMultiValueItem(fieldId, valueId)}
                  configForm={this.state.configForm}
                  />
              )
            )
        })}
      </div>;

    // Title of the form.
    const titleForm = (this.props.id || noCreate) ? [title] : [trans.KEY_NEW, title];

    return (
      <Aux>
        <MessageBox
          modalClass={size}
          messageTitle={titleForm}
          type='info'
          titleIcon={titleIcon}
          titleAlign={titleAlign}
          messageContent={content}
          buttons={buttons}
          buttonsClass={buttonsClass}
          okButtonLabel={okButtonLabel}
          cancelButtonLabel={cancelButtonLabel}
          formIsValid={this.state.isValidForm}
          headerSize={headerSize}
          modal={this.props.modal}
          msgFailedSubmit={msgFailedSubmit}
          callBackOk={this.submitHandler}
          callBackCancel={this.props.onCancel}
        />
        {lookupModal}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  return {
    lookupListItems: state.redMain.lookupListItems,
    lookupListItemsSelected: state.redMain.lookupListItemsSelected,
    lookupInputId: state.redMain.lookupInputId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    storeFormSubmitData: (formSubmitData) => dispatch( {type: types.FORM_SUBMIT_DATA_STORE, formSubmitData } ),
    storeLookupListItems: (lookupListItems) => dispatch( {type: types.LOOKUP_LIST_ITEMS_STORE, lookupListItems } ),
    storeLookupListItemsSelected: (lookupListItemsSelected) => dispatch( {type: types.LOOKUP_LIST_ITEMS_SELECTED_STORE, lookupListItemsSelected } ),
    storeLookupInputId: (lookupInputId) => dispatch( {type: types.LOOKUP_INPUT_ID_STORE, lookupInputId } ),
    touchForm: () => dispatch( {type: types.FORM_TOUCH } )
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);

/*
Wat hebben we voor een IO aan configuratie nodig?

id
titel > beter zou zijn om de titel op te halen uit een vertaaltabel via het id
breedte
hoogte
disabled (true/false) om info in IO in zijn geheel readonly te maken
valideren (true/false) om IO te valideren bij opslag
waarschuwing bij sluiten (true/false) gebruiker sluit IO af zonder te saven, wil je dan een waarschuwing of niet
print status info (true/false) denk aan  het printen van algemene info als 'datum aangemaakt', 'aangemaakt door', 'datum laatste wijziging', 'laatste wijziging door'.
onload > callback functie nadat de IO geladen is.
onsubmit > callback functie na een submit/save van de IO
onclose > callback functie na sluiten van de IO zonder te submitten/saven

acties >	nu hebben we predefined grijs (sluiten), groen (submit) en rood (annuleren). Je kunt denken aan een action bar met meerdere acties of acties met sub acties.
je zou ook op centraal niveau acties kunnen definiëren voor acties die in meerdere IO's voorkomen en daarvanuit de IO definitie kunnen verwijzen.
id
titel > beter zou zijn om de titel op te halen uit een vertaaltabel via het id
icon > fontawsome
edit gerelateerd > (true/false) actie alleen beschikbaar voor gebruikers met edit rechten
onclick > callback functie als je op de actie klikt

inputzones > dit zouden flex containers moeten zijn om de input in te plaatsen, verder uitdenken

input >
id
titel > beter zou zijn om de titel op te halen uit een vertaaltabel via het id
type >
text (label_width, field_width, maxinputsize)
textarea (rows, maxinputsize)
radio (optionsperrow, refresh)
checkbox  (optionsperrow, refresh)
listbox (multiple, size, refresh)
div > can be manipulated via JS function
date
time
datetime
hide > (true/false) to hide the field unconditionally
disabled (true/false) om de waarde van het veld niet wijzigbaar te maken
focus (true/false) om focus op het veld te zetten als de IO op het scherm staat
action > callback als je veld verlaat (text/textarea) of waarde aanpast (radio, checkbox)
repeatblock > verder uitwerken, met een plusje voeg je een nieuwe regel toe
*/
