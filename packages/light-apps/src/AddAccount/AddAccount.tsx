// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext } from '@substrate/ui-common';
import { Menu, WalletCard } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps, Link, Switch, Route, Redirect } from 'react-router-dom';
import { Create } from './Create';
import { ImportWithJson } from './ImportWithJson';
import { ImportWithPhrase } from './ImportWithPhrase';
import { Container } from 'semantic-ui-react';

interface Props extends RouteComponentProps { }

export class AddAccount extends React.PureComponent<Props> {
  static contextType = AppContext;

  context!: React.ContextType<typeof AppContext>; // http://bit.ly/typescript-and-react-context

  getActiveTab = () => this.props.location.pathname.split('/')[3];

  render () {
    const activeTab = this.getActiveTab();

    return (
      <Container>
        <Menu>
          <Link to='/accounts/add/generate'>
            <Menu.Item active={activeTab === 'generate'}>
                Generate new account
            </Menu.Item>
          </Link>
          <Link to='/accounts/add/json'>
            <Menu.Item active={activeTab === 'json'}>
              Import from JSON keyfile
            </Menu.Item>
          </Link>
          <Link to='/accounts/add/phrase'>
            <Menu.Item active={activeTab === 'phrase'}>
              Import from mnemonic phrase
            </Menu.Item>
          </Link>
        </Menu>

        <WalletCard header='Add an Account' height='100%'>
          <Switch>
            <Route path='/accounts/add/generate' component={Create} />
            <Route path='/accounts/add/json' component={ImportWithJson} />
            <Route path='/accounts/add/phrase' component={ImportWithPhrase} />
            <Redirect to='/accounts/add/generate' />
          </Switch>
        </WalletCard>
      </Container>
    );
  }
}
