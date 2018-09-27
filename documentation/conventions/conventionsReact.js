/*
Make React components class based, ONLY if there's a good reason for it.
Class based components are marginally slower than NON-class based components.
A couple of acceptable reasons to use class based components:
1. In case local state is required.
2. In case lyfecycle hooks are required.
3. In case property type checking is used.
*/

// ***** Class based component *****
import React, { Component } from 'react';

class SomeComponent extends Component {
  render = () => {
    return (
      <div>Some content</div>
    );
  }
}

// ***** NON-class based component *****
import React from 'react';

const someComponent = (props) => {
  return (
    <div>Some content</div>
  );
};

export default someComponent;
