import React from 'react';
import Responsive from 'react-responsive';

export const Large = props => <Responsive {...props} minWidth={1280} />;
export const Medium = props => <Responsive {...props} minWidth={768} maxWidth={1279} />;
export const Small = props => <Responsive {...props} maxWidth={767} />;
