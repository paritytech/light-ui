// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  Balance,
  CopyButton,
  FadedText,
  Icon,
  InputAddress,
  Margin,
  Menu,
  SubHeader,
} from '@substrate/ui-components';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';

interface MatchParams {
  currentAccount: string;
}

type Props = RouteComponentProps<MatchParams>;

export function IdentityHeader(props: Props): React.ReactElement {
  const {
    history,
    location,
    match: {
      params: { currentAccount },
    },
  } = props;

  const currentPath = location.pathname.split('/')[1];

  // Change account
  const changeCurrentAccount = (account: string): void => {
    history.push(`/${currentPath}/${account}`);
  };

  const renderPrimaryMenu = (): React.ReactElement => {
    const activeTab = location.pathname.split('/')[1];

    const navToAccounts = (): void => {
      history.push(`/manageAccounts/${currentAccount}`);
    };

    const navToManageAddressBook = (): void => {
      history.push(`/addresses/${currentAccount}`);
    };

    return (
      <Menu stackable widths={5} fitted>
        <Switch>
          <Route path={['/manageAccounts', '/addresses', '/accounts/:currentAccount']}>
            <Menu.Item>
              <InputAddress fluid onChangeAddress={changeCurrentAccount} value={currentAccount} />
              <CopyButton value={currentAccount} />
            </Menu.Item>
            <Menu.Item>
              <Balance address={currentAccount} fontSize='medium' />
            </Menu.Item>
            <Menu.Item active={activeTab === 'manageAccounts'} onClick={navToAccounts}>
              Accounts
              <Margin left='small' />
              <Icon color='black' name='id card' />
            </Menu.Item>
            <Menu.Item>
              <Link to={`/accounts/${currentAccount}/add`}>
                Add an Account <Icon name='plus' />
              </Link>
            </Menu.Item>
            <Menu.Item active={activeTab === 'addresses'} onClick={navToManageAddressBook}>
              Address Book
              <Margin left='small' />
              <Icon color='black' name='id card' />
            </Menu.Item>
            <Menu.Item>
              <Link to={`/addresses/add`}>
                Add an Address <Icon name='plus' />
              </Link>
            </Menu.Item>
          </Route>
        </Switch>
      </Menu>
    );
  };

  const renderHeader = (): React.ReactElement => renderPrimaryMenu();

  return renderHeader();
}
