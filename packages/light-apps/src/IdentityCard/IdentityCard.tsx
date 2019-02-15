// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types';
import { stringUpperFirst } from '@polkadot/util';
import { ApiContext, Subscribe } from '@substrate/ui-api';
import { Address, AddressSummary, BalanceDisplay, ErrorText, Header, Icon, Input, MarginTop, Modal, NavButton, Stacked, StackedHorizontal, StyledLinkButton, SuccessText, WithSpaceBetween } from '@substrate/ui-components';
import FileSaver from 'file-saver';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { StyledCard, CardContent } from './IdentityCard.styles';

interface MatchParams {
  currentAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

type State = {
  backupModalOpen: boolean,
  buttonText: string
  error?: string,
  forgetModalOpen: boolean,
  password: string,
  success?: string
};

export class IdentityCard extends React.PureComponent<Props, State> {
  static contextType = ApiContext;

  context!: React.ContextType<typeof ApiContext>; // http://bit.ly/typescript-and-react-context

  state: State = {
    backupModalOpen: false,
    buttonText: 'Transfer',
    forgetModalOpen: false,
    password: ''
  };

  closeBackupModal = () => {
    this.setState({
      backupModalOpen: false,
      password: ''
    });
  }

  closeForgetModal = () => {
    this.setState({ forgetModalOpen: false });
  }

  getAddress = () => {
    return this.props.location.pathname.split('/')[2];
  }

  openBackupModal = () => {
    this.setState({ backupModalOpen: true });
  }

  openForgetModal = () => {
    this.setState({ forgetModalOpen: true });
  }

  // Note: this violates the "order functions alphabetically" rule of thumb, but makes it more readable
  // to have it all in the same place.
  backupTrigger = <StyledLinkButton onClick={this.openBackupModal}>Backup</StyledLinkButton>;
  forgetTrigger = <StyledLinkButton onClick={this.openForgetModal}>Forget</StyledLinkButton>;

  private backupCurrentAccount = () => {
    const { keyring } = this.context;
    const { password } = this.state;
    const address = this.getAddress();

    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      this.closeBackupModal();
      this.onSuccess('Successfully backed up account to json keyfile!');
    } catch (e) {
      this.closeBackupModal();
      this.onError(e.message);
    }
  }

  private forgetCurrentAccount = () => {
    const { keyring } = this.context;
    const { history } = this.props;
    const address = this.getAddress();

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      this.closeForgetModal();

      history.push('/identity');
    } catch (e) {
      this.onError(e.message);
    }
  }

  private handleToggleApp = () => {
    const { location, history } = this.props;
    const address = this.getAddress();

    const to = location.pathname.split('/')[1].toLowerCase() === 'identity' ? 'transfer' : 'identity';
    const buttonText = stringUpperFirst(to);

    history.push(`/${to}/${address}`);

    this.setState({ buttonText });
  }

  private onChangePassword = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: value });
  }

  private onError = (value: string) => {
    this.setState({ error: value, success: undefined });
  }

  private onSuccess = (value: string) => {
    this.setState({ error: undefined, success: value });
  }

  render () {
    const { api, keyring } = this.context;
    const { buttonText } = this.state;
    const address = this.getAddress();
    const name = keyring.getAccount(address).getMeta().name;

    return (
      <StyledCard>
        <CardContent>
          <Header> Current Account </Header>
          {address
            ?
            <React.Fragment>
              <AddressSummary address={address} name={name} />
              <Subscribe>
                {
                  // FIXME using any because freeBalance gives a Codec here, not a Balance
                  // Wait for @polkadot/api to have TS support for all query.*
                  api.query.balances.freeBalance(address).pipe(map(this.renderBalance as any))
                }
              </Subscribe>
            </React.Fragment>
            : <div>Loading...</div>
          }
          <MarginTop />
          <Stacked>
            <Address address={address} />
            <MarginTop />
            <StackedHorizontal>
              {this.renderForgetConfirmationModal()}
              or
              {this.renderBackupConfirmationModal()}
            </StackedHorizontal>
          </Stacked>
          <MarginTop />
          <NavButton value={buttonText} onClick={this.handleToggleApp} />
        </CardContent>
        {this.renderError()}
        {this.renderSuccess()}
      </StyledCard>
    );
  }

  renderBackupConfirmationModal () {
    const { backupModalOpen, password } = this.state;

    return (
      <Modal trigger={this.backupTrigger} open={backupModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Backup this Account </Modal.Header>
        <h2>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </h2>
        <Modal.Actions>
          <Stacked>
            <Modal.SubHeader> Please encrypt your account first with the account's password. </Modal.SubHeader>
            <Input min={8} onChange={this.onChangePassword} type='password' value={password} />
            <StackedHorizontal>
              <WithSpaceBetween>
                <Icon name='remove' color='red' /> <StyledLinkButton color='white' onClick={this.closeBackupModal}>No</StyledLinkButton>
                <Icon name='checkmark' color='green' /> <StyledLinkButton color='white' onClick={this.backupCurrentAccount}>Confirm Backup</StyledLinkButton>
              </WithSpaceBetween>
            </StackedHorizontal>
          </Stacked>
        </Modal.Actions>
      </Modal>
    );
  }

  renderBalance = (balance: Balance) => {
    return <BalanceDisplay balance={balance} />;
  }

  renderError () {
    const { error } = this.state;

    return (
      <ErrorText>
        {error}
      </ErrorText>
    );
  }

  renderForgetConfirmationModal () {
    const { forgetModalOpen } = this.state;

    return (
      <Modal trigger={this.forgetTrigger} open={forgetModalOpen} basic>
        <Modal.Header> Please Confirm You Want to Forget this Account </Modal.Header>
        <h2>Please confirm that you want to remove this account from your keyring. </h2>
        <Modal.Actions>
          <Icon name='remove' color='red' /> <StyledLinkButton color='white' onClick={this.closeForgetModal}>No</StyledLinkButton>
          <Icon name='checkmark' color='green' /> <StyledLinkButton color='white' onClick={this.forgetCurrentAccount}>Confirm Forget</StyledLinkButton>
        </Modal.Actions>
      </Modal>
    );
  }

  renderSuccess () {
    const { success } = this.state;

    return (
      <SuccessText>
        {success}
      </SuccessText>
    );
  }
}
