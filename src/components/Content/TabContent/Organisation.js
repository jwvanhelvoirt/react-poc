import React from 'react';
import formConfig from '../../../config/Forms/ConfigFormOrganisation';
import View from '../../Parsers/ViewParser/ViewParser';
import viewConfig from '../../../config/Views/ConfigListViewOrganisation';

const organisation = () => <View viewConfig={viewConfig} />
// const organisation = () => <View formConfig={formConfig} viewConfig={viewConfig} />

export default organisation;
