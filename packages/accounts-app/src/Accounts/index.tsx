// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Menu } from '@substrate/ui-components';
import React, { useState, useEffect } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';

import { AccountsOverview } from './AccountsOverview';
import { StakingOptions } from './StakingOptions';
import { AccountsOverviewDetailed } from './AccountsOverviewDetailed';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const Options = (props: Props) => {
  const { history, location, match: { params: { currentAccount } } } = props;
  const [active, setActive] = useState();

  useEffect(() => {
    setActive(location.pathname.split('/')[3]);
  });

  const navToOverview = () => {
    history.push(`/manageAccounts/${currentAccount}/overview`);
  };

  const navToBalance = () => {
    history.push(`/manageAccounts/${currentAccount}/balances`);
  };

  const navToStaking = () => {
    history.push(`/manageAccounts/${currentAccount}/staking`);
  };

  return (
    <Menu>
      <Menu.Item active={active === 'overview'} onClick={navToOverview}>View All Accounts</Menu.Item>
      <Menu.Item active={active === 'balances'} onClick={navToBalance}>Detailed Balances</Menu.Item>
      <Menu.Item active={active === 'staking'} onClick={navToStaking}>Staking Options</Menu.Item>
    </Menu>
  );
};

export function Accounts (props: Props) {
  return (
    <React.Fragment>
      <Route component={Options} />
      <Switch>
        <Route path='/manageAccounts/:currentAccount/overview' component={AccountsOverview} />
        <Route path='/manageAccounts/:currentAccount/balances' component={AccountsOverviewDetailed} />
        <Route path='/manageAccounts/:currentAccount/staking' component={StakingOptions} />
        <Redirect from='/manageAccounts/:currentAccount' to='/manageAccounts/:currentAccount/overview' />
      </Switch>
    </React.Fragment>
  );
}
