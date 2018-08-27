import React from 'react';
import View from '../../Parsers/ViewParser/ViewParser';
import viewConfig from '../../../config/Views/ConfigListViewOrganisation';

const organisation = () => <View viewConfig={viewConfig} configFormInStore={true} />

export default organisation;
