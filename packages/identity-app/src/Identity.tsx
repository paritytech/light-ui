// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Container, Grid } from '@substrate/ui-components';

import React from 'react';
import Tab from 'semantic-ui-react/dist/commonjs/modules/Tab';

import { AddressBook } from './AddressBook';
import { SavedAccounts } from './SavedAccounts';
import { Wallet } from './Wallet';

type Props = {
  basePath: string
};

export class Identity extends React.PureComponent<Props> {
  render () {
    const panes = [
      { menuItem: 'Address Book', render: () => <AddressBook {...this.props} /> },
      { menuItem: 'Wallet', render: () => <Wallet {...this.props} /> }
    ];

    return (
      <Container>
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width={10}>
              <Tab panes={panes} menu={{ borderless: true }} />
            </Grid.Column>
            <Grid.Column width={6}>
              <SavedAccounts {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
