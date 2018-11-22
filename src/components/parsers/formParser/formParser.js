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
import { storeFormSubmitData, storeLookupListItems, storeLookupListItemsSelected, storeLookupInputId,
  touchedForm } from '../../../store/actions';
import Aux from '../../../hoc/auxiliary';
// import FormElement from '../../form/formElement/formElement';
import FormLayout from '../../form/formLayout/formLayout';
import MessageBox from '../../ui/messageBox/messageBox';
import * as inputAttrib from '../../../libs/constInputs';
import * as trans from '../../../libs/constTranslates';
import { assignObject, isEqual, leftString } from '../../../libs/generic';
import { convertInitialDataFromArrayToObject } from '../../../libs/forms';
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
      focusButton: '',
      callBackOk: null,
      callBackCancel: null
    };
  };

  componentWillMount = () => {

    // state property 'configForm' contains default values, update these with the values of the selected entry and update state.
    const clone = cloneDeep(this.state.configForm);
    const updatedFormInputs = clone.inputs;
    const arrayIndexInputs = Object.keys(this.state.configForm.inputs).sort();

    arrayIndexInputs.forEach((input, index) => {
      let updatedFormElement = {
        ...updatedFormInputs[input]
      };

      // Get the initial value.
      if (updatedFormElement.valueLocalStorage && localStorage.getItem(updatedFormElement.valueLocalStorage)) {
        if (updatedFormElement.elementType === 'singleCheckbox') {
          updatedFormElement.value = 1;
        } else {
          updatedFormElement.value = localStorage.getItem(updatedFormElement.valueLocalStorage);
        }
      } else {
        let inputValue = this.props.data[input];
        let attributes = [];

        switch (updatedFormElement.elementType) {

          case 'componentCommunicationInfo':
          if (this.props.id) { // Only for existing entries.
            attributes = ['standaard', 'refteltype', 'naam'];
            inputValue = convertInitialDataFromArrayToObject(this.props.data, inputAttrib.INPUT_COMMUNICATION_INFO, attributes);
          }
          break;

          case 'componentOrganizationInfo':
          if (this.props.id) { // Only for existing entries.
            attributes = ['naam', 'hoofd', 'functienaam', 'reffunctiecode', 'vertrokken', 'vertrokkenper', 'refniveau4',
              'secretaresse', 'afdeling', 'locatiecode'];
            inputValue = convertInitialDataFromArrayToObject(this.props.data, inputAttrib.INPUT_ORGANIZATION_INFO, attributes);
          }
          break;

          default:
          if (this.props.id && input.indexOf('.', 0) >= 0) { // Get value of nested objects only for existing entries.
            inputValue = this.props.data[leftString(input, '.')];

            const arrayObject = input.split('.');
            arrayObject.forEach((item, index) => {
              let attribute = item;
              switch (item) {
                case '{id}':
                  // Object contains a nested object with an id key (i.e. priveadres.116271.adres, where we need the value of .adres)
                  attribute = Object.keys(inputValue)[0];
                  updatedFormElement.ids.push(attribute); // Store the key, because we need it for saving.
                  break;
                case '{first}':
                  // TODO : HIER PAKKEN WE STRAKS HET [0] OBJECT OP, DAT KOMT VAAK VOOR.
                  break;
                default:
              }

              inputValue = index > 0 ? inputValue[attribute] : inputValue;
            });
          }

        }

        updatedFormElement.value = inputValue;
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
        if (updatedFormElement.validation && updatedFormElement.value && updatedFormElement.value.trim() !== '') {
          updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
          if (!updatedFormElement.valid) {
            updatedFormElement.touched = true;
          }
        }
      }

      updatedFormInputs[input] = updatedFormElement;

    });

    clone.inputs = updatedFormInputs;
    this.setState({ configForm: clone });
  };

  checkValidity = (value, rules) => {
    const isArray = Array.isArray(value);

    let isValid = true;

    if (rules) {
      if (isArray) {
        if (rules.required) {
          isValid = value && value.length > 0 && isValid;
        }
      } else {
        if (rules.required) {
          isValid = value && value.trim() !== '' && isValid;
        }
      }

      if (rules.minLength) {
        isValid = value && value.length >= rules.minLength && isValid;
      }

      if (rules.maxLength) {
        isValid = value && value.length <= rules.maxLength && isValid;
      }
    }

    return isValid;
  };

  onKeyUpHandler = (event, formElement, configFormId) => {
    // If user presses ENTER, we should submit the form if certain conditions are met.
    if (this.props.onSubmit && formElement.configInput.preventSubmitOnEnter !== true &&
      event.keyCode === 13 && this.state.isValidForm) {
      this.submitHandler(event);
    }

    // ESCAPE press is handled centrally in the MessageBox component.
  };

  inputChangedHandler = (event, id, value) => {

    // Set the state 'formTouched' in the store to 'true'.
    this.props.touchedForm(true); // Info the onCloseHandler in the ViewParser (parent component) needs to know when closing the form.

    const clone = cloneDeep(this.state.configForm);
    const updatedFormInputs = clone.inputs;

    const updatedFormElement = updatedFormInputs[id];

    // Update the value.
    if (value || value === '') {
      updatedFormElement.value = value;
    } else {
      updatedFormElement.value = event.target.type === 'checkbox' ?
        (event.target.checked ? 1 : 0) : // Backend doesn't understand boolean value (true/false), only a 1 for true and a 0 for false.
        event.target.value;
    }

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

    const { inputs, urlSuffix, url } = this.state.configForm;

    // Final object we're gonna submit as payload on the submit url.
    const submitData = {};

    // We can have different inputs with different values to be stored in the samen nested object.
    // i.e priveadres.{id}.adres and priveadres.{id}.nr
    // We need to know if we should add the previous key-value pairs to the new key-value pair.
    // Inputs are sorted so we can do this!
    let nestedObjectsPrevious = [];
    let objectKeyPrimaryPrevious = '';
    let keyValuePairPrevious = {};

    for (let id in inputs) {

      if (inputs[id].save !== false) {
        if (id.indexOf('.', 0) >= 0) {
          // Data is not stored in a root attribute but nested in an object.

          const value = inputs[id].value; // Value on the form.

          // For values to be stored in nested object. These nested objects support more than one id in the object structure.
          // The actual id has been pushed to an array during rendering the input on the form and stored in the applicable input in the configForm.
          // We have to do this, because we need the same id for saving the data in nested inputs with an id.
          let ids = inputs[id].ids;

          // Array containing the object structure, last item is always the key of the key-value pair.
          const arrayObject = id.split('.');

          let nestedObjects = []; // Array for nested objects between the first and last item. F.i. [test2, test3] in case of test1.test2.test3.test4
          let objectKeyPrimary = ''; // String containing the name of the first object in the object structure. F.i. 'test1' in case of test1.test2.test3.test4
          let objectKeyValue = ''; // String containing the name of the key-part (of the key-value pair). F.i. 'test4' in case of test1.test2.test3.test4

          arrayObject.forEach((item, index) => {
            if (index === 0) {
              // First item is the primary key.
              objectKeyPrimary = item;
            } else if (index + 1 === arrayObject.length) {
              // Last item represents the value and should be the key part of a key-value pair.
              objectKeyValue = item;
            } else {
              // All items between the first and the last item are nested objects.
              switch (item) {
                case '{id}':
                  nestedObjects.push(ids[0]); // We need to append the related id.
                  ids = ids.shift(); // Remove this used id, so that a possible next {id} part can always refer to the first item in the ids array.
                  break;
                case '{first}':
                  break;
                default:
                  nestedObjects.push(item);
              }
            }
          });

          let keyValuePair = {};

          if (isEqual(nestedObjects, nestedObjectsPrevious) && objectKeyPrimary === objectKeyPrimaryPrevious) {
            // Same nested object as the previous one, so assign the previous key-value pairs also.
            keyValuePair = { ...keyValuePairPrevious, [objectKeyValue]: value };
          } else {
            keyValuePair = { [objectKeyValue]: value };
          }

          keyValuePairPrevious = cloneDeep(keyValuePair);
          nestedObjectsPrevious = cloneDeep(nestedObjects);
          objectKeyPrimaryPrevious = objectKeyPrimary;

          const emptyObject = {};
          // Create the object and assign the value to the last object in the tree.
          const objectNested = assignObject(emptyObject, nestedObjects, keyValuePair);

          // Add the value (an object) to the submit data.
          submitData[objectKeyPrimary] = objectNested;
        } else {
          // Data is stored in a root attribute.
          // Add the value (a string) to the submit data.
          submitData[id] = inputs[id].value;
        }
      }

    }

    let params = {};
    if (urlSuffix) {
      // Normal forms.
      const id = this.props.id ? this.props.id : -1;

      params = {
        MAGIC: localStorage.getItem('magic'),
        data: {
          [id]: {
            ...submitData
          }
        }
      }
    } else {
      // Login form (for instance).
      params = submitData;
    }

    // Store submitData in store for processing in other components in general.
    this.props.storeFormSubmitData(submitData);
    // this.props.storeFormSubmitData(params);

    const urlAddition = urlSuffix ? '.set' : '';
// console.log(params);
    callServer('put', url + urlAddition, this.successSubmitHandler, this.errorSubmitHandler, params);
  };

  successSubmitHandler = response => this.props.onSubmit(response);

  errorSubmitHandler = (error) => {
    if (this.props.onError) {
      this.props.onError(error);
    } else {
      console.log(error);
    }
  };

  showModal = (modalState, modalClass, title, type, content, buttons, focusButton,
    callBackOk = () => this.onModalLookupSubmitHandler(),
    callBackCancel = () => this.onModalLookupCloseHandler()) => {

    this.localData.modalClass = modalClass;
    this.localData.messageTitle = title;
    this.localData.messageType = type;
    this.localData.messageContent = content;
    this.localData.messageButtons = buttons;
    this.localData.focusButton = focusButton;
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
      this.props.touchedForm(true);
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
    const { modalClass, messageButtons, focusButton, messageTitle, messageType, messageContent,
      callBackOk, callBackCancel} = this.localData;
    const { title, titleAlign, titleIcon, size, buttons, headerSize, noCreate, okButtonLabel,
      cancelButtonLabel, buttonsClass, msgFailedSubmit } = this.state.configForm;

    let lookupModal = null;
    if (this.state.showModalLookup) {
      lookupModal = (
        <MessageBox
          buttons={messageButtons}
          callBackCancel={callBackCancel}
          callBackOk={callBackOk}
          focusButton={focusButton}
          messageContent={messageContent}
          messageTitle={messageTitle}
          modal={true}
          modalClass={modalClass}
          type={messageType}
        />
      );
    }

    const content = (
      <FormLayout
        configForm={this.state.configForm}
        changed={this.inputChangedHandler}
        keyUp={this.onKeyUpHandler}
        showModal={(modalState, modalClass, title, type, content, buttons, focusButton, callBackOk, callBackCancel) =>
          this.showModal(modalState, modalClass, title, type, content, buttons, focusButton, callBackOk, callBackCancel)}
        removeMultiValueItem={(fieldId, valueId) => this.removeMultiValueItem(fieldId, valueId)}
        data={this.props.data}
        dataOriginal={this.props.dataOriginal}
      />
    );

    // Title of the form.
    const titleForm = (this.props.id || noCreate) ? [title] : [trans.KEY_NEW, title];

    return (
      <Aux>
        <MessageBox
          buttons={buttons}
          buttonsClass={buttonsClass}
          callBackCancel={this.props.onCancel}
          callBackOk={this.submitHandler}
          cancelButtonLabel={cancelButtonLabel}
          contentExtraScrollZone={true}
          formIsValid={this.state.isValidForm}
          header={this.state.configForm.header}
          headerSize={headerSize}
          messageContent={content}
          messageTitle={titleForm}
          modal={this.props.modal}
          modalClass={size}
          msgFailedSubmit={msgFailedSubmit}
          okButtonLabel={okButtonLabel}
          titleAlign={titleAlign}
          titleIcon={titleIcon}
          trapFocus={true}
          type='info'
        />
        {lookupModal}
      </Aux>
    );
  };

}

const mapStateToProps = state => {
  const { lookupListItems, lookupListItemsSelected, lookupInputId } = state.redMain;
  return { lookupListItems, lookupListItemsSelected, lookupInputId };
};

const mapDispatchToProps = dispatch => {
  return {
    storeFormSubmitData: (formSubmitData) => dispatch(storeFormSubmitData(formSubmitData)),
    storeLookupListItems: (lookupListItems) => dispatch(storeLookupListItems(lookupListItems)),
    storeLookupListItemsSelected: (lookupListItemsSelected) => dispatch(storeLookupListItemsSelected(lookupListItemsSelected)),
    storeLookupInputId: (lookupInputId) => dispatch(storeLookupInputId(lookupInputId)),
    touchedForm: (formTouched) => dispatch(touchedForm(formTouched))
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
