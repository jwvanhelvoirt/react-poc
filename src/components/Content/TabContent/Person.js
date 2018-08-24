import React from 'react';
import formConfig from '../../../config/Forms/ConfigFormPerson';
import View from '../../Parsers/ViewParser/ViewParser';
import viewConfig from '../../../config/Views/ConfigListViewPerson';

const person = () => <View formConfig={formConfig} viewConfig={viewConfig} />

export default person;
