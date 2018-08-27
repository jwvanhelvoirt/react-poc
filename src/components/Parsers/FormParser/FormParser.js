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
import * as types from '../../../store/Actions';
import Aux from '../../../hoc/Auxiliary';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import ModalHeader from '../../UI/ModalHeader/ModalHeader';
import ModalFooter from '../../UI/ModalFooter/ModalFooter';
import MessageBox from '../../UI/MessageBox/MessageBox';
import classes from './FormParser.scss';
import { callServer } from '../../../api/api';

class Form extends Component {
  state = {
    formIsValid: false,
    showModalLookup: false
  }

  checkValidity(value, rules) {
    let isValid = true;

    if (rules.required) {
      isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    return isValid;
  }

  inputChangedHandler = (event, id) => {
    // Set the state 'formTouched' in the store to 'true'.
    this.props.touchForm();

    // Clone the state to a variable.
    const updatedForm = cloneDeep(this.props.configForm);
    const updatedFormElement = updatedForm.inputs[id];

    // Update the value.
    updatedFormElement.value = event.target.value;

    // Check for validation.
    if (updatedFormElement.validation) {
      updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
    }

    // Is the entire form valid? (For enabling submit button yes or no).
    let formIsValid = true;
    for (let id in updatedForm.inputs) {
      if (updatedForm.inputs[id].validation) {
        formIsValid = this.checkValidity(updatedForm.inputs[id].value, updatedForm.inputs[id].validation) && formIsValid;
      }
    }

    this.props.configForm.inputs = updatedForm.inputs;

    this.props.setActiveConfigForm(updatedForm);

    // Modify the state.
    this.setState({ formIsValid: formIsValid });
  }

  submitHandler = (event) => {
    event.preventDefault();
    const submitData = {};
    for (let id in this.props.configForm.inputs) {
      submitData[id] = this.props.configForm.inputs[id].value;
    }
    const url = this.props.id ?
    '/' + this.props.configForm.url + '/update/' + this.props.id :
    '/' + this.props.configForm.url + '/create';
    const type = this.props.id ? 'put' : 'post';
    callServer(type, url, this.successSubmitHandler, this.errorSubmitHandler, submitData);
  }

  successSubmitHandler = (response) => {
    //console.log(response);
    this.props.onSubmit(response);
  }

  errorSubmitHandler = (error) => {
    //console.log(error);
    //this.setState({ submitError: true }); //hier kun je dan iets wel of niet printen
  }

  componentWillMount() {
    // state property 'configForm' contains default values, update these with the values of the selected entry and update state.

    const clone = cloneDeep(this.props.configForm);

    const updatedForm = {
      ...clone.inputs
    }

    const arrayRecords = Object.keys(this.props.data);
    for (let index in arrayRecords) {
      let updatedFormElement = {
        ...updatedForm[arrayRecords[index]]
      }
      updatedFormElement.value = this.props.data[arrayRecords[index]];

      // Check for validity.
      if (updatedFormElement.validation && updatedFormElement.value.trim() !== '') {
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        if (!updatedFormElement.valid) {
          updatedFormElement.touched = true;
        }
      }

      updatedForm[arrayRecords[index]] = updatedFormElement;
    }

    this.props.configForm.inputs = updatedForm;

    this.props.setActiveConfigForm(this.props.configForm);
  }

  render() {
    let formElementsArray = [];
    for (let inputId in this.props.configForm.inputs) {
      if (inputId !== '_id' && inputId !== '__v') { // These are system fields returned by Mongo, we don't want them to be displayed.
        formElementsArray.push({
          inputId,
          configInput: this.props.configForm.inputs[inputId]
        });
      }
    }

    const content =
      <div className={classes.FieldsWrapper}>
        <div className={classes.Fields}>
          <div>
            {formElementsArray.map(formElement => {
                return (
                  (
                    <Input
                      key={formElement.inputId}
                      inputId={formElement.inputId}
                      changed={(event) => this.inputChangedHandler(event, formElement.inputId)}
                      configInput={formElement.configInput}
                      configForm={this.props.configForm}
                      />
                  )
                )
            })}
          </div>
        </div>
      </div>;

    // Title of the form.
    const title = this.props.id ? this.props.configForm.title : 'nieuwe ' + this.props.configForm.title;

    return (
      <MessageBox modalClass='ModalWide' messageTitle={title} type='info'
        messageContent={content} buttons='butOkCancel' formIsValid={this.state.formIsValid}
        callBackOk={this.submitHandler} callBackCancel={this.props.onCancel}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    configForm: state.redMain.configFormActive
  };
}

const mapDispatchToProps = dispatch => {
  return {
    setActiveConfigForm: (configForm) => dispatch( {type: types.FORM_CONFIG_SET, configForm } ),
    touchForm: () => dispatch( {type: types.FORM_TOUCH } )
  }
}

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
