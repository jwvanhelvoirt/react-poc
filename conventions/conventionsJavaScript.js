// **** Switch case ****

// #### Always include a default case in a switch statement. ###

// incorrect
switch (props.type) {
  case 'warning':
    classColor = classes.Warning;
    break;
  case 'error':
    classColor = classes.Error;
    break;
}

// correct
switch (props.type) {
  case 'warning':
    classColor = classes.Warning;
    break;
  case 'error':
    classColor = classes.Error;
    break;
  default:
    break;
}




// **** Ternary operator ****

// #### Do NOT use the Ternary operator to execute an expression. ####

// incorrect
emptySearchbar ? this.setState({ searchbarValue: '' }) : null;

// correct
if (emptySearchbar) {
  this.setState({ searchbarValue: '' })
}

// #### Use a Ternary operator for short if-then-else assignments. ####

// incorrect (119 bytes in this example)
let organisation = null;
if (props.organisation) {
  organisation = props.organisation;
} else {
  organisation = 'not found';
}

// correct (75 bytes in this example)
const organisation = props.organisation ? props.organisation : 'not found';

// ### Divide Ternary operator over multiple lines in case they become too long. ####

// incorrect
const skipNext = forward ? (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) : (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);

// correct (notice the position of the ? and the :)
const skipNext = forward ?
  (multiple ? skip + (this.navStep * viewConfig.limit ) : skip + viewConfig.limit) :
  (multiple ? skip - (this.navStep * viewConfig.limit ) : skip - viewConfig.limit);




// **** If statements, For-loops, Switch statements etc. ****

// #### ALWAYS use curly braces. ####

// incorrect (curly braces are mandatory for legibility and console.log option)
if (skipNext >= 0 && this.state.count > skipNext)
  this.reloadListView(skipNext, searchbarValue)

// incorrect (opening curly brace must be preceded with a space, indent of closing curly brace is incorrect)
if (skipNext >= 0 && this.state.count > skipNext){
    this.reloadListView(skipNext, searchbarValue)
    }

// correct
if (skipNext >= 0 && this.state.count > skipNext) {
    this.reloadListView(skipNext, searchbarValue)
}

// correct (on one line only if the statement is short and doesn't reduce legibility)
if (skipNext >= 0 && this.state.count > skipNext) { this.reloadListView(skipNext, searchbarValue) }





// **** React - Prevent State to become unpredictable ****

// #### Do not mutate state directly, ALWAYS use setState. ####

// incorrect
this.state['showModal'] = true;

// correct
this.setState({ showModal: true });

// #### NEVER use the current state variable to set new state. ####

// incorrect
this.setState({ headerSelected: !this.state.headerSelected });

// correct
this.setState((prevState) => {
  return {
    headerSelected: !prevState.headerSelected,
  };
});

// #### Make deepclones of state objects and arrays, mutate these copies and at last assign the deepclone to the state object or array. ####

// incorrect
const clone = this.state.configForm;
const updatedFormInputs = clone.inputs;
const updatedFormElement = updatedFormInputs[id];
updatedFormElement.value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
clone.inputs = updatedFormInputs;
this.setState({ configForm: clone });

// incorrect (in case the object 'configForm' contains nested objects, the spread operator is not a deepclone)
const clone = { ...this.state.configForm };
const updatedFormInputs = clone.inputs;
const updatedFormElement = updatedFormInputs[id];
updatedFormElement.value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
clone.inputs = updatedFormInputs;
this.setState({ configForm: clone });

// correct
const clone = cloneDeep(this.state.configForm);
const updatedFormInputs = clone.inputs;
const updatedFormElement = updatedFormInputs[id];
updatedFormElement.value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
clone.inputs = updatedFormInputs;
this.setState({ configForm: clone });




// **** Webpack compiler ****

// #### All warnings the webpack compiler produces must be solved. ####




// **** JavaScript ES6 ****

// #### Variable declaration with const and let ####

// incorrect
var counter = 0;
counter += 1;
var organisation = 'Philips';

// correct (use 'let' for a variable that changes, use 'const' for variables that won't change)
let counter = 0;
counter += 1;
const organisation = 'Philips';

// #### Destructuring. ####

// incorrect (346 bytes)
const modalClass = this.localData.modalClass;
const messageButtons = this.localData.messageButtons;
const messageTitle = this.localData.messageTitle;
const messageType = this.localData.messageType;
const messageContent = this.localData.messageContent;
const callBackOk = this.localData.callBackOk;
const callBackCancel = this.localData.callBackCancel;

// correct (124 bytes)
const { modalClass, messageButtons, messageTitle, messageType, messageContent, callBackOk, callBackCancel} = this.localData;

// #### Arrow functions. ####
// We use arrow functions unless execution requires a different 'this' context.

// incorrect
onModalLookupCloseHandler = function() {
  this.setState({ showModalLookup: false });
}

// correct
onModalLookupCloseHandler = () => {
  this.setState({ showModalLookup: false });
}

// correct
onModalLookupCloseHandler = () => this.setState({ showModalLookup: false });




// **** Legibility ****

// #### = And + characters are surrounded with spaces. ####

// incorrect
const url='/'+this.state.configForm.url+'/update/'+this.props.id;

// correct
const url = '/' + this.state.configForm.url + '/update/' + this.props.id;

// ### Use white lines between related blocks of code. ####

// incorrect
submitHandler = (event) => {
  event.preventDefault();
  const submitData = {};
  for (let id in this.state.configForm.inputs) {
    submitData[id] = this.state.configForm.inputs[id].value;
  }
  const url = this.props.id ?
    '/' + this.state.configForm.url + '/update/' + this.props.id :
    '/' + this.state.configForm.url + '/create';
  const type = this.props.id ? 'put' : 'post';
  callServer(type, url, this.successSubmitHandler, this.errorSubmitHandler, submitData);
}

// correct
submitHandler = (event) => {
  event.preventDefault();

  const submitData = {};
  for (let id in this.state.configForm.inputs) {
    submitData[id] = this.state.configForm.inputs[id].value;
  }

  const url = this.props.id ?
    '/' + this.state.configForm.url + '/update/' + this.props.id :
    '/' + this.state.configForm.url + '/create';

  const type = this.props.id ? 'put' : 'post';

  callServer(type, url, this.successSubmitHandler, this.errorSubmitHandler, submitData);
}





// **** Consistency ****

// #### Strings are surrounded with single quotes. ####

// incorrect
const url = "/" + this.state.configForm.url + "/update/" + this.props.id;

// correct
const url = '/' + this.state.configForm.url + '/update/' + this.props.id;

// #### We use the camelcase notation for names of variables and functions. ####

// incorrect
let listitems = listitemsupdated.options;
successsubmithandler = response => this.props.onsubmit(response);

// incorrect
let list_items = list_items_updated.options;
success_submit_handler = response => this.props.on_submit(response);

// incorrect
let ListItems = ListItemsUpdated.options;
SuccessSubmitHandler = response => this.props.onSubmit(response);

// correct
let listItems = listItemsUpdated.options;
successsubmithandler = response => this.props.onsubmit(response);




// **** Styling ****

// #### Inline styling is FORBIDDEN. ALWAYS define a class. ####

// incorrect
<div style={{ 'padding':'20px' }}>FILTER MODAL</div>

//correct
<div style={classes.FilterModal}>FILTER MODAL</div>

// #### Import of the stylesheet related to the component.
// ALWAYS use following import statement and assign the imported object to a variable called 'classes'.
import classes from './ViewParser.scss';
import classes from './Button.scss';
import classes from './Input.scss';
// etc....
