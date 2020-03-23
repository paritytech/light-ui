// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';

import { TableCellAddress } from '../src';
import { MeasureApp, Menu } from '../src';
import { withTheme } from './customDecorators';
import { InputTransferFundsStory } from './Input.stories';
import { MenuTabsStory } from './Menu.stories';
import { TableAccountsStory } from './TableAccounts.stories';
import { TableTxSummaryStory } from './TableTxSummary.stories';
import { TopBarStory } from './TopBar.stories';

// TODO:
// signal color
// table transfer

storiesOf('Apps/Lichen', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('Accounts', () => (
    <>
      <MenuTabsStory />
      <TopBarStory />
      <MeasureApp className='flex-column'>
        <div className='flex items-center mb2'>
          <h2 className='inline-flex mr3 mb0'>Your Accounts </h2>
          <Button basic icon labelPosition='right'>
            <Icon name='plus' />
            Add New
          </Button>
        </div>
        <TableAccountsStory />
      </MeasureApp>
    </>
  ))
  .add('Send Funds', () => (
    <>
      <MenuTabsStory activeItem='Send Funds' />
      <TopBarStory />
      <MeasureApp>
        <div className='flex items-center mb2'>
          <h2 className='inline-flex mr3 mb0'>Send Funds</h2>
        </div>
      </MeasureApp>
      <MeasureApp>
        <div className='flex-column w-100'>
          <InputTransferFundsStory />
        </div>
        <div className='w-60 pl5'>
          <TableTxSummaryStory />
        </div>
      </MeasureApp>
    </>
  ));
