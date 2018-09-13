import React from 'react';
import Screen from '../../parsers/screenParser/screenParser';
import { screenConfig } from '../../../config/screens/configScreenProjectDocument';

const modProject = () => <Screen screenConfig={screenConfig} />;

export default modProject;
