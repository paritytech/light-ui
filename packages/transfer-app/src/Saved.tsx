// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/ui-api';
import { AddressSummary, Grid, Icon, MarginTop, NavLink, Stacked, StackedHorizontal, SubHeader, WalletCard, WithSpace } from '@substrate/ui-components';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import addressObservable from '@polkadot/ui-keyring/observable/addresses';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';
import { Subscribe } from 'react-with-observable';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  basePath: string;
  onSelectAddress: (address: string, name: string) => void;
}

export class Saved extends React.PureComponent<Props> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  forgetSelectedAddress = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { keyring } = this.context;

    const address = event.currentTarget.dataset.address;

    keyring.forgetAddress(address!);
  }

  handleSelectedRecipient = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const { onSelectAddress } = this.props;

    const address = event.currentTarget.dataset.address;
    const name = event.currentTarget.dataset.name;

    onSelectAddress(address!, name!);
  }

  render () {
    return (
      <WalletCard
        header='Saved Identities'
        overflow='scroll'
        subheader='Quickly select an identity that you have previously saved to transfer balance to'>
        <MarginTop marginTop='3.5rem' />
        <Grid>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> My Unlocked Accounts </SubHeader>
              <WithSpace>
                { this.renderAccountsToSendFrom() }
              </WithSpace>
            </Stacked>
          </Grid.Column>
          <Grid.Column width={8}>
            <Stacked>
              <SubHeader> Saved Addresses </SubHeader>
              <WithSpace>
                { this.renderAddressesToSendTo() }
              </WithSpace>
            </Stacked>
          </Grid.Column>
        </Grid>
      </WalletCard>
    );
  }

  renderAccountsToSendFrom () {
    return (
      <Subscribe>
        {accountObservable.subject.pipe(
          map((allAccounts: SubjectInfo) =>
            !allAccounts
              ? this.renderEmpty()
              : Object.values(allAccounts).map((account: SingleAddress) =>
                  <React.Fragment key={account.json.address}>
                    <MarginTop />
                    <Link to={`/transfer/${account.json.address}`}>
                      <AddressSummary
                        address={account.json.address}
                        name={account.json.meta.name}
                        orientation='horizontal'
                        size='small'
                      />
                    </Link>
                  </React.Fragment>
              )
          ))}
      </Subscribe>
    );
  }

  renderAddressesToSendTo () {
    return (
      <Subscribe>
        {addressObservable.subject.pipe(
          map((allAddresses: SubjectInfo) =>
            !Object.keys(allAddresses).length
              ? this.renderEmpty()
              : Object.values(allAddresses).map((address: SingleAddress) =>
                  <React.Fragment key={`__locked_${address.json.address}`}>
                    <MarginTop />
                    <StackedHorizontal>
                      <Link to='#' data-address={address.json.address} data-name={address.json.meta.name} onClick={this.handleSelectedRecipient}>
                        <AddressSummary
                          address={address.json.address}
                          name={address.json.meta.name}
                          orientation='horizontal'
                          size='small' />
                      </Link>
                      <Link to='#' data-address={address.json.address} onClick={this.forgetSelectedAddress}>
                        <Icon name='close' />
                      </Link>
                    </StackedHorizontal>
                  </React.Fragment>
              )
          ))}
      </Subscribe>
    );
  }

  renderEmpty () {
    const { match } = this.props;
    const address = match.params.currentAddress;

    return (
      <React.Fragment>
        <p> It looks like you don't have any saved accounts. You can add them from your address book in Identity app. </p>
        <NavLink to={`/identity/${address}`}> Take me there </NavLink>
      </React.Fragment>
    );
  }
}
