// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Compact, Option } from '@polkadot/types';
import { AccountId, Balance, Exposure, IndividualExposure, StakingLedger } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, DynamicSizeText, FadedText, Icon, Margin, Stacked, StyledLinkButton, SubHeader, Table, WithSpaceAround } from '@substrate/ui-components';
import { fromNullable, some } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { Subscription } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';

interface Props {
  addToNomineeList: (event: React.MouseEvent<HTMLElement>) => void;
  validator: AccountId;
}

// TODO: show validator preferences, i.e. commissions and times reported offline
export function ValidatorRow (props: Props): React.ReactElement {
  const { validator } = props;
  const { api, keyring } = useContext(AppContext);
  const [nominators, setNominators] = useState<[AccountId, Compact<Balance>][]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const subscription: Subscription = (
      //  FIXME: this stuff ought to be in BalanceDisplay: https://github.com/paritytech/substrate-light-ui/issues/471
      api.queryMulti<[Option<AccountId>, Option<StakingLedger>]>([
        [api.query.staking.bonded, validator], // try to map to controller
        [api.query.staking.ledger, validator] // try to map to stash
      ])
    )
      .pipe(
        switchMap(([controllerId, stakingLedger]) => {
          const stashId = controllerId.isSome ? controllerId.unwrap() : stakingLedger.isSome ? stakingLedger.unwrap().stash : validator;
          return api.query.staking.stakers<Exposure>(stashId);
        }),
        first()
      )
      .subscribe((stakers) => {
        const nominators = stakers ? stakers.others.map(({ who, value }: IndividualExposure): [AccountId, Compact<Balance>] => [who, value]) : [];
        setNominators(nominators); // the list of accounts that nominated this account
        setLoading(false);
      });

    return (): void => subscription.unsubscribe();
  }, [api, validator]);

  const renderAmINominating = (): React.ReactElement => {
    const myAddresses = keyring.getAccounts().map(({ address }): string => address);

    return fromNullable(nominators)
      .mapNullable(nominators => nominators.some(([who]) => myAddresses.includes(who.toString())))
      .mapNullable(amI => amI ? <Icon name='check' /> : <FadedText>You are not currently nominating this Validator.</FadedText>)
      .getOrElse(<FadedText>You are not currently nominating this Validator.</FadedText>);
  };

  const renderNominators = (): React.ReactElement => {
    return (
      loading
        ? <Loader active inline />
        : nominators.length > 0
          ? (
            <React.Fragment>
              <SubHeader>{nominators.length} nominators</SubHeader>
              {
                nominators.map(([who, bonded]) => (
                  <WithSpaceAround key={who.toString()}>
                    <Stacked>
                      <AddressSummary address={who.toString()} orientation='horizontal' noPlaceholderName size='tiny' />
                      <DynamicSizeText fontSize='small' fontWeight='200'><FadedText>Bonded Amount: {formatBalance(bonded)}</FadedText></DynamicSizeText>
                    </Stacked>
                  </WithSpaceAround>
                ))
              }
            </React.Fragment>
          )
          : <FadedText> No nominators </FadedText>
    );
  };

  return (
    <Table.Row key={validator.toString()} style={{ display: 'table-row' }}>
      <Table.Cell width='2'>
        {
          loading
            ? <FadedText>Please wait while we fetch validator data...</FadedText>
            : renderAmINominating()
        }
      </Table.Cell>
      <Table.Cell width='5'>
        <AddressSummary
          address={validator.toString()}
          justifyContent='center'
          orientation='vertical'
          name={fromNullable(keyring.getAddress(validator.toString()))
            .chain(account => some(account.meta))
            .chain(meta => some(meta.name))
            .getOrElse(undefined)}
          noPlaceholderName
          size='small'
          withShortAddress />
      </Table.Cell>
      <Table.Cell width='6' verticalAlign='middle'><div style={{ height: '200px', overflow: 'auto', verticalAlign: 'middle' }}>{renderNominators()}</div></Table.Cell>
      <Table.Cell width='3' verticalAlign='middle'>
        {
          loading
            ? <FadedText>Please wait while we fetch validator data...</FadedText>
            : (
              /* TODO see comment in index.tsx */
              <Stacked>
                <StyledLinkButton> View Details </StyledLinkButton>
                <Margin top />
                <StyledLinkButton onClick={props.addToNomineeList} data-nominee={validator.toString()}>Add To Cart </StyledLinkButton>
              </Stacked>
            )
        }
      </Table.Cell>
    </Table.Row>
  );
}
