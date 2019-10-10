// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { Index } from '@polkadot/types/interfaces';
import { isUndefined } from '@polkadot/util';
import { AppContext, AlertsContext, StakingContext, TxQueueContext, validate, AllExtrinsicData } from '@substrate/ui-common';
import { AddressSummary, Dropdown, DropdownProps, FadedText, Header, Input, Margin, Stacked, StackedHorizontal, StyledNavButton, SubHeader, WithSpace, WithSpaceAround, WrapperDiv } from '@substrate/ui-components';
import BN from 'bn.js';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { combineLatest, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

import { Errors } from '../types';
import { Validation } from '../Validation';

interface MatchParams {
  currentAccount?: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  controller: string;
  stash: string;
}

type RewardDestinationOption = {
  text?: string,
  value?: number
};

export const rewardDestinationOptions = [
  { text: 'Send rewards to my Stash account and immediately use it to stake more.', value: 0 },
  { text: 'Send rewards to my Stash account but do not stake any more.', value: 1 },
  { text: 'Send rewards to my Controller account.', value: 2 }
];

export function Bond (props: Props) {
  const { api, keyring } = useContext(AppContext);
  const { enqueue: alert } = useContext(AlertsContext);
  const { derivedBalanceFees } = useContext(StakingContext);
  const { enqueue, successObservable } = useContext(TxQueueContext);
  const [bond, setBond] = useState<BN>(new BN(0));
  const [controllerBalance, setControllerBalance] = useState<DerivedBalances>();
  const [destination, setDestination] = useState<RewardDestinationOption>(rewardDestinationOptions[0]);
  const [loading, setLoading] = useState(false);
  const [nonce, setNonce] = useState<Index>();
  const [stashBalance, setStashBalance] = useState<DerivedBalances>();
  const [status, setStatus] = useState<Either<Errors, AllExtrinsicData>>();

  const { history } = props;

  let controller = props.controller;
  let stash = props.stash;

  if (!stash || !controller) {
    controller = history.location.state.controller;
    stash = history.location.state.stash;
  }

  const _validate = (): Either<Errors, AllExtrinsicData> => {
    let errors: Errors = [];

    if (bond.lte(new BN(0))) {
      errors.push('Bond must be greater than zero!');
    }

    if (isUndefined(derivedBalanceFees)) {
      errors.push('Calculating fees...please try again in a bit.');
    }

    if (isUndefined(stash)) {
      errors.push('Please select a stash account to bond from.');
    }

    if (isUndefined(destination)) {
      errors.push('Please select a reward distribution preference.');
    }

    if (errors.length) { return left(errors); }

    // WARNING: api on this changed v1 => v2 (before you stake with stash, now with controller)
    const extrinsic = api.tx.staking.bond(controller, bond, destination.value);
    const values = validate({
      amountAsString: bond.toString(),
      accountNonce: nonce,
      currentBalance: stashBalance,
      // @ts-ignore the extrinsic works when testing, not sure why tslint is getting the wrong type here
      extrinsic,
      fees: derivedBalanceFees,
      recipientBalance: controllerBalance,
      currentAccount: stash,
      recipientAddress: controller
    }, api);

    return values.fold(
      (e: any) => left(errors),
      (allExtrinsicData: any) => right(allExtrinsicData)
    );
  };

  // use api.consts when it is availabe in @polkadot/api
  useEffect(() => {
    if (!stash || !controller) {
      return;
    }

    const subscription: Subscription = combineLatest([
      api.derive.balances.votingBalance<DerivedBalances>(stash),
      api.derive.balances.votingBalance<DerivedBalances>(controller),
      api.query.system.accountNonce<Index>(stash)
    ]).pipe(
      take(1)
    ).subscribe(([stashBalance, controllerBalance, nonce]) => {
      setControllerBalance(controllerBalance);
      setStashBalance(stashBalance);
      setNonce(nonce);
    });

    return () => subscription.unsubscribe();
  }, [stash, controller]);

  useEffect(() => {
    setStatus(_validate());
  }, [bond, controllerBalance, nonce, stashBalance]);

  useEffect(() => {
    successObservable.subscribe((success) => {
      setLoading(false);
      history.push(`/manageAccounts/${controller}/balances`);
    });

    return () => successObservable.unsubscribe();
  }, []);

  const handleConfirmBond = () => {
    fromNullable(status)
      .map(_validate)
      .map(status => status.fold(
        (errors: any) => alert({ type: 'error', content: Object.values(errors) }),
        (allExtrinsicData: any) => {
          setLoading(true);
          const { extrinsic, amount, allFees, allTotal, recipientAddress: controller } = allExtrinsicData;
          const details = { amount, allFees, allTotal, methodCall: extrinsic.meta.name.toString(), senderPair: keyring.getPair(stash), recipientAddress: controller };
          enqueue(extrinsic, details);
        }
      ));
  };

  const handleSetBond = ({ currentTarget: { value } }: React.SyntheticEvent<HTMLInputElement>) => !isUndefined(value) ? setBond(new BN(value)) : setBond(new BN(0));

  const handleSetBondFromPercent = (value: number) => {
    if (!stashBalance || !value) { return; }

    const bondAmount = stashBalance.freeBalance.toNumber() * value;

    setBond(new BN(bondAmount));
  };

  const onSelect = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
    setDestination(rewardDestinationOptions[data.value as number]);
  };

  const renderContent = () => {
    return (
      <Stacked>
        <Header>Bonding Preferences </Header>
        <StackedHorizontal>
          <FadedText> Stash: </FadedText>
          <AddressSummary address={stash} noPlaceholderName orientation='horizontal' size='small' />
          <Margin left='huge' />
          <FadedText> Controller: </FadedText>
          <AddressSummary address={controller} noPlaceholderName orientation='horizontal' size='small' />
        </StackedHorizontal>
        <WithSpaceAround>
          <SubHeader>How much do you wish to stake?</SubHeader>
          {
            <Stacked>
              <WrapperDiv>
                <Input
                  label='Set Amount to Stake.'
                  onChange={handleSetBond}
                  placholder='The total amount of the Stash balance that will be at stake in any forthcoming eras (rewards are distributed in proportion to stake).'
                  value={bond.toString()}
                />
              </WrapperDiv>
              <StackedHorizontal>
                <WithSpace><button onClick={() => handleSetBondFromPercent(0.25)}>25%</button></WithSpace>
                <Margin left />
                <WithSpace><button onClick={() => handleSetBondFromPercent(0.5)}>50%</button></WithSpace>
                <Margin left />
                <WithSpace><button onClick={() => handleSetBondFromPercent(0.75)}>75%</button></WithSpace>
                <Margin left />
                <WithSpace><button onClick={() => handleSetBondFromPercent(1)}>100%</button></WithSpace>
              </StackedHorizontal>
            </Stacked>
          }
        </WithSpaceAround>
        <WithSpaceAround>
          <SubHeader> How would you like to have your share of the rewards deposited back to you?</SubHeader>
          <Dropdown
            fluid
            onChange={onSelect}
            options={rewardDestinationOptions}
            text={destination.text}
            value={destination.text}
          />
        </WithSpaceAround>
        <WithSpaceAround>
          <StyledNavButton onClick={handleConfirmBond}>Confirm</StyledNavButton>
        </WithSpaceAround>
        {status && <Validation value={status} />}
      </Stacked>
    );
  };

  const renderLoading = () => {
    return (
      <WrapperDiv>
        <Stacked>
          <Loader active inline />
          <SubHeader>Hang Tight! We Are Submitting Your Bond Request...</SubHeader>
        </Stacked>
      </WrapperDiv>
    );
  };

  return loading
    ? renderLoading()
    : renderContent();
}
