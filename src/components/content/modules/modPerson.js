import React from 'react';
import Screen from '../../parsers/screenParser/screenParser';
import { screenConfig } from '../../../config/screens/configScreenPerson';

const module = () => <Screen screenConfig={screenConfig} />;

export default module;
