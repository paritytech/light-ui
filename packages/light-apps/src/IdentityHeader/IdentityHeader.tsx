// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext, KeyringContext } from '@substrate/context';
import {
  Balance,
  CopyButton,
  Icon,
  Margin,
  Menu,
} from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { InputAddress } from './InputAddress';

type Props = RouteComponentProps;

export function IdentityHeader(props: Props): React.ReactElement | null {
  const { match } = props;
  const { api } = useContext(ApiContext);
  const { currentAccount, setCurrentAccount } = useContext(KeyringContext);

  if (!currentAccount) {
    return null;
  }

  return (
    <Menu stackable widths={6}>
      <Menu.Item>
        Current Account:
        <InputAddress
          fluid
          onChangeAddress={setCurrentAccount}
          value={currentAccount}
        />
        <CopyButton value={currentAccount} />
      </Menu.Item>
      <Menu.Item>
        <Balance address={currentAccount} api={api} fontSize='medium' />
      </Menu.Item>
      <Link to='/accounts'>
        <Menu.Item active={match.path === '/accounts'}>
          Accounts
          <Margin left='small' />
          <Icon color='black' name='id card' />
        </Menu.Item>
      </Link>
    </Menu>
  );
}
