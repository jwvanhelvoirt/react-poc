import React from 'react';
import Screen from '../../parsers/screenParser/screenParser';
import { tabsConfig } from '../../../config/screens/configTabsProjectDocument';

const modDocument = () => <Screen tabsConfig={tabsConfig} />;

export default modDocument;
