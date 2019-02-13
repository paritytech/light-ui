// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accounts from '@polkadot/ui-keyring/observable/accounts';
import { Identity } from '@substrate/identity-app';
import { Transfer } from '@substrate/transfer-app';
import { Subscribe } from '@substrate/ui-api';
import { Container } from '@substrate/ui-components';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { IdentityCard } from '../IdentityCard';
import { Onboarding } from '../Onboarding';

export class Content extends React.PureComponent {
  render () {
    return (
      <Container>
        <Subscribe>
          {accounts.subject.pipe(
            map(Object.values),
            map(([defaultAccount]) => defaultAccount
              ? (
                <React.Fragment>
                  <Route component={IdentityCard} />
                  <Switch>
                    <Redirect exact from='/' to={`/identity/${defaultAccount.json.address}`} />
                    <Redirect exact from='/identity' to={`/identity/${defaultAccount.json.address}`} />
                    <Redirect exact from='/transfer' to={`/transfer/${defaultAccount.json.address}`} />
                    <Route path='/identity/:currentAddress' component={Identity} />
                    <Route path='/transfer/:currentAddress' component={Transfer} />
                    <Redirect to='/' />
                  </Switch>
                </React.Fragment>
              )
              : <Route component={Onboarding} />
            )
          )}
        </Subscribe>
      </Container>
    );
  }
}
