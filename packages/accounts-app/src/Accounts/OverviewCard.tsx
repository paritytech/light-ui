// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, handler, KeyringContext } from '@substrate/context';
import {
  AddressSummary,
  Card,
  FadedText,
  Icon,
  Input,
  Margin,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  SubHeader,
  WithSpaceAround,
  WithSpaceBetween,
} from '@substrate/ui-components';
import FileSaver from 'file-saver';
import { History } from 'history';
import React, { useContext, useState } from 'react';

interface Props {
  address: string;
  history: History;
  name?: string;
}

export function AccountsOverviewCard(props: Props): React.ReactElement {
  const { address, history, name } = props;
  const { keyring } = useContext(KeyringContext);
  const { enqueue } = useContext(AlertsContext);
  const [confirmScreen, setConfirmScreen] = useState();
  const [showDetails, setShowDetails] = useState(false);
  const [password, setPassword] = useState();

  const handleBackup = (): void => {
    if (confirmScreen !== 'backup') {
      setConfirmScreen('backup');

      return;
    }

    try {
      const pair = keyring.getPair(address);
      const json = keyring.backupAccount(pair, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);

      enqueue({ content: 'Successfully backed up account to json keyfile!', type: 'success' });
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  };

  function handleCancel(): void {
    if (confirmScreen) {
      setConfirmScreen(null);
    }
  }

  function handleForget(): void {
    if (confirmScreen !== 'forget') {
      setConfirmScreen('forget');
      return;
    }

    try {
      // forget it from keyring
      keyring.forgetAccount(address);

      history.push('/');
    } catch (e) {
      enqueue({ content: e.message, type: 'error' });
    }
  }

  function handleShowDetails(): void {
    setShowDetails(!showDetails);
  }

  const renderConfirmBackup = (): React.ReactElement => {
    return (
      <WithSpaceAround>
        <SubHeader>Please Confirm You Want to Backup this Account</SubHeader>
        <FadedText>
          By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account.
        </FadedText>
        <Card.Description>
          <Stacked>
            <FadedText>Please encrypt your account first with the account&apos;s password.</FadedText>
            <Input onChange={handler(setPassword)} type='password' value={password} />
            <StackedHorizontal>
              <WithSpaceBetween>
                <StyledLinkButton onClick={handleCancel}>
                  <Icon name='remove' color='red' />
                  <FadedText>Cancel</FadedText>
                </StyledLinkButton>
                <StyledLinkButton onClick={handleBackup}>
                  <Icon name='checkmark' color='green' />
                  <FadedText>Confirm Backup</FadedText>
                </StyledLinkButton>
              </WithSpaceBetween>
            </StackedHorizontal>
          </Stacked>
        </Card.Description>
      </WithSpaceAround>
    );
  };

  const renderConfirmForget = (): React.ReactElement => {
    return (
      <WithSpaceAround>
        <Stacked>
          <SubHeader>Please Confirm You Want to Forget this Account</SubHeader>
          <strong>By pressing confirm, you will be removing this account from your Saved Accounts.</strong>
          <Margin top />
          <FadedText>You can restore this later from your mnemonic phrase or json backup file.</FadedText>
          <Card.Description>
            <StackedHorizontal>
              <StyledLinkButton onClick={handleCancel}>
                <Icon name='remove' color='red' />
                <FadedText>Cancel</FadedText>
              </StyledLinkButton>
              <StyledLinkButton onClick={handleForget}>
                <Icon name='checkmark' color='green' />
                <FadedText>Confirm Forget</FadedText>
              </StyledLinkButton>
            </StackedHorizontal>
          </Card.Description>
        </Stacked>
      </WithSpaceAround>
    );
  };

  return (
    <>
      <Card height='80%' raised>
        {confirmScreen ? (
          <>
            <Card.Content>
              <SubHeader>Are You Sure?</SubHeader>
              {confirmScreen === 'backup' ? renderConfirmBackup() : renderConfirmForget()}
            </Card.Content>
          </>
        ) : (
          <>
            <Card.Content textAlign='right'>
              <AddressSummary
                address={address}
                alignItems='center'
                detailed={showDetails}
                justifyContent='center'
                name={name}
                orientation='horizontal'
                size='small'
              />
              <Margin bottom />

              <StackedHorizontal>
                <StyledLinkButton onClick={handleShowDetails}>
                  <Icon name={showDetails ? 'up arrow' : 'down arrow'} />
                  {showDetails ? 'Hide Details' : 'Show Details'}
                </StyledLinkButton>
                {showDetails && (
                  <>
                    <StyledLinkButton onClick={handleForget}>
                      <Icon name='remove' />
                      Forget
                    </StyledLinkButton>
                    <StyledLinkButton onClick={handleBackup}>
                      <Icon name='arrow alternate circle down' />
                      Backup
                    </StyledLinkButton>
                  </>
                )}
              </StackedHorizontal>
            </Card.Content>
          </>
        )}
      </Card>
    </>
  );
}
