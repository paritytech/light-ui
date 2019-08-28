// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select } from '@storybook/addon-knobs';

import { Breadcrumbs, WrapperDiv } from '../src';
import { withTheme } from './customDecorators';

const sectionLabels = [
  'T&C',
  'Stash',
  'Controller',
  'Confirm',
  'Claim',
  'Bond'
];

storiesOf('Breadcrumbs', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('3 sections', () => (
    <WrapperDiv width='100%'>
        <Breadcrumbs activeLabel={select('activeLabel', sectionLabels, 'T&C')} sectionLabels={sectionLabels} />
    </WrapperDiv>
  ));
