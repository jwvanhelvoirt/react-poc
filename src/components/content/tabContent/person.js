import React from 'react';
import View from '../../parsers/viewParser/viewParser';
import viewConfig from '../../../config/views/configListViewPerson';

const person = () => <View viewConfig={viewConfig} />;

export default person;
