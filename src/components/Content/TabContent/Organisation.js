import React from 'react';
import formConfig from '../../../config/Forms/FormOrganisation';
import View from '../../Parsers/ViewParser/ViewParser';
import viewConfig from '../../../config/ListViews/ListViewOrganisation';

const organisation = () => <View formConfig={formConfig} viewConfig={viewConfig} />

export default organisation;
