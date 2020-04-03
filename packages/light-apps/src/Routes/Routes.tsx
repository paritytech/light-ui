// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Accounts } from '../Accounts';
import { Signer } from '../Signer';
import { TxQueueNotifier } from '../TxQueueNotifier';

export function Routes(): React.ReactElement {
  return (
    <Container>
      <Switch>
        <Redirect exact from='/' to='/accounts' />
        <Route path='/accounts' component={Accounts} />
        <Redirect to='/' />
      </Switch>
      <TxQueueNotifier />
      <Signer />
    </Container>
  );
}
