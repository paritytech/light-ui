// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Container, Input, MarginTop, NavButton, Stacked, WalletCard, WithSpace } from '@polkadot/ui-components';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

type Props = RouteComponentProps & {
  basePath: string
};

type State = {
  seed?: string,
  name?: string,
  lookupAddress?: string
};

export class Identity extends React.PureComponent<Props, State> {
  state: State = {};

  private handleInputSeed = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ seed: value });
  }

  private handleInputName = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: value });
  }

  private handleAddAccount = () => {
    const { name, seed } = this.state;

    console.log(name, seed);
  }

  private handleInputAddressLookup = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ lookupAddress: value });
  }

  private handleSaveAccount = () => {
    const { name, lookupAddress } = this.state;

    console.log(name, lookupAddress);
  }

  render () {
    return (
      <Container>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
              <WalletCard
                header='Wallet'
                subheader='Manage your secret keys' >
                <Stacked>
                  <WithSpace>
                    <Input
                      label='Seed'
                      onChange={this.handleInputSeed}
                      type='text'
                      withLabel />
                    <MarginTop />
                    <Input
                      label='Name'
                      onChange={this.handleInputName}
                      type='text'
                      withLabel />
                  </WithSpace>
                  <NavButton onClick={this.handleAddAccount} value='Create Account' />
                </Stacked>
              </WalletCard>
            </Grid.Column>

            <Grid.Column>
              <WalletCard
                header='Address Book'
                subheader='Inspect the status of any account and name it for later use' >
                <Stacked>
                  <WithSpace>
                    <Input
                      label='Lookup Account By Address'
                      onChange={this.handleInputAddressLookup}
                      type='text'
                      withLabel
                    />
                    <MarginTop />
                    <Input
                      label='Name'
                      onChange={this.handleInputName}
                      type='text'
                      withLabel
                    />
                  </WithSpace>
                <NavButton onClick={this.handleSaveAccount} value='Unlock Account' />
                </Stacked>
              </WalletCard>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}
