import React from 'react';
import View from '../../parsers/viewParser/viewParser';
import viewConfig from '../../../config/views/configListViewProjectDocument';

const project = () => <View viewConfig={viewConfig} />;

export default project;
