// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakingOptions } from '@substrate/accounts-app';
import { Breadcrumbs, Header, Margin, Modal, Stacked } from '@substrate/ui-components';
import React, { useEffect } from 'react';
import { Route, Switch, RouteComponentProps } from 'react-router-dom';

import { AccountsSetup } from './AccountsSetup';
import { ONBOARDING_STEPS } from '../constants';
import { Claim } from './Claim';
import { TermsAndConditions } from './TermsAndConditions';

interface MatchParams {
  activeOnboardingStep: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export function Onboarding (props: Props) {
  const { match: { params: { activeOnboardingStep } } } = props;

  useEffect(() => {
    localStorage.setItem('isOnboarding', 'y');
  }, []);

  return (
    <Modal
      dimmer='inverted'
      open
      size='large'
    >
      <Margin top />
      <Stacked>
        <Breadcrumbs activeLabel={activeOnboardingStep.toUpperCase()} sectionLabels={ONBOARDING_STEPS} size='mini' />
        <Header margin='small'>Welcome to the Kusama Nominator Community.</Header>
      </Stacked>
      <Switch>
        <Route path={`/onboarding/${'T&C'}`} component={TermsAndConditions} />
        <Route path={'/onboarding/stash'} component={AccountsSetup} />
        <Route path={'/onboarding/controller'} component={AccountsSetup} />
        <Route path={'/onboarding/claim'} component={Claim} />
        <Route path={'/onboarding/bond'} component={StakingOptions} />
      </Switch>
    </Modal>
  );
}
